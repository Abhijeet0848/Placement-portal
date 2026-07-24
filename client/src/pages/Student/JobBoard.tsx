import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  MapPin, DollarSign, CheckCircle, AlertTriangle,
  Search, ShieldAlert, Sparkles, Filter, Briefcase, TrendingUp
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const JobBoard: React.FC = () => {
  const { user } = useAuth();

  // Job Board States
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<any>(null);

  // Feedback
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch Jobs
  const fetchJobs = async () => {
    try {
      const data = await api.get('/jobs');
      setJobs(data.jobs || []);
    } catch (err: any) {
      setErrorMsg('Failed to load jobs feed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  if (!user) return null;

  // Filter jobs based on search term
  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper: Client-side eligibility checker
  const checkEligibility = (job: any) => {
    const studentCGPA = user.profile.cgpa || 0;
    const studentBranch = user.profile.branch || '';

    const minCGPA = job.requirements?.minCGPA || 0;
    const allowedBranches = job.requirements?.branches || [];

    const reasons: string[] = [];
    if (studentCGPA < minCGPA) {
      reasons.push(`GPA is ${studentCGPA}, but job requires minimum ${minCGPA}.`);
    }
    if (allowedBranches.length > 0 && !allowedBranches.map((b: string) => b.toLowerCase()).includes(studentBranch.toLowerCase())) {
      reasons.push(`Branch is ${studentBranch || 'Not Set'}, but job only accepts: ${allowedBranches.join(', ')}.`);
    }

    return {
      eligible: reasons.length === 0,
      reasons
    };
  };

  // Submit Application
  const handleApply = async (job: any) => {
    setMessage('');
    setErrorMsg('');

    try {
      await api.post(`/jobs/${job._id}/apply`, {});

      // Celebrate Success
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setMessage(`Applied successfully to ${job.title} at ${job.company}!`);
      setSelectedJob(null);
      fetchJobs(); // Reload applicant count
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit application.');
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
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Job Board</h3>
              <p className="text-base text-slate-700 leading-relaxed mt-1">
                Explore and apply to the latest placement opportunities.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by company, role, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-semibold bg-white border-2 border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
          />
        </div>

        <div className="flex items-center space-x-2 border-2 border-slate-200 px-4 py-2 rounded-xl bg-white shadow-sm">
          <Filter className="h-4 w-4 text-indigo-600" />
          <span className="text-xs font-semibold text-slate-700">GPA Eligible Filter: ON</span>
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

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full  mb-4"></div>
          <p className="text-sm font-semibold text-slate-700">Loading placement feed...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-16">
          <Briefcase className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p className="text-sm font-semibold text-slate-700">No active job posts matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredJobs.map((job) => {
            const { eligible } = checkEligibility(job);

            return (
              <div
                key={job._id}
                onClick={() => setSelectedJob(job)}
                className="relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-md hover:shadow-xl  cursor-pointer "
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 leading-snug">{job.title}</h4>
                      <p className="text-sm text-slate-600 mt-1">{job.company}</p>
                    </div>

                    {/* Eligibility Badge */}
                    <div className="flex items-center">
                      {eligible ? (
                        <span className="px-2.5 py-0.5 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border-2 border-emerald-300 rounded-full text-[10px] font-bold flex items-center space-x-1">
                          <CheckCircle className="h-3 w-3" />
                          <span>Eligible</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-gradient-to-r from-rose-100 to-red-100 text-rose-700 border-2 border-rose-300 rounded-full text-[10px] font-bold flex items-center space-x-1">
                          <AlertTriangle className="h-3 w-3" />
                          <span>Ineligible</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mt-3 text-slate-600 text-xs">
                    <span className="flex items-center space-x-1">
                      <MapPin className="h-3.5 w-3.5 text-indigo-600" />
                      <span>{job.location}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <DollarSign className="h-3.5 w-3.5 text-indigo-600" />
                      <span>{job.salary} LPA</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                  <span className="text-[10px] text-slate-500 font-semibold">Applicants: {job.applicantsCount}</span>
                  <span className="text-xs text-indigo-600 font-bold hover:text-indigo-700">View details →</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selectedJob && (() => {
        const { eligible, reasons } = checkEligibility(selectedJob);
        return (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 ">
            <div className="w-full max-w-lg relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900">{selectedJob.title}</h3>
                    <p className="text-sm text-slate-600 mt-0.5">{selectedJob.company} • {selectedJob.location}</p>
                  </div>
                  <button
                    onClick={() => setSelectedJob(null)}
                    className="text-slate-400 hover:text-slate-900 font-extrabold text-lg"
                  >
                    ×
                  </button>
                </div>

                {/* Package, GPA limits */}
                <div className="grid grid-cols-3 gap-3 bg-gradient-to-br from-slate-50 to-slate-100 p-3 rounded-xl border-2 border-slate-200 text-center">
                  <div>
                    <span className="text-[10px] text-slate-600 font-bold block uppercase mb-1">Salary Package</span>
                    <span className="text-sm font-bold text-slate-900">{selectedJob.salary} LPA</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-600 font-bold block uppercase mb-1">Min CGPA</span>
                    <span className="text-sm font-bold text-slate-900">{selectedJob.requirements?.minCGPA}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-600 font-bold block uppercase mb-1">Allowed Branches</span>
                    <span className="text-sm font-bold text-slate-900 truncate max-w-xs block">
                      {selectedJob.requirements?.branches?.join(', ')}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Job Description</span>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {selectedJob.description}
                  </p>
                </div>

                {/* Required Skills */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Preferred Technical Skills</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedJob.requirements?.skills?.map((s: string) => (
                      <span key={s} className="px-2 py-0.5 bg-gradient-to-r from-indigo-100 to-purple-100 border-2 border-indigo-300 text-indigo-700 rounded text-[10px] font-bold">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Eligibility Check Notice */}
                <div className={`p-3 rounded-xl border-2 flex items-start space-x-2.5 ${
                  eligible
                    ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-300 text-emerald-700'
                    : 'bg-gradient-to-r from-rose-50 to-red-50 border-rose-300 text-rose-700'
                }`}>
                  {eligible ? (
                    <>
                      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-bold">You are eligible to apply!</p>
                        <p className="text-[10px] text-emerald-600 mt-0.5">Your academic profile meets all criteria configured by {selectedJob.company}.</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-bold">Eligibility criteria not met</p>
                        <ul className="list-disc list-inside text-[10px] text-rose-600 mt-1 space-y-0.5">
                          {reasons.map((r, idx) => <li key={idx}>{r}</li>)}
                        </ul>
                      </div>
                    </>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    onClick={() => setSelectedJob(null)}
                    className="px-4 py-2 border-2 border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-bold "
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleApply(selectedJob)}
                    disabled={!eligible}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-lg   hover:shadow-xl flex items-center space-x-1.5"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Submit Application</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
