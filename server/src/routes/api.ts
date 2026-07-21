import { Router } from 'express';
import multer from 'multer';
import { register, login, refreshToken, getProfile, updateProfile, getAllStudents, forgotPassword, resetPassword } from '../controllers/auth.controller';
import { createJob, getAllJobs, applyJob, getRecruiterApplications, updateApplicationStatus, getStudentApplications } from '../controllers/jobs.controller';
import { analyzeResumeUpload, evaluateInterview, getCareerRoadmap, createCoverLetter, matchJob, parseExamUpload } from '../controllers/ai.controller';
import { getExams, getExamById, submitExam, createExam } from '../controllers/exam.controller';
import { createThread, getAllThreads, addReply, createReview, getAllReviews, scheduleInterview, getInterviews } from '../controllers/discussion.controller';
import { getRecommendedJobs } from '../controllers/recommendation.controller';
import { getStudentDashboardStats, getRecruiterDashboardStats, sendEmail } from '../controllers/dashboard.controller';
import { authenticateJWT, requireRole } from '../middleware/auth';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Auth Routes
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/refresh', refreshToken);
router.post('/auth/forgot-password', forgotPassword);
router.post('/auth/reset-password', resetPassword);
router.get('/auth/profile', authenticateJWT, getProfile);
router.put('/auth/profile', authenticateJWT, updateProfile);
router.get('/auth/students', authenticateJWT, getAllStudents);

// Job Routes
router.post('/jobs', authenticateJWT, requireRole(['Recruiter', 'PlacementOfficer', 'Admin']), createJob);
router.get('/jobs', authenticateJWT, getAllJobs);
router.post('/jobs/:jobId/apply', authenticateJWT, requireRole(['Student']), applyJob);

// Application Tracking Routes
router.get('/recruiter/dashboard', authenticateJWT, requireRole(['Recruiter', 'PlacementOfficer', 'Admin']), getRecruiterDashboardStats);
router.get('/recruiter/applications', authenticateJWT, requireRole(['Recruiter', 'PlacementOfficer', 'Admin']), getRecruiterApplications);
router.put('/recruiter/applications/:appId/status', authenticateJWT, requireRole(['Recruiter', 'PlacementOfficer', 'Admin']), updateApplicationStatus);
router.post('/recruiter/send-email', authenticateJWT, requireRole(['Recruiter', 'PlacementOfficer', 'Admin']), sendEmail);
router.get('/student/dashboard', authenticateJWT, requireRole(['Student']), getStudentDashboardStats);
router.get('/student/applications', authenticateJWT, requireRole(['Student']), getStudentApplications);

// AI & Resume Parser Routes
router.post('/ai/analyze-resume', authenticateJWT, upload.single('resume'), analyzeResumeUpload);
router.post('/ai/evaluate-interview', authenticateJWT, evaluateInterview);
router.post('/ai/career-roadmap', authenticateJWT, getCareerRoadmap);
router.post('/ai/cover-letter', authenticateJWT, createCoverLetter);
router.post('/ai/match-job', authenticateJWT, matchJob);
router.post('/ai/parse-exam', authenticateJWT, requireRole(['Recruiter', 'PlacementOfficer', 'Admin']), upload.single('exam'), parseExamUpload);

// Exam & Assessment System
router.get('/exams', authenticateJWT, getExams);
router.get('/exams/:id', authenticateJWT, getExamById);
router.post('/exams/:id/submit', authenticateJWT, submitExam);
router.post('/exams', authenticateJWT, requireRole(['Recruiter', 'PlacementOfficer', 'Admin']), createExam);

// Discussion Forum Routes
router.get('/forum', authenticateJWT, getAllThreads);
router.post('/forum', authenticateJWT, createThread);
router.post('/forum/:id/reply', authenticateJWT, addReply);

// Company Reviews Routes
router.get('/reviews', authenticateJWT, getAllReviews);
router.post('/reviews', authenticateJWT, createReview);

// Interview Scheduler Routes
router.get('/interviews', authenticateJWT, getInterviews);
router.post('/interviews', authenticateJWT, requireRole(['Recruiter', 'PlacementOfficer', 'Admin']), scheduleInterview);

// Job Recommendation Engine
router.get('/jobs/recommended', authenticateJWT, getRecommendedJobs);

export default router;
