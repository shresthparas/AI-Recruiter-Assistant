from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class PastCompany(BaseModel):
    company: str
    company_type: str = Field(description="One of: startup, scaleup, enterprise, agency")
    title: str
    years: float

class Candidate(BaseModel):
    id: str
    name: str
    current_title: str
    years_experience: int
    location: str
    current_company: str
    current_company_type: str = Field(description="One of: startup, scaleup, enterprise, agency")
    skills: List[str]
    past_companies: List[PastCompany] = Field(default_factory=list)
    education: str
    summary: str

class ObjectiveFilters(BaseModel):
    skills: List[str] = Field(default_factory=list, description="Specific tech skills or competencies required")
    min_years_experience: Optional[int] = Field(default=None, description="Minimum years of experience")
    max_years_experience: Optional[int] = Field(default=None, description="Maximum years of experience")
    locations: List[str] = Field(default_factory=list, description="Target locations, or empty if open/remote")
    company_types: List[str] = Field(default_factory=list, description="Target company types: startup, scaleup, enterprise, agency")

class RubricCriterion(BaseModel):
    id: str = Field(description="Short identifier, e.g., 'c1', 'startup_dna'")
    name: str = Field(description="Title of criterion, e.g., 'Startup Velocity & Ownership'")
    description: str = Field(description="Specific qualitative expectations for this role")
    weight: str = Field(default="high", description="Weight level: high, medium, low")

class SubjectiveRubric(BaseModel):
    criteria: List[RubricCriterion] = Field(default_factory=list)

class CandidateScore(BaseModel):
    candidate_id: str
    score: int = Field(ge=0, le=100, description="Fit score from 0 to 100 based on rubric")
    explanation: str = Field(description="Short, specific justification citing actual profile fields")
    matched_criteria: List[str] = Field(default_factory=list, description="Rubric criteria that matched")

class ScoredCandidate(BaseModel):
    candidate: Candidate
    score: int
    explanation: str
    matched_criteria: List[str] = Field(default_factory=list)
    feedback: Optional[str] = Field(default=None, description="'match' or 'pass' or custom note")

class SearchRequest(BaseModel):
    query: str

class SearchResponse(BaseModel):
    query: str
    filters: ObjectiveFilters
    rubric: SubjectiveRubric
    total_dataset_size: int
    filtered_pool_count: int
    candidates: List[ScoredCandidate]
    thinking_steps: List[str] = Field(default_factory=list)

class RefineRequest(BaseModel):
    query: str
    current_filters: ObjectiveFilters
    current_rubric: SubjectiveRubric
    chat_feedback: Optional[str] = None
    per_candidate_feedback: Optional[Dict[str, str]] = Field(default_factory=dict, description="e.g. {'p01': 'match', 'p04': 'pass'}")
    current_candidate_ids: List[str] = Field(default_factory=list)

class RefineResponse(BaseModel):
    updated_filters: ObjectiveFilters
    updated_rubric: SubjectiveRubric
    change_summary: str = Field(description="What changed in filters and rubric")
    why_changed: str = Field(description="Rationale based on recruiter feedback")
    total_dataset_size: int
    filtered_pool_count: int
    candidates: List[ScoredCandidate]

class ManualReevaluationRequest(BaseModel):
    filters: ObjectiveFilters
    rubric: SubjectiveRubric
