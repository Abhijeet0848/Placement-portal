import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Calendar, Video, User, PlusCircle, Sparkles } from 'lucide-react';

export const Scheduler: React.FC = () => {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form Inputs
  const [jobId, setJobId] = useState('');
  const [studentId, setStudentId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  // Status feedback
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch data
  const fetchData = async () => {
    try {
      const intsRes = await api.get('/interviews');
      setInterviews(intsRes.interviews || []);

      const studsRes = await api.get('/auth/students');
      setStudents(studsRes.students || []);

      const jobsRes = await api.get('/jobs');
      setJobs(jobsRes.jobs || []);
    } catch (err) {
      setErrorMsg('Failed to sync scheduler registries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobId || !studentId || !date || !time) return;

    setSubmitting(true);
    setErrorMsg('');
    setMessage('');

    try {
      await api.post('/interviews', {
        jobId,
        studentId,
        date,
        time
      });

      setMessage('Interview scheduled successfully! Candidate notified via email.');
      setDate('');
      setTime('');
      fetchData(); // Reload list
    } catch (err: any) {
      setErrorMsg(err.message || 'Scheduling conflict occurred.');
    } finally {
      setSubmitting(false);
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
              <Calendar className="h-7 w-7 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Interview Scheduler</h3>
              <p className="text-base text-slate-700 leading-relaxed mt-1">
                Schedule and manage interview rounds with candidates. Automated notifications sent via email.
              </p>
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-300 rounded-xl text-sm text-emerald-700 font-bold text-center shadow-lg">
          {message}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-gradient-to-r from-rose-50 to-red-50 border-2 border-rose-300 rounded-xl text-sm text-rose-700 font-bold text-center shadow-lg">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form to Schedule */}
        <div className="lg:col-span-4 relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2 text-indigo-600">
              <PlusCircle className="h-5 w-5" />
              <h4 className="text-sm font-bold uppercase tracking-wider">Schedule Interview</h4>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Candidate</label>
                <select
                  value={studentId}
                  required
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border-2 border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                >
                  <option value="">Select Candidate</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.profile?.branch})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Job Position</label>
                <select
                  value={jobId}
                  required
                  onChange={(e) => setJobId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border-2 border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                >
                  <option value="">Select Position</option>
                  {jobs.map(j => (
                    <option key={j._id} value={j._id}>{j.title} ({j.company})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border-2 border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Time</label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border-2 border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-40 text-white rounded-xl text-sm font-bold shadow-lg transition-all hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Calendar className="h-5 w-5" />
                <span>{submitting ? 'Scheduling...' : 'Schedule Round'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Active Schedule Registry */}
        <div className="lg:col-span-8 relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2 text-indigo-600">
              <Video className="h-5 w-5 animate-pulse" />
              <h4 className="text-sm font-bold uppercase tracking-wider">Active Rounds Registry</h4>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-sm font-semibold text-slate-700">Loading interview schedule...</p>
              </div>
            ) : interviews.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-sm font-semibold text-slate-700">No interview sessions scheduled yet.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {interviews.map((i) => (
                  <div key={i._id} className="relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-5 shadow-md hover:shadow-xl transition-all">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1.5">
                        <h5 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <User className="h-4 w-4 text-indigo-600" />
                          {i.studentName}
                        </h5>
                        <p className="text-xs text-slate-600">
                          Position: {i.jobTitle} at {i.company}
                        </p>
                      </div>

                      <div className="flex flex-col md:items-end text-xs space-y-1">
                        <span className="flex items-center gap-1.5 text-slate-600">
                          <Calendar className="h-3.5 w-3.5 text-indigo-600" />
                          <span className="font-semibold">{i.date} at {i.time}</span>
                        </span>
                        <a 
                          href={i.meetLink || 'https://meet.google.com/new'} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 mt-1 hover:underline"
                        >
                          <Video className="h-3.5 w-3.5" />
                          <span>Join Meet Room</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};