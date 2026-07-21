import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Users } from 'lucide-react';
import { api } from '../../services/api';

export const ResumeRanking: React.FC = () => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await api.get('/recruiter/applications');
        const apps = res.applications || [];
        
        // Sort by match score descending
        const sortedApps = apps.sort((a: any, b: any) => (b.matchScore || 0) - (a.matchScore || 0));
        
        // Map to candidate format
        const mappedCandidates = sortedApps.map((app: any) => {
          const student = app.studentId || app.student || {}; // handle both real and mock db
          
          let fit = 'Fair';
          if (app.matchScore >= 90) fit = 'Excellent';
          else if (app.matchScore >= 80) fit = 'Strong';
          else if (app.matchScore >= 70) fit = 'Good';

          return {
            id: app._id,
            name: student.name || 'Unknown Student',
            role: app.jobId?.title || app.job?.title || 'Unknown Job',
            score: app.matchScore || 0,
            fit
          };
        });
        
        setCandidates(mappedCandidates);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchApps();
  }, []);

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
        {loading ? (
          <div className="text-center py-8 text-slate-500">Loading rankings...</div>
        ) : candidates.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <Users className="mx-auto h-8 w-8 text-slate-400 mb-3" />
            <p className="text-slate-600 font-semibold">No applications yet.</p>
            <p className="text-sm text-slate-500 mt-1">Once students apply to your jobs, AI will rank their resumes here.</p>
          </div>
        ) : (
          candidates.map((candidate) => (
            <div key={candidate.id} className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{candidate.name}</p>
                  <p className="text-sm text-slate-500">{candidate.role}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${
                    candidate.score >= 80 ? 'bg-emerald-50 text-emerald-700' :
                    candidate.score >= 60 ? 'bg-amber-50 text-amber-700' :
                    'bg-rose-50 text-rose-700'
                  }`}>
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
          ))
        )}
      </div>
    </div>
  );
};
