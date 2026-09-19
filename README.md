# AI Recruiter: The Sourcing Refinement Loop

A full-stack candidate sourcing and calibration engine. This application takes a recruiter's natural language requirement, extracts objective filters and a subjective fit rubric using **Google Gemini**, deterministically filters candidates locally against `profiles.json`, ranks top matches with **field-cited explanations**, and provides an interactive refinement loop that iteratively updates criteria until frozen.

---

## Architecture Overview

```
                          ┌──────────────────────────┐
                          │  Recruiter Free-Text     │
                          │  "RDS devs, 4-7 yrs..."  │
                          └─────────────┬────────────┘
                                        │
                                        ▼
                          ┌──────────────────────────┐
                          │  Gemini Parse Engine     │
                          │  (Structured Extraction) │
                          └──────┬────────────┬──────┘
                                 │            │
                 [Objective Filters]        [Subjective Rubric]
                         │                    │
                         ▼                    │
            ┌──────────────────────────┐      │
            │ Deterministic Filter     │      │
            │ (Local profiles.json)    │      │
            └────────────┬─────────────┘      │
                         │                    │
               [Candidate Subset]             │
                         │                    │
                         ▼                    ▼
            ┌────────────────────────────────────────┐
            │ Gemini Scoring & Citation Engine       │
            │ (Scores 0-100 & cites profile fields)  │
            └────────────────────┬───────────────────┘
                                 │
                                 ▼
            ┌────────────────────────────────────────┐
            │ Active Workspace (Top 4-5 Candidates)  │
            │ - Live editable filters & rubric       │
            │ - Field citation banners               │
            │ - Thumbs Up / Down per-profile buttons │
            └────────────────────┬───────────────────┘
                                 │
               ┌─────────────────┴─────────────────┐
               │                                   │
               ▼ (Recruiter Chat / Reactions)      ▼ (Freeze Search)
    ┌──────────────────────────┐        ┌──────────────────────────┐
    │ Gemini Refinement Engine │        │ Final Frozen View        │
    │ - Summarizes DELTA       │        │ - Export Shortlist JSON  │
    │ - Explains WHY changed   │        │ - Copy Briefing Summary  │
    │ - Re-evaluates ranking   │        │ - Locked Filters/Rubric  │
    └──────────────────────────┘        └──────────────────────────┘
```

---

## Quickstart Guide

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ and npm



Set the environment variable or create `backend/.env`:
```bash
# In backend/.env
GEMINI_API_KEY=your_google_gemini_api_key_here
GEMINI_MODEL=gemini-3.6-flash
PORT=8000
```
> **Important:** The application reads the API key directly from `GEMINI_API_KEY`. It is never hardcoded or committed.

---

### 3. Run Backend (FastAPI)

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```
The backend will be live at `http://localhost:8000`. You can inspect interactive OpenAPI documentation at `http://localhost:8000/docs`.

---

### 4. Run Frontend (React + Vite)

In a separate terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## Evaluation Highlights

### 1. Transparent LLM Prompts in Repository
All prompts are stored in `backend/app/prompts/` for full inspection and grading:
- [`parse_prompt.py`](file:///backend/app/prompts/parse_prompt.py): Free-text extraction of objective filters & subjective rubric with strict JSON schema.
- [`score_prompt.py`](file:///backend/app/prompts/score_prompt.py): Enforces that match explanations **MUST cite actual fields** from the profile (`years_experience`, `current_company`, `skills`, `summary`).
- [`refine_prompt.py`](file:///backend/app/prompts/refine_prompt.py): Takes conversational feedback (e.g. *"1 is too junior, 2 and 4 are right"*) and per-profile reactions, computes the delta, and explains **what changed and why**.

### 2. Real LLM Calls with Robust Failure Handling
- **Server-Side Calls Only:** All LLM interactions are mediated by FastAPI server-side through Google Gemini.
- **Graceful Error Recovery:**
  - Rate limit detection (HTTP 429 / ResourceExhausted) automatically retries with exponential backoff and renders a clear recovery banner in the UI rather than crashing.
  - Missing API key detection with clear on-screen setup guidance.
  - JSON schema cleanup that strips markdown wrappers or irregular tokens.

### 3. Designed States Across the Entire User Journey
- **First Load:** Clean Google-like search bar with 1-click sample queries (including the assignment's exact prompt).
- **Thinking Moments:** 4-step transparent progress indicators showing what the AI is doing in real-time.
- **Empty Results:** If objective constraints eliminate all 48 profiles, the system renders intelligent suggestion chips to relax constraints (e.g., expand experience range or open to scaleups/remote).
- **Frozen State:** Locks the loop and renders a clean summary with copyable briefing and JSON export options.

---

## Technical & Product Decisions

### What Was Prioritized
1. **Explainability & Recruiter Trust:**
   - Instead of vague praise like *"great candidate"*, every candidate card includes an explicit citation callout citing exact years of experience, current/past companies, and matching technologies.
2. **Dual-Stage Sourcing Architecture:**
   - Objective filters (years, skills, location, company type) run deterministically in Python against the local `profiles.json` dataset.
   - LLM intelligence is reserved for rubric formulation, subjective fit scoring, and conversational calibration. This guarantees speed, predictability, and prevents hallucinations on hard constraints.
3. **Dual Interaction Modality:**
   - Recruiters can either converse naturally (*"1 is too junior, 2 and 4 are right"*) OR directly click thumbs up/down and edit filters in the live panel.
4. **State Carryover Across Refinement Rounds:**
   - Every round preserves the candidate context and previous criteria so the LLM understands references like *"candidate 1"* or *"make it more senior"*.

### What Was Cut & Why
- **User Authentication / Login:** Omitted to respect the challenge's strict scope (*"no login, no multiple roles, no persistence across sessions"*).
- **External Database:** Maintained local in-memory dataset loaded from `profiles.json` to allow the reviewer to run the project immediately with zero external database dependencies.
- **Multi-tenant Job Posting Management:** Kept the application laser-focused on single-session sourcing refinement loop quality.

---

## Candidate Dataset (`profiles.json`)

The dataset contains **48 fictional candidate profiles** adhering strictly to the schema provided in the challenge specification. It intentionally includes:
- **Direct Matches:** Candidates with 4-7 years experience, startup background, and AWS RDS in Bangalore.
- **Near Misses:** Candidates with 2-3 years exp (too junior) or 8-11 years exp (too senior), or candidates at scaleups/enterprises, or in other cities/remote.
- **Clear Non-Matches:** Frontend or mobile specialists with NoSQL/iOS backgrounds.

This gives the refinement loop rich signals to bite on during conversational feedback.
