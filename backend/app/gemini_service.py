import os
import json
import re
import time
from typing import Dict, Any, List, Optional
import google.generativeai as genai
from fastapi import HTTPException
from dotenv import load_dotenv

from .prompts.parse_prompt import PARSE_SYSTEM_PROMPT, get_parse_user_prompt
from .prompts.score_prompt import SCORE_SYSTEM_PROMPT, get_score_user_prompt
from .prompts.refine_prompt import REFINE_SYSTEM_PROMPT, get_refine_user_prompt
from .schemas import ObjectiveFilters, SubjectiveRubric, CandidateScore

load_dotenv()

class GeminiService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY", "").strip()
        self.model_name = os.getenv("GEMINI_MODEL", "gemini-3.6-flash").strip()
        if self.api_key:
            genai.configure(api_key=self.api_key)

    def _ensure_api_key(self):
        if not self.api_key:
            # Recheck environment variable dynamically in case user added it to .env
            load_dotenv()
            self.api_key = os.getenv("GEMINI_API_KEY", "").strip()
            if self.api_key:
                genai.configure(api_key=self.api_key)
            else:
                raise HTTPException(
                    status_code=500,
                    detail="GEMINI_API_KEY is not configured. Please add your Google Gemini API key to backend/.env or set it as an environment variable."
                )

    def _clean_json_text(self, text: str) -> str:
        """Strip markdown ticks and whitespace if LLM wrapped output."""
        text = text.strip()
        if text.startswith("```json"):
            text = text[7:]
        elif text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        return text.strip()

    def _call_gemini_with_retry(self, system_instruction: str, user_content: str, max_retries: int = 2) -> str:
        self._ensure_api_key()
        last_error = None

        for attempt in range(max_retries + 1):
            try:
                model = genai.GenerativeModel(
                    model_name=self.model_name,
                    system_instruction=system_instruction,
                    generation_config={
                        "temperature": 0.2,
                        "response_mime_type": "application/json"
                    }
                )
                response = model.generate_content(user_content)
                if response and response.text:
                    return response.text
                raise ValueError("Empty response returned by Gemini model.")

            except Exception as e:
                err_msg = str(e)
                last_error = e
                # Check for rate limit or quota issues
                if "429" in err_msg or "ResourceExhausted" in err_msg or "quota" in err_msg.lower():
                    if attempt < max_retries:
                        time.sleep(2 * (attempt + 1))
                        continue
                    raise HTTPException(
                        status_code=429,
                        detail="Gemini API rate limit reached. Please wait a few seconds before refining or searching again."
                    )
                elif attempt < max_retries:
                    time.sleep(1)
                    continue

        raise HTTPException(
            status_code=502,
            detail=f"Failed to communicate with Gemini API: {str(last_error)}"
        )

    def parse_query(self, query: str) -> Dict[str, Any]:
        """Converts free-text query into objective filters and fit rubric."""
        user_prompt = get_parse_user_prompt(query)
        raw_output = self._call_gemini_with_retry(PARSE_SYSTEM_PROMPT, user_prompt)
        cleaned = self._clean_json_text(raw_output)

        try:
            data = json.loads(cleaned)
            # Validate structure
            if "filters" not in data or "rubric" not in data:
                raise ValueError("Missing 'filters' or 'rubric' keys in output")
            return data
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Could not parse structured filters from Gemini response: {e}\nRaw: {cleaned[:300]}"
            )

    def score_candidates(self, rubric: Dict[str, Any], candidates: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Scores candidate profiles against rubric with field-cited explanations."""
        if not candidates:
            return []

        # Send candidates in batch (top 15 max to ensure prompt fits easily and scores accurately)
        batch = candidates[:15]
        user_prompt = get_score_user_prompt(rubric, batch)
        raw_output = self._call_gemini_with_retry(SCORE_SYSTEM_PROMPT, user_prompt)
        cleaned = self._clean_json_text(raw_output)

        try:
            data = json.loads(cleaned)
            scores = data.get("scores", []) if isinstance(data, dict) else data
            return scores
        except Exception as e:
            # Fallback if malformed: attempt regex extraction of score objects
            try:
                matches = re.findall(r'\{[^{}]*"candidate_id"[^{}]*\}', cleaned)
                parsed = [json.loads(m) for m in matches]
                if parsed:
                    return parsed
            except Exception:
                pass
            raise HTTPException(
                status_code=500,
                detail=f"Failed to parse candidate scores from Gemini response: {e}\nRaw: {cleaned[:300]}"
            )

    def refine_search(
        self,
        current_filters: Dict[str, Any],
        current_rubric: Dict[str, Any],
        candidates_shown: List[Dict[str, Any]],
        chat_feedback: Optional[str] = None,
        per_candidate_feedback: Optional[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        """Refines filters and rubric based on recruiter chat and per-candidate signals."""
        user_prompt = get_refine_user_prompt(
            current_filters=current_filters,
            current_rubric=current_rubric,
            candidates_shown=candidates_shown,
            chat_feedback=chat_feedback,
            per_candidate_feedback=per_candidate_feedback
        )
        raw_output = self._call_gemini_with_retry(REFINE_SYSTEM_PROMPT, user_prompt)
        cleaned = self._clean_json_text(raw_output)

        try:
            data = json.loads(cleaned)
            return data
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to parse refinement output from Gemini: {e}\nRaw: {cleaned[:300]}"
            )
