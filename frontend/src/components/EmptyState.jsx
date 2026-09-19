import React from 'react';
import { UserX, RefreshCw, SlidersHorizontal, Sparkles } from 'lucide-react';

export default function EmptyState({ filters, onRelaxFilters }) {
  return (
    <div className="p-10 rounded-2xl bg-slate-900/80 border border-slate-800 text-center max-w-xl mx-auto my-6 shadow-xl">
      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4">
        <UserX className="w-6 h-6" />
      </div>

      <h3 className="text-lg font-bold text-white mb-2">No Candidates Matched Exact Filters</h3>
      <p className="text-xs text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
        The current objective constraints filtered out all 48 candidate profiles in the talent pool. Try relaxing the experience bounds, locations, or company pedigree criteria.
      </p>

      {/* Suggested filter adjustments */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => onRelaxFilters('exp')}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition flex items-center gap-1.5"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-sky-400" />
          <span>Widen Experience (3-9 yrs)</span>
        </button>

        <button
          onClick={() => onRelaxFilters('company')}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition flex items-center gap-1.5"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
          <span>Include Scaleups & Enterprises</span>
        </button>

        <button
          onClick={() => onRelaxFilters('location')}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition flex items-center gap-1.5"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
          <span>Include Remote Profiles</span>
        </button>
      </div>
    </div>
  );
}
