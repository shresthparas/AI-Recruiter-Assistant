import React, { useEffect, useState } from 'react';
import { Sparkles, Filter, CheckCircle2, Cpu } from 'lucide-react';

export default function ThinkingState({ message = "AI Recruiter is thinking..." }) {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { label: "Decomposing recruiter requirement into structured criteria...", icon: Sparkles },
    { label: "Synthesizing objective filters & subjective fit rubric...", icon: Filter },
    { label: "Scanning 48 candidate profiles in talent map...", icon: Cpu },
    { label: "Scoring candidate match & generating field citations...", icon: CheckCircle2 }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1200);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div className="max-w-2xl mx-auto my-12 p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl text-center">
      <div className="relative w-16 h-16 mx-auto mb-5">
        <div className="absolute inset-0 rounded-full bg-sky-500/20 animate-ping"></div>
        <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/30">
          <Sparkles className="w-8 h-8 text-white animate-pulse" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-2">{message}</h3>
      <p className="text-sm text-slate-400 mb-8">
        Google Gemini is calibrating the sourcing parameters and ranking candidate profiles.
      </p>

      {/* Step by step milestone indicators */}
      <div className="space-y-3 max-w-md mx-auto text-left">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx < activeStep;
          const isCurrent = idx === activeStep;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                isCurrent
                  ? 'bg-sky-500/10 border border-sky-500/30 text-sky-300'
                  : isDone
                  ? 'text-slate-400'
                  : 'text-slate-600'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold ${
                  isDone
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : isCurrent
                    ? 'bg-sky-500 text-white animate-pulse'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {isDone ? '✓' : idx + 1}
              </div>
              <span className="text-xs font-medium">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
