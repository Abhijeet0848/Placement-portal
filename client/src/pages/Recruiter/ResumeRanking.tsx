import React from 'react';
import { Sparkles, TrendingUp } from 'lucide-react';

const candidates = [
  { name: 'Aisha Sharma', role: 'Full Stack Developer', score: 94, fit: 'Excellent' },
  { name: 'Rahul Mehta', role: 'Backend Engineer', score: 88, fit: 'Strong' },
  { name: 'Neha Iyer', role: 'Data Engineer', score: 81, fit: 'Good' },
];

export const ResumeRanking: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">AI Resume Ranking</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Top ranked applicants</h2>
          </div>
          <div className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700">
            <span className="flex items-center gap-2"><Sparkles className="h-4 w-4" /> AI scoring active</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {candidates.map((candidate) => (
          <div key={candidate.name} className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-slate-900">{candidate.name}</p>
                <p className="text-sm text-slate-500">{candidate.role}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                  <TrendingUp className="h-4 w-4" />
                  {candidate.fit}
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Match score</p>
                  <p className="text-lg font-bold text-slate-900">{candidate.score}%</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
