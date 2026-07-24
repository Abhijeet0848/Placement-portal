import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import {
  CheckCircle2, XCircle, Award, RefreshCw, Sparkles, TrendingUp, User
} from 'lucide-react';

export const Candidates: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Selected Applicant Drawer
  const [selectedApp, setSelectedApp] = useState<any>(null);

  // Fetch applications
  const fetchApplications = async () => {
    try {
      const data = await api.get('/recruiter/applications');
      // Sort candidates by AI Match Score descending
      const sorted = (data.applications || []).sort((a: any, b: any) => (b.matchScore || 0) - (a.matchScore || 0));
      setApplications(sorted);
    } catch (err) {
      setErrorMsg('Failed to load candidate applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Update applicant status
  const handleUpdateStatus = async (appId: string, status: 'Shortlisted' | 'Selected' | 'Rejected') => {
    try {
      await api.put(`/recruiter/applications/${appId}/status`, { status });
      fetchApplications();
      setSelectedApp(null);
    } catch (err) {
      setErrorMsg('Failed to update applicant status.');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-emerald-500 to-green-500';
    if (score >= 60) return 'from-amber-500 to-yellow-500';
    return 'from-rose-500 to-red-500';
  };

  const getScoreBg = (score: number) => {
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
              <User className="h-7 w-7 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">AI Resume Ranker & Shortlist</h3>
              <p className="text-base text-slate-700 leading-relaxed mt-1">
                Applicants are automatically sorted by ATS match scores, checking tech stack match, GPA, and projects.
              </p>
            </div>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-gradient-to-r from-rose-50 to-red-50 border-2 border-rose-300 rounded-xl text-sm text-rose-700 font-bold text-center shadow-lg">
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full  mb-4"></div>
          <p className="text-sm font-semibold text-slate-700">Loading candidate applications...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-12 shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
          <div className="relative z-10 text-center">
            <User className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-sm font-semibold text-slate-700">No candidates have applied to your vacancies yet.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Applications list */}
          <div className="lg:col-span-7 space-y-3">
            {applications.map((app, index) => {
              const name = app.student?.name;
              const jobTitle = app.job?.title;
              const matchScore = app.matchScore;
              const gpa = app.student?.profile?.cgpa;
              const branch = app.student?.profile?.branch;
              const status = app.status;

              return (
                <div 
                  key={app._id}
                  onClick={() => setSelectedApp(app)}
                  className={`relative overflow-hidden rounded-2xl border-2 p-5 shadow-md hover:shadow-xl  cursor-pointer ${
                    selectedApp?._id === app._id 
                      ? 'border-indigo-400 bg-gradient-to-r from-indigo-50 to-purple-50' 
                      : 'border-slate-200 bg-white hover:border-indigo-300'
                  }`}
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
                  <div className="relative z-10 flex justify-between items-center">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="h-5 w-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                          #{index + 1}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm truncate">{name}</h4>
                      </div>
                      <p className="text-[10px] text-slate-600 truncate">
                        Applied for: {jobTitle} • {branch} (CGPA: {gpa})
                      </p>
                    </div>

                    <div className="flex items-center space-x-3 flex-shrink-0 ml-4">
                      {/* Matching score */}
                      <div className="text-right">
                        <span className="text-[9px] text-slate-500 block uppercase font-bold">Match</span>
                        <span className={`text-xs font-black ${matchScore >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {matchScore}%
                        </span>
                      </div>

                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border-2 ${
                        status === 'Selected' ? 'bg-gradient-to-r from-emerald-100 to-green-100 border-emerald-300 text-emerald-700' :
                        status === 'Shortlisted' ? 'bg-gradient-to-r from-indigo-100 to-blue-100 border-indigo-300 text-indigo-700' :
                        status === 'Rejected' ? 'bg-gradient-to-r from-rose-100 to-red-100 border-rose-300 text-rose-700' :
                        'bg-gradient-to-r from-slate-100 to-gray-100 border-slate-300 text-slate-700'
                      }`}>
                        {status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed Candidate Profile and ATS report */}
          <div className="lg:col-span-5">
            {selectedApp ? (
              <div className="relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
                <div className="relative z-10 space-y-4">
                  <div className="border-b border-slate-200 pb-3">
                    <h4 className="font-bold text-slate-900 text-sm">{selectedApp.student?.name}</h4>
                    <p className="text-xs text-slate-600 mt-1">{selectedApp.student?.email} • {selectedApp.student?.profile?.branch}</p>
                  </div>

                  {/* Skills lists */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Candidate Tech Stack</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedApp.student?.profile?.skills?.map((s: string) => (
                        <span key={s} className="px-2.5 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 border-2 border-indigo-300 text-indigo-700 rounded-lg text-[10px] font-bold">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* AI matching details */}
                  <div className={`p-4 rounded-xl border-2 space-y-3 ${getScoreBg(selectedApp.matchScore)}`}>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">AI ATS Compatibility</span>
                      <span className={`text-lg font-black bg-clip-text text-transparent`} style={{
                        backgroundImage: `linear-gradient(to right, ${getScoreColor(selectedApp.matchScore)})`,
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text'
                      }}>
                        {selectedApp.matchScore}%
                      </span>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-300">
                      <div>
                        <p className="text-[10px] text-slate-600 font-bold block uppercase">Recommendation</p>
                        <p className="text-emerald-700 font-bold text-xs mt-0.5">{selectedApp.matchDetails?.recommendation || 'Recommended'}</p>
                      </div>
                      
                      {selectedApp.matchDetails?.matchedSkills?.length > 0 && (
                        <div>
                          <p className="text-[10px] text-slate-600 font-bold block uppercase">Matched Skills</p>
                          <p className="text-slate-700 text-[10px] leading-relaxed">{selectedApp.matchDetails.matchedSkills.join(', ')}</p>
                        </div>
                      )}

                      {selectedApp.matchDetails?.missingSkills?.length > 0 && (
                        <div>
                          <p className="text-[10px] text-slate-600 font-bold block uppercase">Missing Skills</p>
                          <p className="text-rose-700 text-[10px] leading-relaxed">{selectedApp.matchDetails.missingSkills.join(', ')}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Verification controls */}
                  <div className="border-t border-slate-200 pt-4 flex space-x-2">
                    <button
                      onClick={() => handleUpdateStatus(selectedApp._id, 'Rejected')}
                      className="flex-1 py-2.5 bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white rounded-xl text-xs font-bold  shadow-lg flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedApp._id, 'Shortlisted')}
                      className="flex-1 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-bold  shadow-lg flex items-center justify-center gap-1.5"
                    >
                      <Award className="h-4 w-4" />
                      <span>Shortlist</span>
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedApp._id, 'Selected')}
                      className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl text-xs font-bold  shadow-lg flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Hire</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
                <div className="relative z-10 flex flex-col items-center justify-center py-12 text-center">
                  <Sparkles className="h-12 w-12 text-slate-400 mb-4" />
                  <p className="text-sm font-semibold text-slate-700">Select an applicant to review their ATS scorecard, mismatch skills list, and edit hiring status.</p>
                </div>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};
