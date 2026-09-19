import React, { useState, useEffect } from 'react';
import { Filter, Award, Edit3, Check, X, Plus, Sparkles, Building2, Briefcase, MapPin, Code2 } from 'lucide-react';

export default function FilterRubricPanel({ filters, rubric, onApplyManualUpdate, isUpdating }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editFilters, setEditFilters] = useState(filters);
  const [editRubric, setEditRubric] = useState(rubric);
  const [newSkill, setNewSkill] = useState('');

  // Keep local edit state in sync with parent when props update (e.g. from conversational refinement)
  useEffect(() => {
    setEditFilters(filters);
    setEditRubric(rubric);
  }, [filters, rubric]);

  const handleSave = () => {
    setIsEditing(false);
    onApplyManualUpdate({
      filters: editFilters,
      rubric: editRubric,
    });
  };

  const handleCancel = () => {
    setEditFilters(filters);
    setEditRubric(rubric);
    setIsEditing(false);
  };

  const addSkill = () => {
    if (newSkill.trim() && !editFilters.skills?.includes(newSkill.trim())) {
      setEditFilters({
        ...editFilters,
        skills: [...(editFilters.skills || []), newSkill.trim()],
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setEditFilters({
      ...editFilters,
      skills: (editFilters.skills || []).filter((s) => s !== skillToRemove),
    });
  };

  const toggleCompanyType = (type) => {
    const current = editFilters.company_types || [];
    const exists = current.includes(type);
    const updated = exists ? current.filter((t) => t !== type) : [...current, type];
    setEditFilters({
      ...editFilters,
      company_types: updated,
    });
  };

  const allCompanyTypes = ['startup', 'scaleup', 'enterprise', 'agency'];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl sticky top-20">
      {/* Header with edit toggle */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
            <Filter className="w-4 h-4 text-sky-400" />
          </div>
          <h3 className="font-bold text-white text-sm">Active Sourcing Criteria</h3>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition"
          >
            <Edit3 className="w-3 h-3" />
            <span>Edit Directly</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Cancel"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              onClick={handleSave}
              disabled={isUpdating}
              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold shadow-md shadow-sky-500/20 transition"
            >
              <Check className="w-3 h-3" />
              <span>{isUpdating ? 'Applying...' : 'Apply'}</span>
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Section 1: Objective Filters */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5" />
              1. Objective Filters
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Skills */}
            <div>
              <span className="text-slate-400 font-medium block mb-1.5">Target Skills:</span>
              <div className="flex flex-wrap gap-1.5 items-center">
                {(editFilters.skills || []).map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-sky-500/10 text-sky-300 border border-sky-500/20 font-medium text-xs"
                  >
                    {skill}
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="hover:text-red-400 transition ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}

                {isEditing && (
                  <div className="inline-flex items-center gap-1 mt-1">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      placeholder="+ Add skill"
                      className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 w-24"
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Experience */}
            <div className="flex items-center justify-between py-1 border-t border-slate-800/60">
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                Experience:
              </span>
              {!isEditing ? (
                <span className="text-white font-semibold">
                  {editFilters.min_years_experience ?? 0} – {editFilters.max_years_experience ?? 'Any'} years
                </span>
              ) : (
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={editFilters.min_years_experience ?? ''}
                    onChange={(e) =>
                      setEditFilters({
                        ...editFilters,
                        min_years_experience: e.target.value ? parseInt(e.target.value) : null,
                      })
                    }
                    placeholder="Min"
                    className="w-14 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-white text-xs text-center focus:outline-none focus:border-sky-500"
                  />
                  <span className="text-slate-500">to</span>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={editFilters.max_years_experience ?? ''}
                    onChange={(e) =>
                      setEditFilters({
                        ...editFilters,
                        max_years_experience: e.target.value ? parseInt(e.target.value) : null,
                      })
                    }
                    placeholder="Max"
                    className="w-14 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-white text-xs text-center focus:outline-none focus:border-sky-500"
                  />
                  <span className="text-slate-400">yrs</span>
                </div>
              )}
            </div>

            {/* Locations */}
            <div className="flex items-center justify-between py-1 border-t border-slate-800/60">
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                Location:
              </span>
              <span className="text-white font-semibold">
                {(editFilters.locations && editFilters.locations.length > 0)
                  ? editFilters.locations.join(', ')
                  : 'Any / Remote'}
              </span>
            </div>

            {/* Company Types */}
            <div className="pt-1 border-t border-slate-800/60">
              <span className="text-slate-400 font-medium flex items-center gap-1 mb-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                Company Pedigree:
              </span>
              <div className="flex flex-wrap gap-1">
                {allCompanyTypes.map((type) => {
                  const isSelected = (editFilters.company_types || []).includes(type);
                  return (
                    <button
                      key={type}
                      type="button"
                      disabled={!isEditing}
                      onClick={() => toggleCompanyType(type)}
                      className={`px-2 py-0.5 rounded-md text-[11px] capitalize font-medium transition ${
                        isSelected
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                          : 'bg-slate-800 text-slate-400 border border-transparent'
                      } ${isEditing ? 'cursor-pointer hover:border-slate-600' : 'cursor-default'}`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Subjective Fit Rubric */}
        <div className="pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              2. Subjective Fit Rubric
            </span>
            <span className="text-[10px] text-slate-500 font-medium">LLM Evaluation Criteria</span>
          </div>

          <div className="space-y-2.5">
            {(editRubric?.criteria || []).map((crit, idx) => (
              <div
                key={crit.id || idx}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-semibold text-slate-200 text-xs">{crit.name}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      crit.weight === 'high'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : crit.weight === 'medium'
                        ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {crit.weight} priority
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">{crit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
