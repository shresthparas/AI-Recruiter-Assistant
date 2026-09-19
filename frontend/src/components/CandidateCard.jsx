import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Building2, MapPin, Briefcase, GraduationCap, Sparkles, Check, ChevronDown } from 'lucide-react';

export default function CandidateCard({
  candidate,
  score,
  explanation,
  matchedCriteria,
  index,
  feedback,
  onFeedbackChange,
  isFrozen
}) {
  const [showRejectReasons, setShowRejectReasons] = useState(false);

  const c = candidate;

  const getCompanyTypeBadge = (type) => {
    switch (type?.toLowerCase()) {
      case 'startup':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'scaleup':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'enterprise':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'agency':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getScoreColor = (sc) => {
    if (sc >= 85) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    if (sc >= 70) return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
    return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  };

  const rejectOptions = [
    'Too junior',
    'Too senior',
    'Missing required tech',
    'Wrong company pedigree',
    'Culture / Summary mismatch'
  ];

  return (
    <div
      className={`relative rounded-2xl border transition-all duration-200 bg-slate-900/80 p-5 shadow-lg ${
        feedback === 'match'
          ? 'border-emerald-500/60 ring-1 ring-emerald-500/30'
          : feedback?.startsWith('pass')
          ? 'border-red-500/40 opacity-75'
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* Top row: Index badge, Name & Title, and Fit Score */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm text-sky-400 shrink-0 shadow">
            #{index + 1}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-base text-white">{c.name}</h4>
              <span className={`text-[11px] px-2 py-0.5 rounded-full border capitalize font-medium ${getCompanyTypeBadge(c.current_company_type)}`}>
                {c.current_company_type}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              {c.current_title} at <span className="text-white font-semibold">{c.current_company}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className={`px-3 py-1 rounded-xl border text-xs font-bold flex items-center gap-1.5 shadow-sm ${getScoreColor(score)}`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>{score}% Match</span>
          </div>
        </div>
      </div>

      {/* Meta tags: Exp, Location, Education */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400 mb-3.5 pb-3 border-b border-slate-800/80">
        <span className="flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-slate-500" />
          <strong className="text-slate-200">{c.years_experience} years</strong> experience
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-slate-500" />
          <span>{c.location}</span>
        </span>
        {c.education && (
          <span className="flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
            <span className="truncate max-w-[220px]">{c.education}</span>
          </span>
        )}
      </div>

      {/* Profile Summary */}
      <p className="text-xs text-slate-300 leading-relaxed mb-3 italic bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
        "{c.summary}"
      </p>

      {/* Skills chips */}
      <div className="mb-3.5">
        <div className="flex flex-wrap gap-1.5">
          {(c.skills || []).map((skill, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60 text-[11px] font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Past Companies if any */}
      {c.past_companies && c.past_companies.length > 0 && (
        <div className="mb-3.5 text-xs text-slate-400 flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-500 font-medium">Prior:</span>
          {c.past_companies.map((p, idx) => (
            <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800/50 border border-slate-800 text-[11px] text-slate-300">
              <Building2 className="w-3 h-3 text-slate-500" />
              {p.company} ({p.company_type}, {p.years}y)
            </span>
          ))}
        </div>
      )}

      {/* AI Cited Match Explanation Banner */}
      <div className="p-3 rounded-xl bg-gradient-to-r from-sky-950/40 to-indigo-950/30 border border-sky-500/20 text-xs mb-4">
        <div className="flex items-center gap-1.5 text-sky-400 font-semibold mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Why this profile matched (field citations):</span>
        </div>
        <p className="text-slate-200 text-xs leading-relaxed pl-5">
          {explanation}
        </p>
      </div>

      {/* Recruiter per-profile feedback buttons */}
      {!isFrozen && (
        <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
          <span className="text-xs text-slate-400 font-medium">Does this match?</span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onFeedbackChange(c.id, feedback === 'match' ? null : 'match')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition active:scale-95 ${
                feedback === 'match'
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{feedback === 'match' ? 'Marked Match' : 'Match'}</span>
            </button>

            <div className="relative">
              <button
                onClick={() => {
                  if (feedback?.startsWith('pass')) {
                    onFeedbackChange(c.id, null);
                    setShowRejectReasons(false);
                  } else {
                    onFeedbackChange(c.id, 'pass');
                    setShowRejectReasons(!showRejectReasons);
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition active:scale-95 ${
                  feedback?.startsWith('pass')
                    ? 'bg-red-500/20 border border-red-500/40 text-red-300'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                <ThumbsDown className="w-3.5 h-3.5" />
                <span>{feedback?.startsWith('pass') ? 'Passed' : 'Pass'}</span>
                <ChevronDown className="w-3 h-3 ml-0.5 opacity-60" />
              </button>

              {/* Quick pass reason menu */}
              {showRejectReasons && (
                <div className="absolute right-0 bottom-full mb-2 w-48 p-1.5 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl z-20 space-y-1">
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Specify Reason (Optional)
                  </div>
                  {rejectOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        onFeedbackChange(c.id, `pass: ${opt}`);
                        setShowRejectReasons(false);
                      }}
                      className="w-full text-left px-2 py-1 rounded text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
