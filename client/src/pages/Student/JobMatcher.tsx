import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Sparkles, CheckCircle2, XCircle, TrendingUp, Target, Award } from 'lucide-react';

export const JobMatcher: React.FC = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.get('/jobs');
        setJobs(data.jobs || []);
      } catch {
        setJobs([]);
      }
    };
    load();
  }, []);

  const handleMatch = async (job: any) => {
    setSelectedJob(job);
    setLoading(true);
    try {
      const resumeText = `${user?.name || ''} ${user?.profile?.skills?.join(' ') || ''} ${user?.profile?.experience?.join(' ') || ''}`;
      const data = await api.post('/ai/match-job', {
        resumeText,
        jobDetails: {
          title: job.title,
          description: job.description,
          skills: job.requirements?.skills || []
        }
      });
      setResult(data);
    } catch {
      setResult({ matchScore: 0, recommendation: 'Not Recommended', matchedSkills: [], missingSkills: job.requirements?.skills || [], rationale: 'Matching service unavailable.' });
    } finally {
      setLoading(false);
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 80) return 'from-emerald-500 to-green-500';
    if (score >= 60) return 'from-amber-500 to-yellow-500';
    return 'from-rose-500 to-red-500';
  };

  const getMatchBg = (score: number) => {
    if (score >= 80) return 'from-emerald-50 to-green-50';
    if (score >= 60) return 'from-amber-50 to-yellow-50';
    return 'from-rose-50 to-red-50';
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">AI Resume vs Job Matching</h3>
              <p className="text-base text-slate-700 leading-relaxed mt-1">
                Compare your current profile against posted roles and see a match score with recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        {/* Available Jobs */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-indigo-600" />
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">Available Jobs</h4>
            </div>
            <div className="mt-4 space-y-3">
            {jobs.map((job) => {
                const isSelected = selectedJob?._id === job._id;
                return (
                  <button
                    key={job._id}
                    onClick={() => handleMatch(job)}
                    className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                      isSelected
                        ? 'border-indigo-400 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-lg scale-102'
                        : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md hover:scale-102'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-900">{job.title}</span>
                      <span className="text-xs font-semibold text-indigo-600">{job.company}</span>
                    </div>
                    <p className="mt-2 text-xs text-slate-600 flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      {job.location}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Match Result */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
          <div className="relative z-10">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-sm font-semibold text-slate-700">Matching your profile with the selected job...</p>
              </div>
            ) : !selectedJob ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Target className="h-12 w-12 text-slate-400 mb-4" />
                <p className="text-sm font-semibold text-slate-700">Select a job to view its AI match score and reasons.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-indigo-600 mb-4">
                  <Award className="h-5 w-5" />
                  <h4 className="text-sm font-bold uppercase tracking-wider">Match Result</h4>
                </div>

                {/* Score Display */}
                <div className={`relative overflow-hidden rounded-2xl border-2 p-6 shadow-xl bg-gradient-to-br ${getMatchBg(result?.matchScore ?? 0)}`}>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
                  <div className="relative z-10">
                    <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Match Score</p>
                    <p className={`text-4xl font-black bg-clip-text text-transparent`} style={{
                      backgroundImage: `linear-gradient(to right, ${getMatchColor(result?.matchScore ?? 0)})`,
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text'
                    }}>
                      {result?.matchScore ?? 0}%
                    </p>
                    <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-white/80 backdrop-blur-sm border-2 border-indigo-200 px-3 py-1.5">
                      <TrendingUp className="h-4 w-4 text-indigo-600" />
                      <p className="text-sm font-bold text-indigo-700">{result?.recommendation}</p>
                    </div>
                  </div>
                </div>

                {/* Reasons */}
                <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-5 shadow-md">
                  <p className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Analysis Details</p>
                  <ul className="space-y-2.5">
                    {(result?.matchedSkills || []).map((skill: string) => (
                      <li key={skill} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="font-medium">{skill}</span>
                      </li>
                    ))}
                    {(result?.missingSkills || []).map((skill: string) => (
                      <li key={skill} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <XCircle className="h-4 w-4 text-rose-600 flex-shrink-0 mt-0.5" />
                        <span className="font-medium">{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Rationale */}
                {result?.rationale && (
                  <div className="rounded-xl bg-indigo-50 border-2 border-indigo-200 p-4">
                    <p className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-1">AI Insight:</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{result.rationale}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};