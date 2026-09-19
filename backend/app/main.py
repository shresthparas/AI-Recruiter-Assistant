import os
from typing import List, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from .schemas import (
    SearchRequest, SearchResponse,
    RefineRequest, RefineResponse,
    ManualReevaluationRequest,
    Candidate, ScoredCandidate,
    ObjectiveFilters, SubjectiveRubric
)
from .filter_engine import FilterEngine
from .gemini_service import GeminiService

load_dotenv()

app = FastAPI(
    title="AI Recruiter - Sourcing Refinement Loop",
    description="Backend API for candidate sourcing, objective filtering, rubric scoring, and conversational refinement.",
    version="1.0.0"
)

# Enable CORS for React frontend (Vite runs on port 5173 by default)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

filter_engine = FilterEngine()
gemini_service = GeminiService()


def rank_and_score_candidates(filtered_candidates: List[Dict[str, Any]], rubric_dict: Dict[str, Any]) -> List[ScoredCandidate]:
    """Scores filtered candidates against rubric and formats as ScoredCandidate objects."""
    if not filtered_candidates:
        return []

    # Score top 12 candidates through LLM
    pool_to_score = filtered_candidates[:12]
    scores = gemini_service.score_candidates(rubric_dict, pool_to_score)
    score_map = {s.get("candidate_id"): s for s in scores if isinstance(s, dict)}

    scored_list = []
    for cand in filtered_candidates:
        cid = cand.get("id")
        score_info = score_map.get(cid, {})
        score_val = score_info.get("score", 70)
        explanation = score_info.get(
            "explanation",
            f"{cand.get('years_experience')} years experience as {cand.get('current_title')} at {cand.get('current_company')} ({cand.get('current_company_type')}). Skills: {', '.join(cand.get('skills', [])[:3])}."
        )
        matched_criteria = score_info.get("matched_criteria", [])

        scored_list.append(
            ScoredCandidate(
                candidate=Candidate(**cand),
                score=score_val,
                explanation=explanation,
                matched_criteria=matched_criteria
            )
        )

    # Sort descending by score
    scored_list.sort(key=lambda x: x.score, reverse=True)
    return scored_list


@app.get("/api/health")
def health_check():
    has_api_key = bool(os.getenv("GEMINI_API_KEY", "").strip())
    total_profiles = len(filter_engine.get_all_profiles())
    return {
        "status": "healthy",
        "gemini_api_key_configured": has_api_key,
        "profiles_loaded": total_profiles,
        "model": os.getenv("GEMINI_MODEL", "gemini-3.6-flash")
    }


@app.get("/api/candidates")
def get_all_candidates():
    return filter_engine.get_all_profiles()


@app.post("/api/search", response_model=SearchResponse)
def search_candidates(req: SearchRequest):
    if not req.query or not req.query.strip():
        raise HTTPException(status_code=400, detail="Search query cannot be empty.")

    # 1. Free text -> structured filters & subjective rubric
    parsed = gemini_service.parse_query(req.query)
    filters_data = parsed.get("filters", {})
    rubric_data = parsed.get("rubric", {})

    objective_filters = ObjectiveFilters(**filters_data)
    subjective_rubric = SubjectiveRubric(**rubric_data)

    # 2. Local deterministic filter against profiles.json
    all_profiles = filter_engine.get_all_profiles()
    filtered_profiles = filter_engine.apply_objective_filters(objective_filters)

    # 3. Score and rank matching candidates
    scored_candidates = rank_and_score_candidates(filtered_profiles, subjective_rubric.model_dump())

    # Return top 4-5 profiles as requested
    top_candidates = scored_candidates[:5]

    thinking_steps = [
        f"Analyzed query: '{req.query}'",
        f"Extracted {len(objective_filters.skills)} skills and {len(subjective_rubric.criteria)} rubric criteria",
        f"Filtered 48 candidate profiles down to {len(filtered_profiles)} matches",
        f"Scored candidates against fit rubric and ranked top {len(top_candidates)}"
    ]

    return SearchResponse(
        query=req.query,
        filters=objective_filters,
        rubric=subjective_rubric,
        total_dataset_size=len(all_profiles),
        filtered_pool_count=len(filtered_profiles),
        candidates=top_candidates,
        thinking_steps=thinking_steps
    )


@app.post("/api/refine", response_model=RefineResponse)
def refine_search(req: RefineRequest):
    if not req.chat_feedback and not req.per_candidate_feedback:
        raise HTTPException(status_code=400, detail="Please provide either chat feedback or per-profile reactions.")

    # Fetch context of previously shown candidates
    candidates_shown = []
    for cid in req.current_candidate_ids:
        c = filter_engine.get_candidate_by_id(cid)
        if c:
            candidates_shown.append(c)

    # If no candidate IDs were passed, grab first 5 matching current filters
    if not candidates_shown:
        candidates_shown = filter_engine.apply_objective_filters(req.current_filters)[:5]

    # LLM adjusts filters and rubric
    refinement = gemini_service.refine_search(
        current_filters=req.current_filters.model_dump(),
        current_rubric=req.current_rubric.model_dump(),
        candidates_shown=candidates_shown,
        chat_feedback=req.chat_feedback,
        per_candidate_feedback=req.per_candidate_feedback
    )

    updated_filters = ObjectiveFilters(**refinement.get("updated_filters", req.current_filters.model_dump()))
    updated_rubric = SubjectiveRubric(**refinement.get("updated_rubric", req.current_rubric.model_dump()))
    change_summary = refinement.get("change_summary", "Updated filters and rubric based on your feedback.")
    why_changed = refinement.get("why_changed", "Refined criteria to better match desired candidate traits.")

    # Re-filter against profiles.json
    all_profiles = filter_engine.get_all_profiles()
    filtered_profiles = filter_engine.apply_objective_filters(updated_filters)

    # Re-score candidates against updated rubric
    scored_candidates = rank_and_score_candidates(filtered_profiles, updated_rubric.model_dump())
    top_candidates = scored_candidates[:5]

    return RefineResponse(
        updated_filters=updated_filters,
        updated_rubric=updated_rubric,
        change_summary=change_summary,
        why_changed=why_changed,
        total_dataset_size=len(all_profiles),
        filtered_pool_count=len(filtered_profiles),
        candidates=top_candidates
    )


@app.post("/api/manual-filter", response_model=SearchResponse)
def manual_update_filter(req: ManualReevaluationRequest):
    """Allows direct recruiter editing of filters/rubric without chat."""
    all_profiles = filter_engine.get_all_profiles()
    filtered_profiles = filter_engine.apply_objective_filters(req.filters)
    scored_candidates = rank_and_score_candidates(filtered_profiles, req.rubric.model_dump())
    top_candidates = scored_candidates[:5]

    return SearchResponse(
        query="Manual Filter Update",
        filters=req.filters,
        rubric=req.rubric,
        total_dataset_size=len(all_profiles),
        filtered_pool_count=len(filtered_profiles),
        candidates=top_candidates,
        thinking_steps=[
            f"Applied manual filter updates",
            f"Filtered pool: {len(filtered_profiles)} candidates",
            f"Re-scored top candidates against updated rubric"
        ]
    )
