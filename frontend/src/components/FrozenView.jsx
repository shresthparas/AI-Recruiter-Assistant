import React, { useState } from 'react';
import { Lock, CheckCircle2, Download, Copy, Check, Unlock, Sparkles, Briefcase, MapPin, Building2, Code2, Award } from 'lucide-react';

export default function FrozenView({ filters, rubric, candidates, onUnfreeze, iteration }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `
AI RECRUITER - FROZEN SHORTLIST
=======================================
Search Iterations: ${iteration}
Total Shortlisted: ${candidates.length} candidates

1. FROZEN OBJECTIVE FILTERS:
- Skills: ${filters.skills?.join(', ') || 'Any'}
- Experience: ${filters.min_years_experience ?? 0} to ${filters.max_years_experience ?? 'Any'} years
- Locations: ${filters.locations?.join(', ') || 'Any'}
- Company Types: ${filters.company_types?.join(', ') || 'Any'}

2. FROZEN FIT RUBRIC:
${rubric.criteria?.map((c) => `- ${c.name} (${c.weight} priority): ${c.description}`).join('\n')}

3. RANKED SHORTLIST:
${candidates
  .map(
    (c, i) =>
      `#${i + 1}: ${c.candidate.name} (${c.score}% Match)
Current: ${c.candidate.current_title} at ${c.candidate.current_company} (${c.candidate.current_company_type})
Experience: ${c.candidate.years_experience} yrs | Location: ${c.candidate.location}
Skills: ${c.candidate.skills?.join(', ')}
Why Matched: ${c.explanation}
`
  )
  .join('\n')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const data = {
      frozen_at: new Date().toISOString(),
      iterations: iteration,
      filters,
      rubric,
      candidates,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `candidate_shortlist_frozen_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/50 via-slate-900 to-sky-950/40 border border-emerald-500/40 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white">Search Frozen & Finalized</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
                Calibrated in {iteration} rounds
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              The sourcing refinement loop is complete. Below is your final calibrated shortlist and criteria.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Briefing' : 'Copy Briefing'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={onUnfreeze}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-lg shadow-sky-600/20 transition"
          >
            <Unlock className="w-3.5 h-3.5" />
            <span>Unfreeze & Refine</span>
          </button>
        </div>
      </div>

      {/* Frozen Criteria Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Frozen Filters */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 mb-4">
            <Code2 className="w-4 h-4 text-sky-400" />
            <h4 className="font-bold text-white text-sm">Final Frozen Objective Filters</h4>
          </div>
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block mb-1">Required Skills:</span>
              <div className="flex flex-wrap gap-1.5">
                {filters.skills?.map((s, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex justify-between py-1 border-t border-slate-800/60">
              <span className="text-slate-400">Experience Range:</span>
              <span className="text-white font-semibold">
                {filters.min_years_experience ?? 0} – {filters.max_years_experience ?? 'Any'} years
              </span>
            </div>
            <div className="flex justify-between py-1 border-t border-slate-800/60">
              <span className="text-slate-400">Locations:</span>
              <span className="text-white font-semibold">
                {filters.locations?.length ? filters.locations.join(', ') : 'Any / Remote'}
              </span>
            </div>
            <div className="pt-1 border-t border-slate-800/60">
              <span className="text-slate-400 block mb-1">Company Pedigree:</span>
              <div className="flex gap-1 flex-wrap">
                {filters.company_types?.map((t, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 capitalize">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Frozen Rubric */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 mb-4">
            <Award className="w-4 h-4 text-amber-400" />
            <h4 className="font-bold text-white text-sm">Final Frozen Subjective Rubric</h4>
          </div>
          <div className="space-y-2.5">
            {rubric.criteria?.map((crit, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-200">{crit.name}</span>
                  <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                    {crit.weight} priority
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">{crit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final Ranked Shortlist */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>Ranked Candidate Shortlist ({candidates.length})</span>
          </h3>
        </div>

        <div className="space-y-4">
          {candidates.map((c, idx) => {
            const cand = c.candidate;
            return (
              <div
                key={cand.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="w-6 h-6 rounded-lg bg-slate-800 text-sky-400 font-bold text-xs flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <h4 className="text-base font-bold text-white">{cand.name}</h4>
                    <span className="text-xs text-slate-400 font-medium">
                      {cand.current_title} at <strong className="text-slate-200">{cand.current_company}</strong> ({cand.current_company_type})
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {cand.years_experience}y exp • {cand.location}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 italic">"{cand.summary}"</p>

                  <div className="text-xs bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60 text-slate-300">
                    <strong className="text-sky-400 font-semibold">Field Citations: </strong>
                    <span>{c.explanation}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0 w-full md:w-auto">
                  <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-extrabold text-sm flex items-center gap-1.5 shadow">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{c.score}% Match</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
