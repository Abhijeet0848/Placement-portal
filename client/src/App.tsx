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
import { Users } from './pages/Admin/Users';
import { Permissions } from './pages/Admin/Permissions';
import { ActivityLogs } from './pages/Admin/ActivityLogs';
import { BackupDatabase } from './pages/Admin/BackupDatabase';
import { Analytics as AdminAnalytics } from './pages/Admin/Analytics';
import { HomePage } from './pages/HomePage';

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
      <Outlet />
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
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
        <Route path="/job-matcher" element={<JobMatcher />} />
        <Route path="/resume-builder" element={<ResumeBuilder />} />
        <Route path="/search-system" element={<SearchSystem />} />
        <Route path="/eligibility-checker" element={<EligibilityChecker />} />
        <Route path="/skill-assessment" element={<SkillAssessment />} />
        <Route path="/jobs" element={<JobBoard />} />
        <Route path="/applications" element={<ApplicationsTracker />} />
        <Route path="/career-roadmap" element={<CareerAdvisor />} />
        <Route path="/coding-lab" element={<CodingLab />} />
        <Route path="/mock-interview" element={<MockInterview />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/candidates" element={<Candidates />} />
        <Route path="/company-profile" element={<CompanyProfile />} />
        <Route path="/resume-ranking" element={<ResumeRanking />} />
        <Route path="/send-emails" element={<SendEmails />} />
        <Route path="/analytics" element={<RecruiterAnalytics />} />
        <Route path="/hire-reject" element={<HireReject />} />
        <Route path="/jobs/manage" element={<JobCreator />} />
        <Route path="/scheduler" element={<Scheduler />} />
        <Route path="/officer/verify" element={<Verify />} />
        <Route path="/officer/rules" element={<Rules />} />
        <Route path="/officer/reports" element={<Reports />} />
        <Route path="/officer/companies" element={<ManageCompanies />} />
        <Route path="/officer/students" element={<ManageStudents />} />
        <Route path="/officer/notices" element={<SendNotices />} />
        <Route path="/officer/analytics" element={<PlacementAnalytics />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/permissions" element={<Permissions />} />
        <Route path="/admin/logs" element={<ActivityLogs />} />
        <Route path="/admin/backup" element={<BackupDatabase />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
      </Route>

      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
}

export default App;
