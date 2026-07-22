import { Router } from 'express';
import multer from 'multer';
import { register, login, googleLogin, microsoftLogin, refreshToken, getProfile, updateProfile, getAllStudents, getAllUsers, forgotPassword, resetPassword, deleteStudent, updateStudentProfile, logout, verifyEmail, uploadProfilePicture } from '../controllers/auth.controller';
import { createJob, getAllJobs, applyJob, getRecruiterApplications, updateApplicationStatus, getStudentApplications } from '../controllers/jobs.controller';
import { analyzeResumeUpload, evaluateInterview, getCareerRoadmap, createCoverLetter, matchJob, parseExamUpload } from '../controllers/ai.controller';
import { getExams, getExamById, submitExam, createExam } from '../controllers/exam.controller';
import { createThread, getAllThreads, editThread, deleteThread, addReply, createReview, getAllReviews, scheduleInterview, getInterviews } from '../controllers/discussion.controller';
import { getRecommendedJobs } from '../controllers/recommendation.controller';
import { getStudentDashboardStats, getRecruiterDashboardStats, getAdminDashboardStats, sendEmail } from '../controllers/dashboard.controller';
import { getPermissions, updatePermissions, createBackup, restoreBackup, getActivityLogs, updateUserStatus } from '../controllers/admin.controller';
// Removed extra import
import { authenticateJWT, requireRole } from '../middleware/auth';
import { connectDB } from '../config/dbConnect';

const router = Router();

export async function ensureDB(req: any, res: any, next: any) {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection failed in middleware:", error);
    res.status(500).json({ message: 'Database connection failed' });
  }
}

router.use(ensureDB);
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per window for auth routes
  message: { message: 'Too many authentication attempts from this IP, please try again after 15 minutes.' }
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and DOCX are allowed.'));
    }
  }
});

const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and PDF are allowed.'));
    }
  }
});

// Auth Routes
router.post('/auth/register', authLimiter, register);
router.post('/auth/login', authLimiter, login);
router.post('/auth/google', authLimiter, googleLogin);
router.post('/auth/microsoft', authLimiter, microsoftLogin);
router.post('/auth/logout', authenticateJWT, logout);
router.post('/auth/refresh', refreshToken);
router.post('/auth/verify-email', authenticateJWT, verifyEmail);
router.post('/auth/profile/picture', authenticateJWT, imageUpload.single('avatar'), uploadProfilePicture);
router.post('/auth/forgot-password', authLimiter, forgotPassword);
router.post('/auth/reset-password', authLimiter, resetPassword);
router.get('/auth/profile', authenticateJWT, getProfile);
router.put('/auth/profile', authenticateJWT, updateProfile);
router.get('/auth/students', authenticateJWT, getAllStudents);
router.get('/admin/users', authenticateJWT, requireRole(['Admin']), getAllUsers);
router.delete('/auth/students/:id', authenticateJWT, requireRole(['PlacementOfficer', 'Admin']), deleteStudent);
router.put('/auth/students/:id/profile', authenticateJWT, requireRole(['PlacementOfficer', 'Admin']), updateStudentProfile);

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
router.get('/admin/dashboard', authenticateJWT, requireRole(['Admin']), getAdminDashboardStats);
router.get('/admin/permissions', authenticateJWT, requireRole(['Admin']), getPermissions);
router.put('/admin/permissions/:role', authenticateJWT, requireRole(['Admin']), updatePermissions);
router.post('/admin/backup', authenticateJWT, requireRole(['Admin']), createBackup);
router.post('/admin/restore', authenticateJWT, requireRole(['Admin']), restoreBackup);
router.get('/admin/activity-logs', authenticateJWT, requireRole(['Admin']), getActivityLogs);
router.put('/admin/users/:id/status', authenticateJWT, requireRole(['Admin']), updateUserStatus);

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

import { broadcastNotice, getNotifications, markNotificationRead, markAllNotificationsRead } from '../controllers/notification.controller';

// Notification Routes
router.post('/notifications/broadcast', authenticateJWT, requireRole(['PlacementOfficer', 'Admin']), broadcastNotice);
router.get('/notifications', authenticateJWT, getNotifications);
router.put('/notifications/read', authenticateJWT, markAllNotificationsRead);
router.put('/notifications/:id/read', authenticateJWT, markNotificationRead);

// Discussion Forum Routes
router.get('/forum', authenticateJWT, getAllThreads);
router.post('/forum', authenticateJWT, createThread);
router.put('/forum/:id', authenticateJWT, editThread);
router.delete('/forum/:id', authenticateJWT, deleteThread);
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
