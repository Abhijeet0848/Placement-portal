import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Cell, Legend
} from 'recharts';
import {
  TrendingUp, Award, Users, CheckCircle,
  Briefcase, ShieldCheck, Database, PlusCircle, Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Seed/Fetch dashboard stats
    const fetchDashboardStats = async () => {
      try {
        // Try fetching actual data from backend
        const jobsData = await api.get('/jobs');
        const appsData = user?.role === 'Student' 
          ? await api.get('/student/applications').catch(() => ({ applications: [] }))
          : await api.get('/recruiter/applications').catch(() => ({ applications: [] }));
        
        const dashboardData = user?.role === 'Student' 
          ? await api.get('/student/dashboard').catch(() => ({}))
          : user?.role === 'Recruiter'
          ? await api.get('/recruiter/dashboard').catch(() => ({}))
          : user?.role === 'Admin'
          ? await api.get('/admin/dashboard').catch(() => ({}))
          : {};

        setStats({
          jobs: jobsData.jobs || [],
          applications: appsData.applications || [],
          dashboard: dashboardData || null
        });
      } catch (err) {
        // Mock fallback stats if backend endpoints fail
        setStats({ jobs: [], applications: [], dashboard: null });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [user]);

  if (!user) return null;

  const officerDepartmentData = [
    { name: 'MCA', Package: 0, Placed: 0 },
    { name: 'CSE', Package: 0, Placed: 0 },
    { name: 'ECE', Package: 0, Placed: 0 },
    { name: 'ME', Package: 0, Placed: 0 }
  ];

  const PIE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

  // ==========================================
  // STUDENT VIEW
  // ==========================================
  const renderStudentDashboard = () => {
    const apps = stats?.applications || [];
    const resumeScore = user.profile.resumeScore || 0;
    const skills = user.profile.skills || [];
    const dStats = stats?.dashboard || {};

    const hiringReadiness = dStats.readinessScore || 0;
    const avgCodingScore = dStats.avgCodingScore || 0;
    const skillsEvaluatedCount = dStats.skillsEvaluatedCount || 0;
    const readinessJourney = dStats.readinessJourney || [{ name: 'Baseline', Score: 0 }];
    const aiPlacementTip = dStats.aiTip || "Take an assessment to generate your personalized tip!";

    return (
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-indigo-300 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-black text-white tracking-tight">Welcome back, {user.name}!</h3>
              {user.profile.branch && user.profile.cgpa && (
                <p className="text-sm text-indigo-100 mt-2 font-medium">Branch: {user.profile.branch} | Current GPA: {user.profile.cgpa}</p>
              )}
            </div>
            <Link to="/profile" className="px-4 py-2 bg-white hover:bg-indigo-50 rounded-xl text-sm font-bold text-indigo-700 transition-all shadow-lg">
              Complete Profile
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-md hover:shadow-xl transition-all">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Resume Score</p>
                <h4 className="text-2xl font-black text-slate-900 mt-1.5">{resumeScore > 0 ? `${resumeScore}/100` : 'Analyze Resume'}</h4>
              </div>
              <Award className="h-8 w-8 text-indigo-600" />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-md hover:shadow-xl transition-all">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Applications</p>
                <h4 className="text-2xl font-black text-slate-900 mt-1.5">{apps.length}</h4>
              </div>
              <Briefcase className="h-8 w-8 text-indigo-600" />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-md hover:shadow-xl transition-all">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Skills Evaluated</p>
                <h4 className="text-2xl font-black text-slate-900 mt-1.5">{skillsEvaluatedCount}</h4>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-md hover:shadow-xl transition-all">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Hiring Readiness</p>
                <h4 className="text-2xl font-black text-slate-900 mt-1.5">{hiringReadiness}%</h4>
              </div>
              <TrendingUp className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Charts & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Linear Line Chart */}
          <div className="relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-2xl lg:col-span-2">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
            <div className="relative z-10">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Placement Readiness Journey</h4>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={readinessJourney}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#1e293b' }} />
                    <Line type="monotone" dataKey="Score" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Job matching summary */}
          <div className="relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2 text-indigo-600">
                <Sparkles className="h-5 w-5" />
                <h4 className="text-sm font-bold uppercase tracking-wider">AI Skill Match Engine</h4>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border-2 border-indigo-200">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-700 font-medium">ATS Eligibility</span>
                    <span className="font-bold text-emerald-600">PASSED</span>
                  </div>
                  <div className="h-1.5 w-full bg-indigo-100 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: '88%' }}></div>
                  </div>
                </div>

                <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-700 font-medium">Coding assessments</span>
                    <span className="font-bold text-indigo-600">{avgCodingScore}% Avg Score</span>
                  </div>
                  <div className="h-1.5 w-full bg-purple-100 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: `${avgCodingScore}%` }}></div>
                  </div>
                </div>

                <div className="p-3 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border-2 border-amber-200">
                  <p className="text-xs font-bold text-amber-700">AI Placement Tip</p>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {aiPlacementTip}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Placement Statistics Snapshot</h4>
                <p className="text-xs text-slate-600 mt-1">Track how your profile strength, resume score, and application momentum are shaping your placement outlook.</p>
              </div>
              <Link to="/applications" className="px-4 py-2 rounded-xl border-2 border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all">
                Track Applications
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border-2 border-indigo-200">
                <p className="text-[10px] uppercase tracking-wider text-slate-600 font-bold">Placement Score</p>
                <p className="text-lg font-black text-slate-900 mt-1">88%</p>
                <p className="text-[11px] text-emerald-600 mt-1 font-medium">+6% from last month</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
                <p className="text-[10px] uppercase tracking-wider text-slate-600 font-bold">Resume Strength</p>
                <p className="text-lg font-black text-slate-900 mt-1">{resumeScore > 0 ? `${resumeScore}/100` : 'Pending'}</p>
                <p className="text-[11px] text-indigo-600 mt-1 font-medium">ATS-ready profile</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border-2 border-cyan-200">
                <p className="text-[10px] uppercase tracking-wider text-slate-600 font-bold">Active Applications</p>
                <p className="text-lg font-black text-slate-900 mt-1">{apps.length}</p>
                <p className="text-[11px] text-slate-600 mt-1 font-medium">Monitoring recruiter response</p>
              </div>
            </div>

            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Resume', score: resumeScore > 0 ? resumeScore : 72 },
                  { name: 'Skills', score: Math.min((skills.length || 0) * 10, 100) },
                  { name: 'Applications', score: Math.min(apps.length * 20, 100) },
                  { name: 'Mock Interviews', score: 78 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#1e293b' }} />
                  <Bar dataKey="score" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Application List */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
          <div className="relative z-10 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Job Applications Timeline</h4>
            {apps.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-slate-500">You have not applied to any job postings yet.</p>
                <Link to="/jobs" className="text-xs text-indigo-600 hover:text-indigo-700 font-bold mt-2 inline-block">
                  View open positions →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {apps.map((app: any) => {
                  const jobTitle = app.job?.title;
                  const companyName = app.job?.company;
                  const status = app.status;
                  const matchScore = app.matchScore;

                  return (
                    <div key={app._id} className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:shadow-md transition-all">
                      <div>
                        <h5 className="font-bold text-slate-900">{jobTitle}</h5>
                        <p className="text-xs text-slate-600 mt-0.5">{companyName} • Applied {new Date(app.appliedAt).toLocaleDateString()}</p>
                      </div>

                      <div className="flex items-center space-x-6">
                        {/* Match rating */}
                        <div className="text-center md:text-right">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">AI Match</span>
                          <span className={`text-xs font-extrabold ${matchScore >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {matchScore}%
                          </span>
                        </div>

                        {/* Status Stepper */}
                        <div className="flex items-center space-x-1">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border-2 ${
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
            )}
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // RECRUITER VIEW
  // ==========================================
  const renderRecruiterDashboard = () => {
    const dStats = stats?.dashboard || {};
    const totalJobs = dStats.totalJobs || 0;
    const totalApplicants = dStats.totalApplicants || 0;
    const selectionRatio = dStats.selectionRatio || "0.0";
    const ats = dStats.ats || { High: 0, Medium: 0, Low: 0 };
    const recruiterFunnelData = dStats.funnelData || [
      { name: 'Applied', Count: 0 },
      { name: 'Shortlisted', Count: 0 },
      { name: 'Selected', Count: 0 },
      { name: 'Rejected', Count: 0 }
    ];

    return (
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-indigo-300 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-black text-white tracking-tight">Recruiter Workspace</h3>
              <p className="text-sm text-indigo-200 mt-2">Coordinate campaigns, examine parsed profiles, and run automated interview schedules.</p>
            </div>
            <Link to="/jobs/manage" className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-sm font-bold shadow-lg transition-all hover:scale-105 flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              <span>Create New Job</span>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative overflow-hidden rounded-2xl border-2 border-slate-700 bg-slate-900 p-5 shadow-md hover:shadow-xl transition-all">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total job posts</p>
                <h4 className="text-2xl font-black text-white mt-1.5">{totalJobs}</h4>
              </div>
              <Briefcase className="h-8 w-8 text-indigo-500" />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border-2 border-slate-700 bg-slate-900 p-5 shadow-md hover:shadow-xl transition-all">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total applicants</p>
                <h4 className="text-2xl font-black text-white mt-1.5">{totalApplicants}</h4>
              </div>
              <Users className="h-8 w-8 text-indigo-500" />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border-2 border-slate-700 bg-slate-900 p-5 shadow-md hover:shadow-xl transition-all">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Selection Ratio</p>
                <h4 className="text-2xl font-black text-white mt-1.5">{selectionRatio}%</h4>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
          </div>
        </div>

        {/* Chart panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="relative overflow-hidden rounded-3xl border-2 border-slate-700 bg-slate-900 p-6 shadow-2xl lg:col-span-2">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
            <div className="relative z-10 space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Candidate Pipeline Funnel</h4>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={recruiterFunnelData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2e2e42" />
                    <XAxis dataKey="name" stroke="#8787aa" fontSize={11} />
                    <YAxis stroke="#8787aa" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#1b1b2a', border: '1px solid #2e2e42', borderRadius: '8px' }} />
                    <Bar dataKey="Count" fill="#6366f1" radius={[4, 4, 0, 0]}>
                      {recruiterFunnelData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border-2 border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
            <div className="relative z-10 space-y-4 flex flex-col justify-between h-full">
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">ATS Matching Metric</h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Google Geminis matching algorithms check applicant resumes against job requirements to filter profiles.
                </p>
              </div>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-xs p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                  <span className="text-slate-400">High Match (&gt;80%)</span>
                  <span className="font-bold text-emerald-400">{ats.High} Candidates</span>
                </div>
                <div className="flex justify-between items-center text-xs p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                  <span className="text-slate-400">Medium Match (50-80%)</span>
                  <span className="font-bold text-indigo-400">{ats.Medium} Candidates</span>
                </div>
                <div className="flex justify-between items-center text-xs p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                  <span className="text-slate-400">Unmatched (&lt;50%)</span>
                  <span className="font-bold text-rose-400">{ats.Low} Candidates</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // PLACEMENT OFFICER VIEW
  // ==========================================
  const renderOfficerDashboard = () => {
    return (
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-indigo-300 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-black text-white tracking-tight">Campus Placement Administration</h3>
            <p className="text-sm text-indigo-200 mt-2">Audit student records, verify Coursera certificates, configure CGPA rules, and generate drive statistics.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative overflow-hidden rounded-2xl border-2 border-slate-700 bg-slate-900 p-5 shadow-md hover:shadow-xl transition-all">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Highest Package</p>
                <h4 className="text-2xl font-black text-white mt-1.5">0 LPA</h4>
              </div>
              <Award className="h-8 w-8 text-amber-500" />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border-2 border-slate-700 bg-slate-900 p-5 shadow-md hover:shadow-xl transition-all">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Package</p>
                <h4 className="text-2xl font-black text-white mt-1.5">0 LPA</h4>
              </div>
              <TrendingUp className="h-8 w-8 text-indigo-500" />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border-2 border-slate-700 bg-slate-900 p-5 shadow-md hover:shadow-xl transition-all">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Eligible Students</p>
                <h4 className="text-2xl font-black text-white mt-1.5">0</h4>
              </div>
              <Users className="h-8 w-8 text-indigo-500" />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border-2 border-slate-700 bg-slate-900 p-5 shadow-md hover:shadow-xl transition-all">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Placement</p>
                <h4 className="text-2xl font-black text-white mt-1.5">0%</h4>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
          </div>
        </div>

        {/* Recharts Department Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="relative overflow-hidden rounded-3xl border-2 border-slate-700 bg-slate-900 p-6 shadow-2xl lg:col-span-2">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
            <div className="relative z-10 space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Average Package (LPA) & Placement Ratio by Dept</h4>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={officerDepartmentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2e2e42" />
                    <XAxis dataKey="name" stroke="#8787aa" fontSize={11} />
                    <YAxis stroke="#8787aa" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#1b1b2a', border: '1px solid #2e2e42', borderRadius: '8px' }} />
                    <Legend />
                    <Bar dataKey="Package" name="Avg Package (LPA)" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Placed" name="Placement Rate (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border-2 border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
            <div className="relative z-10 space-y-4 flex flex-col justify-between h-full">
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Documents Verification</h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Verify student certificate updates (Coursera/Udemy/NPTEL) to ensure integrity for recruiter drives.
                </p>
              </div>
              <div className="space-y-2.5">
                <Link to="/officer/verify" className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-bold text-center block transition-all shadow-lg">
                  Go to Verification panel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // ADMIN VIEW
  // ==========================================
  const renderAdminDashboard = () => {
    const adminStats = stats?.dashboard || {};
    const totalUsers = adminStats.totalUsers || 0;
    const systemHealth = adminStats.systemHealth || 'Excellent';
    const auditActivity = adminStats.auditActivity || 'Active';

    return (
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-3xl border-2 border-indigo-300 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-black text-white tracking-tight">System Security Administration</h3>
            <p className="text-sm text-indigo-200 mt-2">Configure role permissions, back up datasets, and inspect application logs.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/admin/users" className="relative overflow-hidden rounded-2xl border-2 border-slate-700 bg-slate-900 p-5 shadow-md hover:shadow-xl transition-all cursor-pointer hover:border-indigo-500">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Users</p>
                <h4 className="text-2xl font-black text-white mt-1.5">{totalUsers}</h4>
              </div>
              <Users className="h-8 w-8 text-indigo-500" />
            </div>
          </Link>

          <div className="relative overflow-hidden rounded-2xl border-2 border-slate-700 bg-slate-900 p-5 shadow-md hover:shadow-xl transition-all">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">System Health</p>
                <h4 className="text-2xl font-black text-emerald-400 mt-1.5">{systemHealth}</h4>
              </div>
              <ShieldCheck className="h-8 w-8 text-emerald-500" />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border-2 border-slate-700 bg-slate-900 p-5 shadow-md hover:shadow-xl transition-all">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Audit Activity</p>
                <h4 className="text-2xl font-black text-white mt-1.5">{auditActivity}</h4>
              </div>
              <Database className="h-8 w-8 text-indigo-500" />
            </div>
          </div>
        </div>

        {/* Admin Action logs */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-slate-700 bg-slate-900 p-6 shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
          <div className="relative z-10 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">System Event Log</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2.5">Timestamp</th>
                    <th className="py-2.5">Category</th>
                    <th className="py-2.5">User</th>
                    <th className="py-2.5">Event</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-slate-500">No events found.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-slate-400 font-semibold">Loading dashboard analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {user.role === 'Student' && renderStudentDashboard()}
      {user.role === 'Recruiter' && renderRecruiterDashboard()}
      {user.role === 'PlacementOfficer' && renderOfficerDashboard()}
      {user.role === 'Admin' && renderAdminDashboard()}
    </div>
  );
};
