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
import { AiChatWidget } from '../components/AiChatWidget';

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
        <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
          {/* Decorative background blur */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <p className="text-emerald-400 font-bold uppercase tracking-wider text-xs mb-1">Student Portal</p>
              <h3 className="text-3xl font-black tracking-tight text-white">Welcome back, {user.name}!</h3>
              {user.profile.branch && user.profile.cgpa && (
                <p className="text-sm text-slate-300 mt-2 font-medium">
                  Branch: <span className="text-white">{user.profile.branch}</span> <span className="mx-2 text-slate-600">|</span> Current GPA: <span className="text-white">{user.profile.cgpa}</span>
                </p>
              )}
            </div>
            <Link to="/profile" className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-sm font-bold text-white shadow-sm transition-all whitespace-nowrap">
              Complete Profile
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Resume Score</p>
                <h4 className="text-2xl font-black text-slate-900 mt-1">{resumeScore > 0 ? `${resumeScore}/100` : 'Analyze'}</h4>
              </div>
              <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Award className="h-5 w-5 text-indigo-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Applications</p>
                <h4 className="text-2xl font-black text-slate-900 mt-1">{apps.length}</h4>
              </div>
              <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Briefcase className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Skills Evaluated</p>
                <h4 className="text-2xl font-black text-slate-900 mt-1">{skillsEvaluatedCount}</h4>
              </div>
              <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hiring Readiness</p>
                <h4 className="text-2xl font-black text-slate-900 mt-1">{hiringReadiness}%</h4>
              </div>
              <div className="h-10 w-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="h-5 w-5 text-amber-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Linear Line Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm lg:col-span-2">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" /> Placement Readiness Journey
            </h4>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={readinessJourney} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#0f172a', fontWeight: 'bold', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }} />
                  <Line type="monotone" dataKey="Score" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, fill: '#10b981' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Job matching summary */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Sparkles className="h-5 w-5 text-indigo-600" />
                </div>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">AI Skill Match Engine</h4>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-600 font-bold uppercase tracking-wider">ATS Eligibility</span>
                    {resumeScore === 0 ? (
                      <span className="font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-[10px]">PENDING</span>
                    ) : resumeScore > 70 ? (
                      <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">PASSED</span>
                    ) : (
                      <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-[10px]">NEEDS WORK</span>
                    )}
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${resumeScore > 70 ? 'bg-emerald-500' : resumeScore > 0 ? 'bg-amber-500' : 'bg-slate-300'}`} style={{ width: `${resumeScore || 0}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-600 font-bold uppercase tracking-wider">Coding assessments</span>
                    <span className="font-bold text-blue-600">{avgCodingScore}% Avg</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${avgCodingScore}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 mt-6 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-amber-500/10 rounded-full blur-xl" />
              <p className="text-[11px] font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> AI Placement Tip
              </p>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium relative z-10">
                {aiPlacementTip}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">Placement Statistics Snapshot</h4>
                <p className="text-xs text-slate-500 mt-1">Track how your profile strength, resume score, and application momentum are shaping your placement outlook.</p>
              </div>
              <Link to="/applications" className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap">
                Track Applications
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 relative overflow-hidden">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Placement Score</p>
                <p className="text-2xl font-black text-slate-900 mt-1.5">{hiringReadiness}%</p>
                {hiringReadiness > 0 && (
                  <div className="mt-2 inline-flex items-center gap-1 bg-emerald-100/50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">
                    <TrendingUp className="w-3 h-3" /> Active profile
                  </div>
                )}
              </div>
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Resume Strength</p>
                <p className="text-2xl font-black text-slate-900 mt-1.5">{resumeScore > 0 ? `${resumeScore}/100` : 'Pending'}</p>
                <p className="text-xs text-blue-600 mt-2 font-bold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> ATS-ready profile
                </p>
              </div>
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Active Applications</p>
                <p className="text-2xl font-black text-slate-900 mt-1.5">{apps.length}</p>
                <p className="text-xs text-slate-500 mt-2 font-medium flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5" /> Monitoring responses
                </p>
              </div>
            </div>

            <div className="h-56 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Resume', score: resumeScore > 0 ? resumeScore : 0 },
                  { name: 'Skills', score: Math.min((skills.length || 0) * 10, 100) },
                  { name: 'Applications', score: Math.min(apps.length * 20, 100) },
                  { name: 'Mock Interviews', score: dStats.mockInterviewScore || 0 }
                ]} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#0f172a', fontWeight: 'bold' }} />
                  <Bar dataKey="score" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Application List */}
        <div className="saas-card p-6">
          <div className="relative z-10 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Job Applications Timeline</h4>
            {apps.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-slate-500">You have not applied to any job postings yet.</p>
                <Link to="/jobs" className="text-xs text-blue-600 hover:text-blue-700 font-bold mt-2 inline-block transition-colors">
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
                    <div key={app._id} className="p-4 bg-white border border-slate-200 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:border-slate-300 transition-colors">
                      <div>
                        <h5 className="font-bold text-slate-900">{jobTitle}</h5>
                        <p className="text-xs text-slate-500 mt-0.5">{companyName} • Applied {new Date(app.appliedAt).toLocaleDateString()}</p>
                      </div>

                      <div className="flex items-center space-x-6">
                        {/* Match rating */}
                        <div className="text-center md:text-right">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">AI Match</span>
                          <span className={`text-xs font-extrabold ${matchScore >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {matchScore}%
                          </span>
                        </div>

                        {/* Status Stepper */}
                        <div className="flex items-center space-x-1">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                            status === 'Selected' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                            status === 'Shortlisted' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                            status === 'Rejected' ? 'bg-rose-50 border-rose-200 text-rose-700' :
                            'bg-slate-50 border-slate-200 text-slate-700'
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
        <div className="saas-card p-8 bg-white border border-slate-200">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-black tracking-tight text-slate-900 capitalize">{user.role} Workspace</h3>
              <p className="text-sm text-slate-500 mt-2">Coordinate campaigns, examine parsed profiles, and run automated interview schedules.</p>
            </div>
            <Link to="/jobs/manage" className="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-900 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2 w-full sm:w-auto flex-shrink-0">
              <PlusCircle className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">Create New Job</span>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="saas-card p-5 saas-card-interactive">
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total job posts</p>
                <h4 className="text-2xl font-black text-slate-900 mt-1.5">{totalJobs}</h4>
              </div>
              <Briefcase className="h-8 w-8 text-slate-400" />
            </div>
          </div>

          <div className="saas-card p-5 saas-card-interactive">
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total applicants</p>
                <h4 className="text-2xl font-black text-slate-900 mt-1.5">{totalApplicants}</h4>
              </div>
              <Users className="h-8 w-8 text-slate-400" />
            </div>
          </div>

          <div className="saas-card p-5 saas-card-interactive">
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Selection Ratio</p>
                <h4 className="text-2xl font-black text-slate-900 mt-1.5">{selectionRatio}%</h4>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
          </div>
        </div>

        {/* Chart panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="saas-card p-6 lg:col-span-2">
            <div className="relative z-10 space-y-4">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Candidate Pipeline Funnel</h4>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={recruiterFunnelData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                    <Bar dataKey="Count" fill="#0f172a" radius={[4, 4, 0, 0]}>
                      {recruiterFunnelData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="saas-card p-6">
            <div className="relative z-10 space-y-4 flex flex-col justify-between h-full">
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">ATS Matching Metric</h4>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Google Geminis matching algorithms check applicant resumes against job requirements to filter profiles.
                </p>
              </div>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-xs p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-600">High Match (&gt;80%)</span>
                  <span className="font-bold text-emerald-600">{ats.High} Candidates</span>
                </div>
                <div className="flex justify-between items-center text-xs p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-600">Medium Match (50-80%)</span>
                  <span className="font-bold text-blue-600">{ats.Medium} Candidates</span>
                </div>
                <div className="flex justify-between items-center text-xs p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-600">Unmatched (&lt;50%)</span>
                  <span className="font-bold text-rose-600">{ats.Low} Candidates</span>
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
        <div className="saas-card p-8 bg-white border border-slate-200">
          <div className="relative z-10">
            <h3 className="text-2xl font-black tracking-tight text-slate-900 capitalize">{user.role} Administration</h3>
            <p className="text-sm text-slate-500 mt-2">Audit student records, verify Coursera certificates, configure CGPA rules, and generate drive statistics.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="saas-card p-5 saas-card-interactive">
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Top Package</p>
                <h4 className="text-2xl font-black text-slate-900 mt-1.5">0 LPA</h4>
              </div>
              <Award className="h-8 w-8 text-slate-400" />
            </div>
          </div>

          <div className="saas-card p-5 saas-card-interactive">
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Average Package</p>
                <h4 className="text-2xl font-black text-slate-900 mt-1.5">0 LPA</h4>
              </div>
              <TrendingUp className="h-8 w-8 text-slate-400" />
            </div>
          </div>

          <div className="saas-card p-5 saas-card-interactive">
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Eligible Students</p>
                <h4 className="text-2xl font-black text-slate-900 mt-1.5">0</h4>
              </div>
              <Users className="h-8 w-8 text-slate-400" />
            </div>
          </div>

          <div className="saas-card p-5 saas-card-interactive">
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overall Placement</p>
                <h4 className="text-2xl font-black text-slate-900 mt-1.5">0%</h4>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
          </div>
        </div>

        {/* Recharts Department Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="saas-card p-6 lg:col-span-2">
            <div className="relative z-10 space-y-4">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Average Package (LPA) & Placement Ratio by Dept</h4>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={officerDepartmentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#1e293b' }} />
                    <Legend />
                    <Bar dataKey="Package" name="Avg Package (LPA)" fill="#0f172a" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Placed" name="Placement Rate (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="saas-card p-6">
            <div className="relative z-10 space-y-4 flex flex-col justify-between h-full">
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Documents Verification</h4>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Verify student certificate updates (Coursera/Udemy/NPTEL) to ensure integrity for recruiter drives.
                </p>
              </div>
              <div className="space-y-2.5">
                <Link to="/officer/verify" className="w-full py-2 saas-button-primary text-xs font-bold text-center block">
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
        <div className="saas-card p-8 bg-slate-900 text-white">
          <div className="relative z-10">
            <h3 className="text-2xl font-black tracking-tight">System Security Administration</h3>
            <p className="text-sm text-slate-300 mt-2">Configure role permissions, back up datasets, and inspect application logs.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/admin/users" className="saas-card p-5 saas-card-interactive cursor-pointer">
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Registered Users</p>
                <h4 className="text-2xl font-black text-slate-900 mt-1.5">{totalUsers}</h4>
              </div>
              <Users className="h-8 w-8 text-slate-400" />
            </div>
          </Link>

          <div className="saas-card p-5 saas-card-interactive">
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">System Health</p>
                <h4 className="text-2xl font-black text-emerald-600 mt-1.5">{systemHealth}</h4>
              </div>
              <ShieldCheck className="h-8 w-8 text-emerald-500" />
            </div>
          </div>

          <div className="saas-card p-5 saas-card-interactive">
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Audit Activity</p>
                <h4 className="text-2xl font-black text-slate-900 mt-1.5">{auditActivity}</h4>
              </div>
              <Database className="h-8 w-8 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Admin Action logs */}
        <div className="saas-card p-6">
          <div className="relative z-10 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">System Event Log</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2.5">Timestamp</th>
                    <th className="py-2.5">Category</th>
                    <th className="py-2.5">User</th>
                    <th className="py-2.5">Event</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
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
        <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full "></div>
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
      
      {/* AI Assistant for Students */}
      {user.role === 'Student' && <AiChatWidget />}
    </div>
  );
};
