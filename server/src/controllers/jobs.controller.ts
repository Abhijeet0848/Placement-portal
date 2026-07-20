import { Response } from 'express';
import mongoose from 'mongoose';
import { isMockDb } from '../config/dbConnect';
import { mockDb } from '../db/mockDb';
import Job from '../models/Job';
import Application from '../models/Application';
import User from '../models/User';
import { AuthenticatedRequest } from '../middleware/auth';
import { matchResumeToJob } from '../services/ai.service';
import logger from '../utils/logger';

// 1. Create Job (Recruiter Only)
export async function createJob(req: AuthenticatedRequest, res: Response) {
  const { title, company, location, description, salary, minCGPA, branches, skills } = req.body;

  if (!title || !company || !location || !description || !salary) {
    return res.status(400).json({ message: 'Title, company, location, description, and salary are required.' });
  }

  try {
    const minCGPAVal = minCGPA !== undefined ? Number(minCGPA) : 0;
    const branchesArr = Array.isArray(branches) ? branches : [];
    const skillsArr = Array.isArray(skills) ? skills : [];

    if (isMockDb) {
      const newJob = {
        _id: `job_${Date.now()}`,
        title,
        company,
        location,
        description,
        salary: Number(salary),
        requirements: {
          minCGPA: minCGPAVal,
          branches: branchesArr,
          skills: skillsArr
        },
        postedBy: req.user?.id || 'usr_rec_1',
        applicantsCount: 0,
        createdAt: new Date()
      };

      mockDb.jobs.push(newJob);
      return res.status(201).json({ message: 'Job created successfully (Mock DB)', job: newJob });
    } else {
      const job = new Job({
        title,
        company,
        location,
        description,
        salary: Number(salary),
        requirements: {
          minCGPA: minCGPAVal,
          branches: branchesArr,
          skills: skillsArr
        },
        postedBy: new mongoose.Types.ObjectId(req.user?.id)
      });

      await job.save();
      return res.status(201).json({ message: 'Job created successfully', job });
    }
  } catch (error: any) {
    logger.error(`Create job failed: ${error?.message || error}`);
    return res.status(500).json({ message: 'Server job creation error' });
  }
}

// 2. Get All Jobs
export async function getAllJobs(req: AuthenticatedRequest, res: Response) {
  try {
    if (isMockDb) {
      return res.json({ jobs: mockDb.jobs });
    } else {
      const jobs = await Job.find().populate('postedBy', 'name email');
      return res.json({ jobs });
    }
  } catch (error: any) {
    logger.error(`Get jobs failed: ${error?.message || error}`);
    return res.status(500).json({ message: 'Server fetch jobs error' });
  }
}

// 3. Apply for Job (Student Only)
export async function applyJob(req: AuthenticatedRequest, res: Response) {
  const { jobId } = req.params;
  const studentId = req.user?.id;

  if (!studentId) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  try {
    let studentProfile: any = null;
    let jobDetails: any = null;

    if (isMockDb) {
      studentProfile = mockDb.users.find(u => u._id === studentId);
      jobDetails = mockDb.jobs.find(j => j._id === jobId);
    } else {
      studentProfile = await User.findById(studentId);
      jobDetails = await Job.findById(jobId);
    }

    if (!studentProfile) return res.status(404).json({ message: 'Student profile not found' });
    if (!jobDetails) return res.status(404).json({ message: 'Job not found' });

    // 1. SMART ELIGIBILITY CHECKER
    const studentCGPA = studentProfile.profile.cgpa || 0;
    const studentBranch = studentProfile.profile.branch || '';
    const studentSkills = studentProfile.profile.skills || [];

    const minCGPA = jobDetails.requirements?.minCGPA || 0;
    const allowedBranches = jobDetails.requirements?.branches || [];

    const ineligibleReasons: string[] = [];
    if (studentCGPA < minCGPA) {
      ineligibleReasons.push(`CGPA is ${studentCGPA}, but job requires minimum ${minCGPA}.`);
    }
    if (allowedBranches.length > 0 && !allowedBranches.map((b: string) => b.toLowerCase()).includes(studentBranch.toLowerCase())) {
      ineligibleReasons.push(`Branch is ${studentBranch}, but job only accepts: ${allowedBranches.join(', ')}.`);
    }

    if (ineligibleReasons.length > 0) {
      return res.status(400).json({
        message: 'Eligibility criteria not met.',
        eligible: false,
        reasons: ineligibleReasons
      });
    }

    // 2. CHECK IF ALREADY APPLIED
    if (isMockDb) {
      const alreadyApplied = mockDb.applications.some(a => a.jobId === jobId && a.studentId === studentId);
      if (alreadyApplied) return res.status(400).json({ message: 'You have already applied for this job.' });
    } else {
      const alreadyApplied = await Application.findOne({ jobId, studentId });
      if (alreadyApplied) return res.status(400).json({ message: 'You have already applied for this job.' });
    }

    // 3. AI RESUME MATCHING
    const resumeText = `${studentProfile.name}'s resume. Skills: ${studentSkills.join(', ')}. Branch: ${studentBranch}. CGPA: ${studentCGPA}. Experience: ${studentProfile.profile.experience?.join('. ')}. Projects: ${studentProfile.profile.projects?.map((p: any) => `${p.title}: ${p.description}`).join('. ')}.`;
    
    logger.info(`Running AI Job Matcher for ${studentProfile.name}...`);
    const matchAnalysis = await matchResumeToJob(resumeText, {
      title: jobDetails.title,
      description: jobDetails.description,
      skills: jobDetails.requirements?.skills || []
    });

    if (isMockDb) {
      const newApp = {
        _id: `app_${Date.now()}`,
        jobId,
        studentId,
        status: 'Applied' as const,
        resumeUrl: studentProfile.profile.resumeUrl || 'https://res.cloudinary.com/demo/image/upload/sample_resume.pdf',
        matchScore: matchAnalysis.matchScore || 50,
        matchDetails: {
          matchedSkills: matchAnalysis.matchedSkills || [],
          missingSkills: matchAnalysis.missingSkills || [],
          recommendation: matchAnalysis.recommendation || 'Recommended'
        },
        appliedAt: new Date()
      };

      mockDb.applications.push(newApp);
      jobDetails.applicantsCount += 1;

      return res.status(201).json({
        message: 'Successfully applied to job (Mock DB)',
        application: newApp,
        eligible: true
      });
    } else {
      const newApp = new Application({
        jobId: new mongoose.Types.ObjectId(jobId),
        studentId: new mongoose.Types.ObjectId(studentId),
        status: 'Applied',
        resumeUrl: studentProfile.profile.resumeUrl || 'https://res.cloudinary.com/demo/image/upload/sample_resume.pdf',
        matchScore: matchAnalysis.matchScore || 50,
        matchDetails: {
          matchedSkills: matchAnalysis.matchedSkills || [],
          missingSkills: matchAnalysis.missingSkills || [],
          recommendation: matchAnalysis.recommendation || 'Recommended'
        }
      });

      await newApp.save();
      jobDetails.applicantsCount += 1;
      await jobDetails.save();

      return res.status(201).json({
        message: 'Successfully applied to job',
        application: newApp,
        eligible: true
      });
    }
  } catch (error: any) {
    logger.error(`Apply job failed: ${error?.message || error}`);
    return res.status(500).json({ message: 'Server job application error' });
  }
}

// 4. Get Applications for Recruiter Jobs
export async function getRecruiterApplications(req: AuthenticatedRequest, res: Response) {
  const recruiterId = req.user?.id;

  try {
    if (isMockDb) {
      const recruiterJobs = mockDb.jobs.filter(j => j.postedBy === recruiterId).map(j => j._id);
      const apps = mockDb.applications.filter(a => recruiterJobs.includes(a.jobId));
      
      const enrichedApps = apps.map(app => {
        const student = mockDb.users.find(u => u._id === app.studentId);
        const job = mockDb.jobs.find(j => j._id === app.jobId);
        return {
          ...app,
          student: student ? { id: student._id, name: student.name, email: student.email, profile: student.profile } : null,
          job: job ? { id: job._id, title: job.title, company: job.company } : null
        };
      });

      return res.json({ applications: enrichedApps });
    } else {
      const jobs = await Job.find({ postedBy: recruiterId });
      const jobIds = jobs.map(j => j._id);
      const apps = await Application.find({ jobId: { $in: jobIds } })
        .populate('studentId', 'name email profile')
        .populate('jobId', 'title company');

      return res.json({ applications: apps });
    }
  } catch (error: any) {
    logger.error(`Get recruiter applications failed: ${error?.message || error}`);
    return res.status(500).json({ message: 'Server fetch applications error' });
  }
}

// 5. Update Application Status (Recruiter Only)
export async function updateApplicationStatus(req: AuthenticatedRequest, res: Response) {
  const { appId } = req.params;
  const { status } = req.body; // 'Applied' | 'Shortlisted' | 'Rejected' | 'Selected'

  if (!status) return res.status(400).json({ message: 'Status is required.' });

  try {
    if (isMockDb) {
      const appIndex = mockDb.applications.findIndex(a => a._id === appId);
      if (appIndex === -1) return res.status(404).json({ message: 'Application not found.' });

      mockDb.applications[appIndex].status = status;
      return res.json({ message: `Application status updated to ${status} (Mock DB)`, application: mockDb.applications[appIndex] });
    } else {
      const app = await Application.findById(appId);
      if (!app) return res.status(404).json({ message: 'Application not found.' });

      app.status = status;
      await app.save();
      return res.json({ message: `Application status updated to ${status}`, application: app });
    }
  } catch (error: any) {
    logger.error(`Update status failed: ${error?.message || error}`);
    return res.status(500).json({ message: 'Server status update error' });
  }
}

// 6. Get Student Applications
export async function getStudentApplications(req: AuthenticatedRequest, res: Response) {
  const studentId = req.user?.id;

  try {
    if (isMockDb) {
      const apps = mockDb.applications.filter(a => a.studentId === studentId);
      const enrichedApps = apps.map(app => {
        const job = mockDb.jobs.find(j => j._id === app.jobId);
        return {
          ...app,
          job: job ? { id: job._id, title: job.title, company: job.company, salary: job.salary, location: job.location } : null
        };
      });
      return res.json({ applications: enrichedApps });
    } else {
      const apps = await Application.find({ studentId })
        .populate('jobId', 'title company salary location');
      return res.json({ applications: apps });
    }
  } catch (error: any) {
    logger.error(`Get student applications failed: ${error?.message || error}`);
    return res.status(500).json({ message: 'Server fetch student applications error' });
  }
}
