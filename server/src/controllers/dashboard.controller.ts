import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import AssessmentResult from '../models/AssessmentResult';
import User from '../models/User';
import logger from '../utils/logger';

export async function getStudentDashboardStats(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(userId);
    const assessments = await AssessmentResult.find({ user: userId }).sort({ submittedAt: 1 }); // Chronological

    // Default stats
    let readinessScore = 0;
    let avgCodingScore = 0;
    let evaluatedSkills = new Set<string>();
    let aiTip = "Take your first assessment to receive personalized AI placement tips based on your performance.";
    const readinessJourney: { name: string, Score: number }[] = [];

    if (assessments.length > 0) {
      let totalScore = 0;
      let totalCodingScore = 0;
      
      assessments.forEach((assessment, index) => {
        totalScore += assessment.score;
        totalCodingScore += assessment.codingScore;
        
        // Collect unique skills evaluated
        if (assessment.aiFeedback?.skillAnalysis) {
          const keys = assessment.aiFeedback.skillAnalysis instanceof Map 
            ? Array.from(assessment.aiFeedback.skillAnalysis.keys())
            : Object.keys(assessment.aiFeedback.skillAnalysis);
          keys.forEach(k => evaluatedSkills.add(k));
        }

        // Add to journey chart
        readinessJourney.push({
          name: `Assessment ${index + 1}`,
          Score: assessment.score
        });
      });

      readinessScore = Math.round(totalScore / assessments.length);
      avgCodingScore = Math.round(totalCodingScore / assessments.length);

      // AI Tip logic based on latest assessment
      const latest = assessments[assessments.length - 1];
      const weakest = latest.aiFeedback?.weakestTopic;
      const strongest = latest.aiFeedback?.strongestTopic;

      if (weakest) {
        aiTip = `Your recent assessment indicates you need practice in ${weakest}. Try focusing on this area before your next screening test.`;
        if (strongest) {
          aiTip = `Your ${strongest} fundamentals are strong. However, improving in ${weakest} will maximize your hiring match rate!`;
        }
      } else {
        aiTip = "Keep practicing assessments to uncover hidden weak points.";
      }
    } else {
      // No assessments yet, provide a baseline chart point so the chart isn't completely empty
      readinessJourney.push({ name: 'Baseline', Score: 0 });
      if (user?.profile?.resumeScore && user.profile.resumeScore > 0) {
        aiTip = `Your resume scored ${user.profile.resumeScore}/100. Take an assessment to see how your practical coding skills align with your ATS score!`;
      }
    }

    return res.json({
      readinessScore,
      avgCodingScore,
      skillsEvaluatedCount: evaluatedSkills.size,
      readinessJourney,
      aiTip
    });

  } catch (error: any) {
    logger.error(`Get student dashboard stats failed: ${error?.message || error}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getRecruiterDashboardStats(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const JobModel = (await import('../models/Job')).default;
    const AppModel = (await import('../models/Application')).default;

    const jobs = await JobModel.find({ postedBy: userId });
    const jobIds = jobs.map(j => j._id);
    const applications = await AppModel.find({ jobId: { $in: jobIds } });

    const totalJobs = jobs.length;
    const totalApplicants = applications.length;

    let selectedCount = 0;
    const funnel = { Applied: 0, Shortlisted: 0, Rejected: 0, Selected: 0 };
    const ats = { High: 0, Medium: 0, Low: 0 };

    applications.forEach(app => {
      const status = app.status as 'Applied' | 'Shortlisted' | 'Rejected' | 'Selected';
      funnel[status] = (funnel[status] || 0) + 1;
      if (status === 'Selected') selectedCount++;

      if (app.matchScore > 80) ats.High++;
      else if (app.matchScore >= 50) ats.Medium++;
      else ats.Low++;
    });

    const selectionRatio = totalApplicants > 0 ? ((selectedCount / totalApplicants) * 100).toFixed(1) : "0.0";

    const funnelData = [
      { name: 'Applied', Count: funnel.Applied },
      { name: 'Shortlisted', Count: funnel.Shortlisted },
      { name: 'Selected', Count: funnel.Selected },
      { name: 'Rejected', Count: funnel.Rejected }
    ];

    return res.json({
      totalJobs,
      totalApplicants,
      selectionRatio,
      funnelData,
      ats
    });
  } catch (error: any) {
    logger.error(`Get recruiter dashboard stats failed: ${error?.message || error}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function sendEmail(req: AuthenticatedRequest, res: Response) {
  const { to, subject, message } = req.body;
  if (!to || !subject || !message) {
    return res.status(400).json({ message: 'To, subject, and message are required.' });
  }

  // Simulate sending email since SMTP is not configured
  logger.info(`--- MOCK EMAIL SENT ---`);
  logger.info(`To: ${to}`);
  logger.info(`Subject: ${subject}`);
  logger.info(`Message: ${message}`);
  logger.info(`-----------------------`);

  return res.json({ message: 'Email sent successfully (logged to console).' });
}

export async function getAdminDashboardStats(req: AuthenticatedRequest, res: Response) {
  try {
    const totalUsers = await User.countDocuments();
    
    // In a real app we might query a logs collection, but for now we'll just return the user count
    // and empty events
    
    return res.json({
      totalUsers,
      systemHealth: 'Excellent',
      auditActivity: 'Active',
      events: []
    });
  } catch (error: any) {
    logger.error(`Get admin dashboard stats failed: ${error?.message || error}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

