import os
from dotenv import load_dotenv
from app.filter_engine import FilterEngine
from app.schemas import ObjectiveFilters

load_dotenv()

def test_local():
    print("========================================")
    print("1. TESTING LOCAL DATASET & FILTER ENGINE")
    print("========================================")
    fe = FilterEngine()
    profiles = fe.get_all_profiles()
    print(f"Total profiles loaded: {len(profiles)}")
    assert len(profiles) == 48, f"Expected 48 profiles, got {len(profiles)}"
    print("Sample profile 1:", profiles[0]["name"], "-", profiles[0]["current_company"])

    # Test filtering with assignment query criteria: 4-7 yrs, Bangalore, startup, RDS
    filters = ObjectiveFilters(
        skills=["AWS RDS", "RDS"],
        min_years_experience=4,
        max_years_experience=7,
        locations=["Bangalore"],
        company_types=["startup"]
    )
    matches = fe.apply_objective_filters(filters)
    print(f"Objective matches for '4-7 yrs, Bangalore, startup, RDS': {len(matches)} profiles")
    for m in matches[:3]:
        print(f"  -> {m['name']} ({m['years_experience']}y, {m['current_company']}, {m['location']})")

    print("\n========================================")
    print("2. CHECKING GEMINI API KEY STATUS")
    print("========================================")
    key = os.getenv("GEMINI_API_KEY", "").strip()
    if not key or key == "your_gemini_api_key_here":
        print("[!] GEMINI_API_KEY is NOT set in backend/.env yet.")
        print("    Please open backend/.env and paste your API key from Google AI Studio.")
    else:
        print("[OK] GEMINI_API_KEY detected! Testing Gemini LLM call...")
        try:
            from app.gemini_service import GeminiService
            gs = GeminiService()
            res = gs.parse_query("RDS developers with 4-7 years of experience who have worked at startups, for a role based in Bangalore.")
            print("[OK] Gemini parse successful!")
            print("     Extracted filters:", res.get("filters"))
            print("     Extracted rubric criteria count:", len(res.get("rubric", {}).get("criteria", [])))
        except Exception as e:
            print("[ERROR] Calling Gemini:", e)

    print("\nLocal test complete!")

if __name__ == "__main__":
    test_local()
