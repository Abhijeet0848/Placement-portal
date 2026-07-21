import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { DashboardLayout } from './components/DashboardLayout';
import { useAuth } from './context/AuthContext';
import { Login } from './pages/Auth/Login';
import { Dashboard } from './pages/Dashboard';
import { Forum } from './pages/Forum';
import { Reviews } from './pages/Reviews';
import { ApplicationsTracker } from './pages/Student/Applications';
import { CareerAdvisor } from './pages/Student/CareerAdvisor';
import { CodingLab } from './pages/Student/CodingLab';
import { JobBoard } from './pages/Student/JobBoard';
import { MockInterview } from './pages/Student/MockInterview';
import { Profile } from './pages/Student/Profile';
import { ResumeAnalyzer } from './pages/Student/ResumeAnalyzer';
import { JobMatcher } from './pages/Student/JobMatcher';
import { ResumeBuilder } from './pages/Student/ResumeBuilder';
import { SearchSystem } from './pages/Student/SearchSystem';
import { EligibilityChecker } from './pages/Student/EligibilityChecker';
import { SkillAssessment } from './pages/Student/SkillAssessment';
import { Candidates } from './pages/Recruiter/Candidates';
import { JobCreator } from './pages/Recruiter/JobCreator';
import { Scheduler } from './pages/Recruiter/Scheduler';
import { CompanyProfile } from './pages/Recruiter/CompanyProfile';
import { ResumeRanking } from './pages/Recruiter/ResumeRanking';
import { SendEmails } from './pages/Recruiter/SendEmails';
import { Analytics as RecruiterAnalytics } from './pages/Recruiter/Analytics';
import { HireReject } from './pages/Recruiter/HireReject';
import { Reports } from './pages/Officer/Reports';
import { Rules } from './pages/Officer/Rules';
import { Verify } from './pages/Officer/Verify';
import { ManageCompanies } from './pages/Officer/ManageCompanies';
import { ManageStudents } from './pages/Officer/ManageStudents';
import { SendNotices } from './pages/Officer/SendNotices';
import { PlacementAnalytics } from './pages/Officer/PlacementAnalytics';
import { ExamCreator } from './pages/Officer/ExamCreator';
import { Users } from './pages/Admin/Users';
import { Permissions } from './pages/Admin/Permissions';
import { ActivityLogs } from './pages/Admin/ActivityLogs';
import { BackupDatabase } from './pages/Admin/BackupDatabase';
import { Analytics as AdminAnalytics } from './pages/Admin/Analytics';
import { HomePage } from './pages/HomePage';
import { AnimatePresence } from 'framer-motion';
import { AnimatedRoute } from './components/AnimatedRoute';

const ProtectedLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950 text-slate-200">
        Loading your portal...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <DashboardLayout>
      <AnimatePresence mode="wait">
        <Outlet />
      </AnimatePresence>
    </DashboardLayout>
  );
};

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950 text-slate-200">
        Initializing portal...
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />

      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<AnimatedRoute><Dashboard /></AnimatedRoute>} />
        <Route path="/profile" element={<AnimatedRoute><Profile /></AnimatedRoute>} />
        <Route path="/resume-analyzer" element={<AnimatedRoute><ResumeAnalyzer /></AnimatedRoute>} />
        <Route path="/job-matcher" element={<AnimatedRoute><JobMatcher /></AnimatedRoute>} />
        <Route path="/resume-builder" element={<AnimatedRoute><ResumeBuilder /></AnimatedRoute>} />
        <Route path="/search-system" element={<AnimatedRoute><SearchSystem /></AnimatedRoute>} />
        <Route path="/eligibility-checker" element={<AnimatedRoute><EligibilityChecker /></AnimatedRoute>} />
        <Route path="/skill-assessment" element={<AnimatedRoute><SkillAssessment /></AnimatedRoute>} />
        <Route path="/jobs" element={<AnimatedRoute><JobBoard /></AnimatedRoute>} />
        <Route path="/applications" element={<AnimatedRoute><ApplicationsTracker /></AnimatedRoute>} />
        <Route path="/career-roadmap" element={<AnimatedRoute><CareerAdvisor /></AnimatedRoute>} />
        <Route path="/coding-lab" element={<AnimatedRoute><CodingLab /></AnimatedRoute>} />
        <Route path="/mock-interview" element={<AnimatedRoute><MockInterview /></AnimatedRoute>} />
        <Route path="/forum" element={<AnimatedRoute><Forum /></AnimatedRoute>} />
        <Route path="/reviews" element={<AnimatedRoute><Reviews /></AnimatedRoute>} />
        <Route path="/candidates" element={<AnimatedRoute><Candidates /></AnimatedRoute>} />
        <Route path="/company-profile" element={<AnimatedRoute><CompanyProfile /></AnimatedRoute>} />
        <Route path="/resume-ranking" element={<AnimatedRoute><ResumeRanking /></AnimatedRoute>} />
        <Route path="/send-emails" element={<AnimatedRoute><SendEmails /></AnimatedRoute>} />
        <Route path="/analytics" element={<AnimatedRoute><RecruiterAnalytics /></AnimatedRoute>} />
        <Route path="/hire-reject" element={<AnimatedRoute><HireReject /></AnimatedRoute>} />
        <Route path="/jobs/manage" element={<AnimatedRoute><JobCreator /></AnimatedRoute>} />
        <Route path="/scheduler" element={<AnimatedRoute><Scheduler /></AnimatedRoute>} />
        <Route path="/officer/verify" element={<AnimatedRoute><Verify /></AnimatedRoute>} />
        <Route path="/officer/rules" element={<AnimatedRoute><Rules /></AnimatedRoute>} />
        <Route path="/officer/reports" element={<AnimatedRoute><Reports /></AnimatedRoute>} />
        <Route path="/officer/companies" element={<AnimatedRoute><ManageCompanies /></AnimatedRoute>} />
        <Route path="/officer/students" element={<AnimatedRoute><ManageStudents /></AnimatedRoute>} />
        <Route path="/officer/notices" element={<AnimatedRoute><SendNotices /></AnimatedRoute>} />
        <Route path="/officer/analytics" element={<AnimatedRoute><PlacementAnalytics /></AnimatedRoute>} />
        <Route path="/officer/exams" element={<AnimatedRoute><ExamCreator /></AnimatedRoute>} />
        <Route path="/admin/users" element={<AnimatedRoute><Users /></AnimatedRoute>} />
        <Route path="/admin/permissions" element={<AnimatedRoute><Permissions /></AnimatedRoute>} />
        <Route path="/admin/logs" element={<AnimatedRoute><ActivityLogs /></AnimatedRoute>} />
        <Route path="/admin/backup" element={<AnimatedRoute><BackupDatabase /></AnimatedRoute>} />
        <Route path="/admin/analytics" element={<AnimatedRoute><AdminAnalytics /></AnimatedRoute>} />
      </Route>

      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
}

export default App;
