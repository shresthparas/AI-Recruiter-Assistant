import React from 'react';
import { AlertTriangle, RefreshCw, KeyRound, X } from 'lucide-react';

export default function ErrorBanner({ error, onRetry, onDismiss }) {
  if (!error) return null;

  const isApiKeyError = error.includes('GEMINI_API_KEY') || error.includes('not configured');
  const isRateLimit = error.includes('429') || error.includes('rate limit') || error.includes('quota');

  return (
    <div className="max-w-4xl mx-auto my-4 p-4 rounded-2xl bg-red-950/40 border border-red-500/40 shadow-xl animate-fadeIn text-left">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
            {isApiKeyError ? <KeyRound className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          </div>
          <div>
            <h4 className="font-bold text-sm text-red-300">
              {isApiKeyError
                ? 'Gemini API Key Required'
                : isRateLimit
                ? 'Gemini API Rate Limit Reached'
                : 'Sourcing Error Encountered'}
            </h4>
            <p className="text-xs text-red-200/80 mt-1 leading-relaxed">{error}</p>

            {isApiKeyError && (
              <div className="mt-3 p-2.5 rounded-lg bg-slate-950/80 border border-red-500/20 text-[11px] text-slate-300 font-mono">
                <code>Add to backend/.env: GEMINI_API_KEY=AIzaSy...</code>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/80 hover:bg-red-500 text-white text-xs font-semibold shadow transition active:scale-95"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          )}

          {onDismiss && (
            <button
              onClick={onDismiss}
              className="p-1 rounded-lg text-red-400 hover:text-white hover:bg-red-900/40 transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
