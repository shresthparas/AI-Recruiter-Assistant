import json
import os
from typing import List, Dict, Any, Optional
from .schemas import Candidate, ObjectiveFilters

class FilterEngine:
    def __init__(self, data_path: Optional[str] = None):
        if not data_path:
            # Check local data dir first, then parent
            possible_paths = [
                os.path.join(os.path.dirname(__file__), "..", "data", "profiles.json"),
                os.path.join(os.path.dirname(__file__), "..", "..", "profiles.json"),
                "profiles.json"
            ]
            for p in possible_paths:
                if os.path.exists(p):
                    data_path = p
                    break
            if not data_path:
                data_path = "backend/data/profiles.json"

        self.data_path = data_path
        self.profiles: List[Dict[str, Any]] = self._load_profiles()

    def _load_profiles(self) -> List[Dict[str, Any]]:
        try:
            with open(self.data_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading profiles from {self.data_path}: {e}")
            return []

    def get_all_profiles(self) -> List[Dict[str, Any]]:
        # Reload dynamically in case user edits profiles.json during runtime
        if os.path.exists(self.data_path):
            try:
                with open(self.data_path, "r", encoding="utf-8") as f:
                    self.profiles = json.load(f)
            except Exception:
                pass
        return self.profiles

    def get_candidate_by_id(self, cid: str) -> Optional[Dict[str, Any]]:
        for p in self.get_all_profiles():
            if p.get("id") == cid:
                return p
        return None

    def apply_objective_filters(self, filters: ObjectiveFilters) -> List[Dict[str, Any]]:
        """
        Deterministically filters the 48 candidate profiles against objective criteria:
        - years_experience (min / max)
        - location (case-insensitive substring or remote)
        - company_types (matches current_company_type or any past_company)
        - skills (intersection or keyword match in skills/summary)
        """
        candidates = self.get_all_profiles()
        matched = []

        for candidate in candidates:
            exp = candidate.get("years_experience", 0)

            # 1. Experience Check
            if filters.min_years_experience is not None:
                if exp < filters.min_years_experience:
                    continue
            if filters.max_years_experience is not None:
                if exp > filters.max_years_experience:
                    continue

            # 2. Location Check
            if filters.locations and len(filters.locations) > 0:
                cand_loc = candidate.get("location", "").lower()
                target_locs = [loc.lower() for loc in filters.locations if loc]
                
                # If target is specified, match if candidate is in location or Remote
                loc_match = any(
                    t in cand_loc or cand_loc in t or "remote" in cand_loc
                    for t in target_locs
                )
                if not loc_match and target_locs:
                    continue

            # 3. Company Type Check (e.g. startup, scaleup, enterprise, agency)
            if filters.company_types and len(filters.company_types) > 0:
                target_types = {t.lower() for t in filters.company_types}
                current_type = candidate.get("current_company_type", "").lower()
                past_types = {
                    (p.get("company_type") or "").lower()
                    for p in candidate.get("past_companies", [])
                }
                all_candidate_types = past_types | {current_type}

                if not (all_candidate_types & target_types):
                    continue

            # 4. Skills Check
            if filters.skills and len(filters.skills) > 0:
                target_skills = [s.lower() for s in filters.skills if s]
                candidate_skills = [s.lower() for s in candidate.get("skills", [])]
                summary = (candidate.get("summary") or "").lower()
                title = (candidate.get("current_title") or "").lower()

                # Score skill match: has at least one matching core skill
                has_any_skill = False
                for ts in target_skills:
                    # Match exact or substring (e.g. "rds" in "aws rds")
                    if any(ts in cs or cs in ts for cs in candidate_skills) or (ts in summary) or (ts in title):
                        has_any_skill = True
                        break
                
                if not has_any_skill:
                    continue

            matched.append(candidate)

        return matched
