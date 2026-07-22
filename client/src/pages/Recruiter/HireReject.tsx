import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Users } from 'lucide-react';
import { api } from '../../services/api';

export const HireReject: React.FC = () => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApps = async () => {
    try {
      const res = await api.get('/recruiter/applications');
      const apps = res.applications || [];
      
      // Filter out those who are already hired or rejected so we focus on pending/shortlisted
      const pendingApps = apps.filter((app: any) => app.status === 'Applied' || app.status === 'Shortlisted');
      
      setCandidates(pendingApps);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleDecision = async (appId: string, status: 'Selected' | 'Rejected') => {
    try {
      await api.put(`/recruiter/applications/${appId}/status`, { status });
      // Remove from list or refresh list
      setCandidates(candidates.filter(c => c._id !== appId));
    } catch (error) {
      console.error(error);
      alert('Failed to update application status.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">Hire / Reject</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">Decision center</h2>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8 text-slate-500">Loading candidates...</div>
        ) : candidates.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <Users className="mx-auto h-8 w-8 text-slate-400 mb-3" />
            <p className="text-slate-600 font-semibold">No pending decisions.</p>
            <p className="text-sm text-slate-500 mt-1">You have reviewed all current applications.</p>
          </div>
        ) : (
          candidates.map((candidate) => {
            const student = candidate.studentId || candidate.student || {};
            const jobTitle = candidate.jobId?.title || candidate.job?.title || 'Unknown Job';
            const matchScore = candidate.matchScore || 0;
            const assessmentScore = candidate.assessmentScore;

            return (
              <div key={candidate._id} className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <p className="text-lg font-bold text-slate-900">{student.name}</p>
                    <p className="text-sm font-medium text-slate-500 mb-2">{jobTitle}</p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-lg">
                        <span className="text-xs font-bold text-indigo-900">Resume Match:</span>
                        <span className={`text-sm font-black ${matchScore >= 70 ? 'text-emerald-600' : matchScore >= 40 ? 'text-amber-600' : 'text-rose-600'}`}>{matchScore}%</span>
                      </div>
                      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border ${assessmentScore !== undefined && assessmentScore !== null ? 'bg-purple-50 border-purple-100' : 'bg-slate-50 border-slate-200'}`}>
                        <span className={`text-xs font-bold ${assessmentScore !== undefined && assessmentScore !== null ? 'text-purple-900' : 'text-slate-500'}`}>Screening Score:</span>
                        {assessmentScore !== undefined && assessmentScore !== null ? (
                          <span className={`text-sm font-black ${assessmentScore >= 70 ? 'text-emerald-600' : assessmentScore >= 40 ? 'text-amber-600' : 'text-rose-600'}`}>{assessmentScore}%</span>
                        ) : (
                          <span className="text-xs font-semibold text-slate-400 italic">Pending</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] text-slate-600 border border-slate-200">{candidate.status}</span>
                    <button 
                      onClick={() => handleDecision(candidate._id, 'Selected')}
                      disabled={assessmentScore === undefined || assessmentScore === null}
                      className="inline-flex items-center gap-2 rounded-xl border-2 border-emerald-500 bg-emerald-500 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-600 transition-colors shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Hire
                    </button>
                    <button 
                      onClick={() => handleDecision(candidate._id, 'Rejected')}
                      disabled={assessmentScore === undefined || assessmentScore === null}
                      className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
