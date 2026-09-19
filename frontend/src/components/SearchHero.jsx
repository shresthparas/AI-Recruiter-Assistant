import React, { useState } from 'react';
import { Search, Sparkles, ArrowRight, Database, Target, Layers } from 'lucide-react';

export default function SearchHero({ onSearch, loading }) {
  const [query, setQuery] = useState('');

  const sampleQueries = [
    {
      title: "Assignment Example (RDS + Startups + Bangalore)",
      text: "RDS developers with 4-7 years of experience who have worked at startups, for a role based in Bangalore."
    },
    {
      title: "Fintech & Payments Engineers",
      text: "Backend engineers with 5-8 years experience who built high-throughput payments or ledger systems at high-growth startups."
    },
    {
      title: "FastAPI & Python Specialists",
      text: "Python engineers with FastAPI and PostgreSQL experience who have worked at startups or scaleups, located in Bangalore or Remote."
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !loading) {
      onSearch(query.trim());
    }
  };

  const handleSelectSample = (sampleText) => {
    setQuery(sampleText);
    onSearch(sampleText);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 sm:py-16 px-4 text-center">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold mb-6">
        <Sparkles className="w-4 h-4" />
        <span>Autonomous Sourcing & Calibration Engine</span>
      </div>

      <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
        What talent are you looking for?
      </h1>
      <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
        Describe your hiring need in free-text just like a Google search. Our AI decomposes it into
        verifiable objective filters and a calibrated subjective rubric.
      </p>

      {/* Free-text input form */}
      <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto mb-8">
        <div className="relative flex items-center shadow-2xl shadow-sky-500/10 rounded-2xl border border-slate-700/80 bg-slate-900/90 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20 transition-all">
          <Search className="w-5 h-5 text-slate-400 ml-4 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
            placeholder='e.g., "RDS developers with 4-7 years of experience who have worked at startups, for a role based in Bangalore."'
            className="w-full py-4 px-4 bg-transparent text-white placeholder-slate-500 text-sm sm:text-base focus:outline-none disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!query.trim() || loading}
            className="mr-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:hover:bg-sky-500 text-white font-semibold text-sm flex items-center gap-2 transition active:scale-95 shrink-0 shadow-md shadow-sky-500/20"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Searching...
              </span>
            ) : (
              <>
                <span>Source Candidates</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Quick sample chips */}
      <div className="max-w-3xl mx-auto text-left">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-slate-400" />
          Or try a sample sourcing requirement:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {sampleQueries.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              disabled={loading}
              onClick={() => handleSelectSample(sample.text)}
              className="p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-sky-500/40 text-left transition group"
            >
              <div className="text-xs font-semibold text-sky-400 group-hover:text-sky-300 mb-1 flex items-center justify-between">
                <span>{sample.title}</span>
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                "{sample.text}"
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Talent map indicators */}
      <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-sky-500/80" />
          <span>Talent Pool: <strong>48 curated local profiles</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-emerald-500/80" />
          <span>Stage 1: Deterministic Objective Filters</span>
        </div>
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-500/80" />
          <span>Stage 2: Gemini Rubric Scoring & Citations</span>
        </div>
      </div>
    </div>
  );
}
