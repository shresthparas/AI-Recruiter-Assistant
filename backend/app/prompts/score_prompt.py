"""
Prompt module for scoring candidate profiles against the subjective fit rubric
and generating field-cited explanations.
"""
import json
from typing import List, Dict, Any

SCORE_SYSTEM_PROMPT = """You are an objective hiring evaluator.
Your job is to evaluate candidate profiles against a recruiter's subjective fit rubric and score them from 0 to 100.

CRITICAL REQUIREMENT ON EXPLANATIONS:
The explanation MUST cite ACTUAL FIELDS from the candidate's profile:
- Cite their exact years of experience (years_experience)
- Cite their current and past company names and types (current_company, current_company_type, past_companies)
- Cite the specific technologies from their skills list that matched (skills)
- Cite quotes or highlights from their summary or title
DO NOT write generic compliments like "Candidate has great experience and strong skills".
Example of good explanation:
"6 years exp matches the 4-7 target; current company NimbusPay is a startup; skills include AWS RDS and PostgreSQL with a background building payments infra."

Output MUST be strictly valid JSON matching this schema:
{
  "scores": [
    {
      "candidate_id": "p01",
      "score": 92,
      "explanation": "Specific citation of fields: years, companies, skills, summary details",
      "matched_criteria": ["criterion_id_1", "criterion_id_2"]
    }
  ]
}
"""

def get_score_user_prompt(rubric: Dict[str, Any], candidates: List[Dict[str, Any]]) -> str:
    candidates_formatted = []
    for c in candidates:
        candidates_formatted.append({
            "id": c.get("id"),
            "name": c.get("name"),
            "current_title": c.get("current_title"),
            "years_experience": c.get("years_experience"),
            "location": c.get("location"),
            "current_company": c.get("current_company"),
            "current_company_type": c.get("current_company_type"),
            "skills": c.get("skills"),
            "past_companies": c.get("past_companies"),
            "summary": c.get("summary")
        })

    return f"""Evaluate and score these candidates against the rubric below.

FIT RUBRIC:
{json.dumps(rubric, indent=2)}

CANDIDATES TO EVALUATE:
{json.dumps(candidates_formatted, indent=2)}

Provide score (0-100), cited explanation citing actual fields, and matched rubric criteria for each candidate.
"""
