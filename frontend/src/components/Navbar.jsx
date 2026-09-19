import React from 'react';
import { Sparkles, Users, Lock, RotateCcw } from 'lucide-react';

export default function Navbar({ isFrozen, onFreeze, onReset, iteration, candidateCount }) {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-40 px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base tracking-tight">AI Recruiter</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 font-medium">
                Sourcing Refinement Loop
              </span>
            </div>
            <p className="text-xs text-slate-400">Intelligent candidate sourcing & iterative fit calibration</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {iteration > 0 && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <Users className="w-3.5 h-3.5 text-sky-400" />
              <span>Pool: <strong className="text-white">{candidateCount}</strong> candidates</span>
              <span className="text-slate-600">•</span>
              <span>Round <strong className="text-sky-400">{iteration}</strong></span>
            </div>
          )}

          {iteration > 0 && !isFrozen && (
            <button
              onClick={onFreeze}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 transition active:scale-95"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Freeze Search</span>
            </button>
          )}

          {iteration > 0 && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-slate-300 text-xs font-medium transition"
              title="Start a fresh search session"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">New Search</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
