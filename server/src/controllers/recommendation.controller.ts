import { Response } from 'express';
import mongoose from 'mongoose';
import { isMockDb } from '../config/dbConnect';
import { mockDb } from '../db/mockDb';
import Job from '../models/Job';
import User from '../models/User';
import Application from '../models/Application';
import { AuthenticatedRequest } from '../middleware/auth';
import logger from '../utils/logger';

export async function getRecommendedJobs(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'Unauthorized.' });

  try {
    let userProfile: any = null;
    let appliedJobIds: string[] = [];

    if (isMockDb) {
      userProfile = mockDb.users.find(u => u._id === userId);
      const userApps = mockDb.applications.filter(a => a.studentId === userId);
      appliedJobIds = userApps.map(a => a.jobId);
    } else {
      userProfile = await User.findById(userId);
      const userApps = await Application.find({ studentId: userId });
      appliedJobIds = userApps.map(a => a.jobId.toString());
    }

    if (!userProfile) return res.status(404).json({ message: 'Profile not found.' });

    const userSkills = userProfile.profile?.skills || [];
    const userCGPA = userProfile.profile?.cgpa || 0;
    const userBranch = userProfile.profile?.branch || '';

    let allJobs: any[] = [];
    if (isMockDb) {
      allJobs = mockDb.jobs.filter(j => !appliedJobIds.includes(j._id));
    } else {
      allJobs = await Job.find({ _id: { $nin: appliedJobIds.map(id => new mongoose.Types.ObjectId(id)) } })
        .populate('postedBy', 'name email');
    }

    const scoredJobs = allJobs.map(job => {
      const requiredSkills = job.requirements?.skills || [];
      const minCGPA = job.requirements?.minCGPA || 0;
      const allowedBranches = job.requirements?.branches || [];

      const matchedSkills = requiredSkills.filter((skill: string) => 
        userSkills.some((us: string) => us.toLowerCase() === skill.toLowerCase())
      );

      const missingSkills = requiredSkills.filter((skill: string) => 
        !userSkills.some((us: string) => us.toLowerCase() === skill.toLowerCase())
      );

      const skillScore = requiredSkills.length > 0 ? (matchedSkills.length / requiredSkills.length) : 0.5;
      const cgpaScore = minCGPA > 0 ? Math.min(userCGPA / minCGPA, 1) : 0.8;
      const branchScore = allowedBranches.length > 0 
        ? (allowedBranches.some((b: string) => b.toLowerCase() === userBranch.toLowerCase()) ? 1 : 0)
        : 0.8;

      const overallScore = Math.round((skillScore * 0.5 + cgpaScore * 0.3 + branchScore * 0.2) * 100);

      let recommendation = 'Not Recommended';
      if (overallScore >= 75) recommendation = 'Highly Recommended';
      else if (overallScore >= 50) recommendation = 'Recommended';

      return {
        ...job,
        matchScore: overallScore,
        matchedSkills,
        missingSkills,
        recommendation
      };
    });

    scoredJobs.sort((a: any, b: any) => b.matchScore - a.matchScore);

    return res.json({ jobs: scoredJobs });
  } catch (error: any) {
    logger.error(`Get recommended jobs failed: ${error?.message || error}`);
    return res.status(500).json({ message: 'Server recommendation error' });
  }
}