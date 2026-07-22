import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Briefcase, CalendarDays, Sparkles, Clock3, TrendingUp, Award } from 'lucide-react';

export const ApplicationsTracker: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsRes, intsRes] = await Promise.all([
          api.get('/student/applications').catch(() => ({ applications: [] })),
          api.get('/interviews').catch(() => ({ interviews: [] }))
        ]);
        
        setApplications(appsRes.applications || []);
        
        // Only show upcoming scheduled interviews
        const upcomingInts = (intsRes.interviews || []).filter((i: any) => i.status === 'Scheduled');
        setInterviews(upcomingInts);
      } catch (err: any) {
        setErrorMsg(err.message || 'Unable to load your data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!user) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Selected': return 'from-emerald-500 to-green-500';
      case 'Shortlisted': return 'from-indigo-500 to-blue-500';
      case 'Rejected': return 'from-rose-500 to-red-500';
      default: return 'from-slate-500 to-gray-500';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'Selected': return 'from-emerald-50 to-green-50';
      case 'Shortlisted': return 'from-indigo-50 to-blue-50';
      case 'Rejected': return 'from-rose-50 to-red-50';
      default: return 'from-slate-50 to-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
              <Briefcase className="h-7 w-7 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Application Tracker</h3>
              <p className="text-base text-slate-700 leading-relaxed mt-1">
                Monitor every placement application, recruiter response, and your readiness score in one place.
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
          <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-sm font-semibold text-slate-700">Loading your data...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Interviews Section */}
          {interviews.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-indigo-600" />
                Upcoming Interviews
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {interviews.map((interview) => (
                  <div key={interview._id} className="relative overflow-hidden rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50 p-5 shadow-md">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-slate-900">{interview.jobTitle}</h4>
                        <p className="text-sm text-slate-600">{interview.company}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 border border-indigo-200">
                        {interview.status}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2 text-sm text-slate-700">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-indigo-600" />
                        <span className="font-semibold">{interview.date} at {interview.time}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <a href={interview.meetLink || 'https://meet.google.com/new'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-colors text-xs">
                          Join Meeting
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Applications Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-indigo-600" />
              Application History
            </h3>
            {applications.length === 0 ? (
              <div className="relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-12 shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
                <div className="relative z-10 text-center">
                  <Briefcase className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-sm font-semibold text-slate-700">No applications yet. Visit the job board to start applying.</p>
                </div>
              </div>
            ) : (
        <div className="space-y-4">
          {applications.map((application) => {
            const status = application.status;
            const appliedAt = application.appliedAt ? new Date(application.appliedAt).toLocaleDateString() : 'Recently applied';
            const matchScore = application.matchScore ?? 78;

            return (
              <div
                key={application._id}
                className="relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-2xl hover:shadow-xl transition-all"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <h4 className="text-lg font-bold text-slate-900">{application.job?.title}</h4>
                      <p className="text-sm text-slate-600 mt-1">{application.job?.company} • {appliedAt}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 ${
                        status === 'Selected' ? 'bg-gradient-to-r from-emerald-100 to-green-100 border-emerald-300 text-emerald-700' :
                        status === 'Shortlisted' ? 'bg-gradient-to-r from-indigo-100 to-blue-100 border-indigo-300 text-indigo-700' :
                        status === 'Rejected' ? 'bg-gradient-to-r from-rose-100 to-red-100 border-rose-300 text-rose-700' :
                        'bg-gradient-to-r from-slate-100 to-gray-100 border-slate-300 text-slate-700'
                      }`}>
                        {status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-indigo-50 to-blue-50 p-4 shadow-md">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-indigo-400 to-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
                      <div className="relative z-10">
                        <div className="flex items-center space-x-2 text-slate-700 text-[10px] uppercase tracking-wider mb-2">
                          <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                          <span className="font-bold">AI Match Score</span>
                        </div>
                        <p className="text-2xl font-black text-indigo-600">{matchScore}%</p>
                      </div>
                    </div>
                    <div className="relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-purple-50 to-pink-50 p-4 shadow-md">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
                      <div className="relative z-10">
                        <div className="flex items-center space-x-2 text-slate-700 text-[10px] uppercase tracking-wider mb-2">
                          <CalendarDays className="h-3.5 w-3.5 text-purple-600" />
                          <span className="font-bold">Applied On</span>
                        </div>
                        <p className="text-lg font-bold text-slate-900 mt-1">{appliedAt}</p>
                      </div>
                    </div>
                    <div className="relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-cyan-50 to-blue-50 p-4 shadow-md">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
                      <div className="relative z-10">
                        <div className="flex items-center space-x-2 text-slate-700 text-[10px] uppercase tracking-wider mb-2">
                          <Clock3 className="h-3.5 w-3.5 text-cyan-600" />
                          <span className="font-bold">Next Update</span>
                        </div>
                        <p className="text-lg font-bold text-slate-900 mt-1">
                          {status === 'Applied' ? 'Awaiting review' : status === 'Shortlisted' ? 'Interview pending' : 'Follow-up soon'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
          </div>
        </div>
      )}
    </div>
  );
};