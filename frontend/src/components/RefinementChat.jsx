import React, { useState } from 'react';
import { Send, Sparkles, MessageSquare, Info, RefreshCw, ThumbsUp, ThumbsDown } from 'lucide-react';

export default function RefinementChat({
  onRefine,
  loading,
  lastChangeSummary,
  lastWhyChanged,
  perCandidateFeedback = {},
  iteration
}) {
  const [chatInput, setChatInput] = useState('');

  const quickResponses = [
    "1 is too junior, 2 and 4 are right",
    "Focus more on early-stage startup velocity rather than scaleups",
    "Require stronger hands-on AWS RDS database tuning experience",
    "Relax years of experience slightly but keep startup requirement strict"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((chatInput.trim() || Object.keys(perCandidateFeedback).length > 0) && !loading) {
      onRefine(chatInput.trim());
      setChatInput('');
    }
  };

  const reactionCount = Object.keys(perCandidateFeedback).length;
  const matchCount = Object.values(perCandidateFeedback).filter((v) => v === 'match').length;
  const passCount = reactionCount - matchCount;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Conversational Sourcing Refinement</h3>
            <p className="text-[11px] text-slate-400">Provide natural language guidance or candidate reactions</p>
          </div>
        </div>

        {iteration > 0 && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-semibold">
            Iteration #{iteration}
          </span>
        )}
      </div>

      {/* AI Rationale banner if this is a refined state */}
      {lastChangeSummary && (
        <div className="mb-4 p-3.5 rounded-xl bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900 border border-indigo-500/30 text-xs animate-fadeIn">
          <div className="flex items-center gap-1.5 text-indigo-400 font-semibold mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Calibration Rationale:</span>
          </div>
          <div className="space-y-1 text-slate-200 pl-5">
            <div>
              <strong className="text-slate-400 font-medium">What changed: </strong>
              <span>{lastChangeSummary}</span>
            </div>
            {lastWhyChanged && (
              <div>
                <strong className="text-slate-400 font-medium">Why: </strong>
                <span>{lastWhyChanged}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pending feedback badge */}
      {reactionCount > 0 && (
        <div className="mb-3.5 px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-xs flex items-center justify-between">
          <span className="text-slate-400">Attached candidate feedback:</span>
          <div className="flex items-center gap-2">
            {matchCount > 0 && (
              <span className="inline-flex items-center gap-1 text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                <ThumbsUp className="w-3 h-3" /> {matchCount} matched
              </span>
            )}
            {passCount > 0 && (
              <span className="inline-flex items-center gap-1 text-red-400 font-medium bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                <ThumbsDown className="w-3 h-3" /> {passCount} passed
              </span>
            )}
          </div>
        </div>
      )}

      {/* Quick response chips */}
      <div className="mb-3">
        <span className="text-[11px] font-medium text-slate-500 block mb-1.5">Quick feedback presets:</span>
        <div className="flex flex-wrap gap-1.5">
          {quickResponses.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              disabled={loading}
              onClick={() => setChatInput(preset)}
              className="text-left px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 text-[11px] transition"
            >
              "{preset}"
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center rounded-xl border border-slate-700 bg-slate-950/80 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/20">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            disabled={loading}
            placeholder='e.g., "1 is too junior, 2 and 4 are right. Look for more payment infra experience"'
            className="w-full py-3 pl-3.5 pr-28 bg-transparent text-white placeholder-slate-500 text-xs focus:outline-none"
          />

          <button
            type="submit"
            disabled={(!chatInput.trim() && reactionCount === 0) || loading}
            className="absolute right-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white font-semibold text-xs flex items-center gap-1.5 transition active:scale-95 shadow"
          >
            {loading ? (
              <RefreshCw className="w-3 h-3 animate-spin" />
            ) : (
              <Send className="w-3 h-3" />
            )}
            <span>{loading ? 'Refining...' : 'Refine'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
