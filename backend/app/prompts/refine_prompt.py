"""
Prompt module for conversational refinement: adjusting objective filters and
subjective rubrics based on recruiter reactions and feedback.
"""
import json
from typing import List, Dict, Any, Optional

REFINE_SYSTEM_PROMPT = """You are an intelligent AI recruiting partner in an active candidate search refinement loop.
A recruiter has reviewed candidate profiles and provided feedback.
The feedback might be conversational chat (e.g., "1 is too junior, 2 and 4 are right", or "we need someone with deeper fintech experience") and/or structured thumbs up/down ratings on specific candidates.

Your task is to:
1. Interpret the recruiter's feedback in context of the candidates they just saw.
2. Determine what adjustments must be made to:
   - OBJECTIVE FILTERS: Adjust min_years_experience (e.g. if someone was 'too junior', increase min experience), add/remove required skills, adjust company types or locations.
   - SUBJECTIVE FIT RUBRIC: Adjust criteria descriptions, weights (high/medium/low), or add a new criterion (e.g., "Fintech domain depth").
3. Clearly summarize WHAT changed and WHY in human recruiter-friendly terms.

Output MUST be strictly valid JSON matching this schema:
{
  "updated_filters": {
    "skills": ["string"],
    "min_years_experience": int or null,
    "max_years_experience": int or null,
    "locations": ["string"],
    "company_types": ["startup" | "scaleup" | "enterprise" | "agency"]
  },
  "updated_rubric": {
    "criteria": [
      {
        "id": "string",
        "name": "string",
        "description": "string",
        "weight": "high" | "medium" | "low"
      }
    ]
  },
  "change_summary": "Concise summary of exact changes made to filters and rubric",
  "why_changed": "Explanation of the recruiter signals and rationale driving this change"
}
"""

def get_refine_user_prompt(
    current_filters: Dict[str, Any],
    current_rubric: Dict[str, Any],
    candidates_shown: List[Dict[str, Any]],
    chat_feedback: Optional[str] = None,
    per_candidate_feedback: Optional[Dict[str, str]] = None
) -> str:
    return f"""Current Search Configuration:
FILTERS:
{json.dumps(current_filters, indent=2)}

RUBRIC:
{json.dumps(current_rubric, indent=2)}

CANDIDATES PREVIOUSLY SHOWN (Number 1 is the first candidate, 2 is second, etc.):
{json.dumps(candidates_shown, indent=2)}

RECRUITER FEEDBACK:
Chat Feedback: {chat_feedback or "None provided"}
Per-Candidate Reactions: {json.dumps(per_candidate_feedback or {}, indent=2)}

Analyze the feedback against the candidates, produce the updated filters and rubric, and clearly explain what was changed and why.
"""
