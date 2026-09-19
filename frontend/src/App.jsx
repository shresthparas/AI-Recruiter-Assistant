import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import SearchHero from './components/SearchHero';
import ThinkingState from './components/ThinkingState';
import FilterRubricPanel from './components/FilterRubricPanel';
import CandidateCard from './components/CandidateCard';
import RefinementChat from './components/RefinementChat';
import FrozenView from './components/FrozenView';
import ErrorBanner from './components/ErrorBanner';
import EmptyState from './components/EmptyState';
import { api } from './services/api';
import { Sparkles, Users, Lock, ChevronRight, Layers } from 'lucide-react';

export default function App() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState(null);
  const [rubric, setRubric] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [totalPoolCount, setTotalPoolCount] = useState(48);
  const [filteredPoolCount, setFilteredPoolCount] = useState(0);
  const [iteration, setIteration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('AI Recruiter is thinking...');
  const [error, setError] = useState(null);
  const [isFrozen, setIsFrozen] = useState(false);
  const [perCandidateFeedback, setPerCandidateFeedback] = useState({});
  const [lastChangeSummary, setLastChangeSummary] = useState('');
  const [lastWhyChanged, setLastWhyChanged] = useState('');

  // Check health / backend connectivity on mount
  useEffect(() => {
    api.getHealth()
      .then((data) => {
        if (!data.gemini_api_key_configured) {
          setError(
            'Google Gemini API key is not detected in backend/.env. Please configure GEMINI_API_KEY to enable real LLM sourcing and scoring.'
          );
        }
      })
      .catch(() => {
        setError(
          'Could not connect to FastAPI backend on http://localhost:8000. Please ensure the backend server is running.'
        );
      });
  }, []);

  const handleSearch = async (searchQuery) => {
    setLoading(true);
    setLoadingMessage(`Extracting filters & scoring candidates for "${searchQuery.slice(0, 45)}..."`);
    setError(null);
    setQuery(searchQuery);

    try {
      const data = await api.search(searchQuery);
      setFilters(data.filters);
      setRubric(data.rubric);
      setCandidates(data.candidates);
      setFilteredPoolCount(data.filtered_pool_count);
      setTotalPoolCount(data.total_dataset_size || 48);
      setIteration(1);
      setIsFrozen(false);
      setPerCandidateFeedback({});
      setLastChangeSummary('');
      setLastWhyChanged('');
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Failed to complete candidate search.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleRefine = async (chatText) => {
    setLoading(true);
    setLoadingMessage('Adapting filters & rubric from your feedback...');
    setError(null);

    try {
      const data = await api.refine({
        query,
        current_filters: filters,
        current_rubric: rubric,
        chat_feedback: chatText,
        per_candidate_feedback: perCandidateFeedback,
        current_candidate_ids: candidates.map((c) => c.candidate.id),
      });

      setFilters(data.updated_filters);
      setRubric(data.updated_rubric);
      setCandidates(data.candidates);
      setFilteredPoolCount(data.filtered_pool_count);
      setLastChangeSummary(data.change_summary);
      setLastWhyChanged(data.why_changed);
      setIteration((prev) => prev + 1);
      setPerCandidateFeedback({}); // reset reactions for new candidates
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Failed to refine candidate search.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleManualFilterUpdate = async ({ filters: updatedFilters, rubric: updatedRubric }) => {
    setLoading(true);
    setLoadingMessage('Re-evaluating talent pool against updated parameters...');
    setError(null);

    try {
      const data = await api.manualUpdate({
        filters: updatedFilters,
        rubric: updatedRubric,
      });
      setFilters(data.filters);
      setRubric(data.rubric);
      setCandidates(data.candidates);
      setFilteredPoolCount(data.filtered_pool_count);
      setLastChangeSummary('Manual edits applied to objective filters / rubric');
      setLastWhyChanged('Recruiter manually edited criteria in the configuration panel.');
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Failed to apply manual filter updates.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackChange = (candidateId, feedbackVal) => {
    setPerCandidateFeedback((prev) => {
      const updated = { ...prev };
      if (!feedbackVal) {
        delete updated[candidateId];
      } else {
        updated[candidateId] = feedbackVal;
      }
      return updated;
    });
  };

  const handleRelaxFilters = (type) => {
    if (!filters) return;
    let newFilters = { ...filters };

    if (type === 'exp') {
      newFilters.min_years_experience = 3;
      newFilters.max_years_experience = 9;
    } else if (type === 'company') {
      newFilters.company_types = ['startup', 'scaleup', 'enterprise', 'agency'];
    } else if (type === 'location') {
      newFilters.locations = [];
    }

    handleManualFilterUpdate({ filters: newFilters, rubric });
  };

  const handleReset = () => {
    setIteration(0);
    setFilters(null);
    setRubric(null);
    setCandidates([]);
    setPerCandidateFeedback({});
    setIsFrozen(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-sky-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        isFrozen={isFrozen}
        onFreeze={() => setIsFrozen(true)}
        onReset={handleReset}
        iteration={iteration}
        candidateCount={filteredPoolCount}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {/* Error notification banner */}
        <ErrorBanner
          error={error}
          onRetry={() => {
            if (query) handleSearch(query);
            else setError(null);
          }}
          onDismiss={() => setError(null)}
        />

        {/* State 1: Clean First Load Search Screen */}
        {iteration === 0 && !loading && (
          <SearchHero onSearch={handleSearch} loading={loading} />
        )}

        {/* State 2: Thinking Moments */}
        {loading && <ThinkingState message={loadingMessage} />}

        {/* State 3: Frozen Final View */}
        {isFrozen && filters && rubric && (
          <FrozenView
            filters={filters}
            rubric={rubric}
            candidates={candidates}
            onUnfreeze={() => setIsFrozen(false)}
            iteration={iteration}
          />
        )}

        {/* State 4: Active Sourcing Refinement Workspace */}
        {iteration > 0 && !loading && !isFrozen && (
          <div className="space-y-6">
            {/* Search Query Pill & Iteration Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Query:</span>
                <span className="text-sm font-semibold text-white bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
                  "{query}"
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Deterministic Matches: <strong className="text-white">{filteredPoolCount} of 48</strong></span>
                <span className="text-slate-600">•</span>
                <span className="text-sky-400 font-medium">Showing top {candidates.length} ranked by Gemini</span>
              </div>
            </div>

            {/* Main Dual-Column Layout: Left (Filters & Rubric), Right (Candidates & Refinement Chat) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Editable Filters & Subjective Rubric (4 cols) */}
              <div className="lg:col-span-4">
                <FilterRubricPanel
                  filters={filters}
                  rubric={rubric}
                  onApplyManualUpdate={handleManualFilterUpdate}
                  isUpdating={loading}
                />
              </div>

              {/* Right Column: Candidate Profiles & Refinement Input (8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                {/* Empty Results Fallback */}
                {candidates.length === 0 ? (
                  <EmptyState filters={filters} onRelaxFilters={handleRelaxFilters} />
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-sky-400" />
                        <span>Top Matched Profiles ({candidates.length})</span>
                      </h3>
                      <span className="text-xs text-slate-400">Ranked against subjective fit rubric</span>
                    </div>

                    {candidates.map((c, idx) => (
                      <CandidateCard
                        key={c.candidate.id}
                        candidate={c.candidate}
                        score={c.score}
                        explanation={c.explanation}
                        matchedCriteria={c.matched_criteria}
                        index={idx}
                        feedback={perCandidateFeedback[c.candidate.id]}
                        onFeedbackChange={handleFeedbackChange}
                        isFrozen={isFrozen}
                      />
                    ))}
                  </div>
                )}

                {/* Conversational Refinement Input Bar */}
                <RefinementChat
                  onRefine={handleRefine}
                  loading={loading}
                  lastChangeSummary={lastChangeSummary}
                  lastWhyChanged={lastWhyChanged}
                  perCandidateFeedback={perCandidateFeedback}
                  iteration={iteration}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-5 text-center text-xs text-slate-500 mt-auto">
        AI Recruiter Sourcing Refinement Loop
      </footer>
    </div>
  );
}
