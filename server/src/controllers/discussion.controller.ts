import { Response } from 'express';
import mongoose from 'mongoose';
import { isMockDb } from '../config/dbConnect';
import { mockDb } from '../db/mockDb';
import Discussion from '../models/Discussion';
import Review from '../models/Review';
import Interview from '../models/Interview';
import User from '../models/User';
import Job from '../models/Job';
import { AuthenticatedRequest } from '../middleware/auth';
import { sendEmail } from '../services/email.service';
import logger from '../utils/logger';

// ==========================================
// 1. DISCUSSION FORUM CONTROLLER
// ==========================================

export async function createThread(req: AuthenticatedRequest, res: Response) {
  const { title, content, category } = req.body;
  if (!title || !content || !category) {
    return res.status(400).json({ message: 'Title, content, and category are required.' });
  }

  try {
    const authorId = req.user?.id || 'usr_stud_1';
    const authorName = req.user?.name || 'Anonymous';
    const authorRole = req.user?.role || 'Student';

    if (isMockDb) {
      const newThread = {
        _id: `disc_${Date.now()}`,
        title,
        content,
        authorId,
        authorName,
        authorRole,
        category: category as any,
        replies: [],
        createdAt: new Date()
      };
      mockDb.discussions.push(newThread);
      return res.status(201).json({ message: 'Discussion thread created successfully (Mock DB)', thread: newThread });
    } else {
      const thread = new Discussion({
        title,
        content,
        authorId: new mongoose.Types.ObjectId(authorId),
        authorName,
        authorRole,
        category,
        replies: []
      });
      await thread.save();
      return res.status(201).json({ message: 'Discussion thread created successfully', thread });
    }
  } catch (error: any) {
    logger.error(`Create thread failed: ${error?.message || error}`);
    return res.status(500).json({ message: 'Server discussion thread creation error' });
  }
}

export async function getAllThreads(req: AuthenticatedRequest, res: Response) {
  try {
    if (isMockDb) {
      return res.json({ discussions: mockDb.discussions });
    } else {
      const threads = await Discussion.find().sort({ createdAt: -1 });
      return res.json({ discussions: threads });
    }
  } catch (error: any) {
    logger.error(`Fetch threads failed: ${error?.message || error}`);
    return res.status(500).json({ message: 'Server fetch discussions error' });
  }
}

export async function addReply(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const { content } = req.body;

  if (!content) return res.status(400).json({ message: 'Reply content is required.' });

  try {
    const authorId = req.user?.id || 'usr_stud_1';
    const authorName = req.user?.name || 'Anonymous';
    const authorRole = req.user?.role || 'Student';

    if (isMockDb) {
      const threadIndex = mockDb.discussions.findIndex(d => d._id === id);
      if (threadIndex === -1) return res.status(404).json({ message: 'Thread not found' });

      const reply = {
        _id: `reply_${Date.now()}`,
        authorId,
        authorName,
        authorRole,
        content,
        createdAt: new Date()
      };
      mockDb.discussions[threadIndex].replies.push(reply);
      return res.status(201).json({ message: 'Reply added successfully (Mock DB)', reply, thread: mockDb.discussions[threadIndex] });
    } else {
      const thread = await Discussion.findById(id);
      if (!thread) return res.status(404).json({ message: 'Thread not found' });

      const reply = {
        authorId: new mongoose.Types.ObjectId(authorId),
        authorName,
        authorRole,
        content,
        createdAt: new Date()
      };

      thread.replies.push(reply);
      await thread.save();
      return res.status(201).json({ message: 'Reply added successfully', thread });
    }
  } catch (error: any) {
    logger.error(`Add reply failed: ${error?.message || error}`);
    return res.status(500).json({ message: 'Server discussion reply error' });
  }
}

// ==========================================
// 2. COMPANY REVIEWS (GLASSDOOR) CONTROLLER
// ==========================================

export async function createReview(req: AuthenticatedRequest, res: Response) {
  const { company, rating, salary, difficulty, title, content, interviewProcess, tips } = req.body;

  if (!company || !rating || !salary || !difficulty || !title || !content || !interviewProcess || !tips) {
    return res.status(400).json({ message: 'All review fields are required.' });
  }

  try {
    const studentId = req.user?.id || 'usr_stud_1';

    if (isMockDb) {
      const newReview = {
        _id: `rev_${Date.now()}`,
        company,
        studentId,
        rating: Number(rating),
        salary: Number(salary),
        difficulty: Number(difficulty),
        title,
        content,
        interviewProcess,
        tips,
        createdAt: new Date()
      };
      mockDb.reviews.push(newReview);
      return res.status(201).json({ message: 'Company review submitted successfully (Mock DB)', review: newReview });
    } else {
      const review = new Review({
        company,
        studentId: new mongoose.Types.ObjectId(studentId),
        rating: Number(rating),
        salary: Number(salary),
        difficulty: Number(difficulty),
        title,
        content,
        interviewProcess,
        tips
      });
      await review.save();
      return res.status(201).json({ message: 'Company review submitted successfully', review });
    }
  } catch (error: any) {
    logger.error(`Create review failed: ${error?.message || error}`);
    return res.status(500).json({ message: 'Server review submission error' });
  }
}

export async function getAllReviews(req: AuthenticatedRequest, res: Response) {
  try {
    if (isMockDb) {
      return res.json({ reviews: mockDb.reviews });
    } else {
      const reviews = await Review.find().populate('studentId', 'name').sort({ createdAt: -1 });
      return res.json({ reviews });
    }
  } catch (error: any) {
    logger.error(`Fetch reviews failed: ${error?.message || error}`);
    return res.status(500).json({ message: 'Server fetch reviews error' });
  }
}

// ==========================================
// 3. INTERVIEW SCHEDULER CONTROLLER
// ==========================================

export async function scheduleInterview(req: AuthenticatedRequest, res: Response) {
  const { jobId, studentId, date, time } = req.body;

  if (!jobId || !studentId || !date || !time) {
    return res.status(400).json({ message: 'Job ID, student ID, date, and time are required.' });
  }

  try {
    const meetLink = `https://meet.google.com/abc-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 3)}`;

    let studentEmail = '';
    let studentName = '';
    let jobTitle = '';
    let companyName = '';

    if (isMockDb) {
      const student = mockDb.users.find(u => u._id === studentId);
      const job = mockDb.jobs.find(j => j._id === jobId);
      if (student) {
        studentEmail = student.email;
        studentName = student.name;
      }
      if (job) {
        jobTitle = job.title;
        companyName = job.company;
      }

      const newInterview = {
        _id: `int_${Date.now()}`,
        jobId,
        studentId,
        date,
        time,
        status: 'Scheduled' as const,
        meetLink,
        createdAt: new Date()
      };
      mockDb.interviews.push(newInterview);
    } else {
      const student = await User.findById(studentId);
      const job = await Job.findById(jobId);
      if (student) {
        studentEmail = student.email;
        studentName = student.name;
      }
      if (job) {
        jobTitle = job.title;
        companyName = job.company;
      }

      const interview = new Interview({
        jobId: new mongoose.Types.ObjectId(jobId),
        studentId: new mongoose.Types.ObjectId(studentId),
        date,
        time,
        meetLink,
        status: 'Scheduled'
      });
      await interview.save();
    }

    // Send Email notification automatically
    if (studentEmail) {
      logger.info(`Sending interview schedule email to ${studentEmail}...`);
      await sendEmail({
        to: studentEmail,
        subject: `Interview Scheduled for ${jobTitle} at ${companyName}`,
        text: `Hello ${studentName},\n\nYour interview for ${jobTitle} at ${companyName} has been scheduled.\n\nDate: ${date}\nTime: ${time}\nGoogle Meet Link: ${meetLink}\n\nGood luck!\nBest regards,\nPlacement Cell`,
        html: `<p>Hello <strong>${studentName}</strong>,</p>
               <p>Your interview for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been scheduled.</p>
               <p>📅 <strong>Date:</strong> ${date}<br>
                  ⏰ <strong>Time:</strong> ${time}<br>
                  🔗 <strong>Meet Link:</strong> <a href="${meetLink}">${meetLink}</a></p>
               <p>Good luck!</p>
               <p>Best regards,<br>Placement Cell</p>`
      });
    }

    return res.status(201).json({
      message: 'Interview scheduled successfully',
      meetLink
    });
  } catch (error: any) {
    logger.error(`Schedule interview failed: ${error?.message || error}`);
    return res.status(500).json({ message: 'Server schedule interview error' });
  }
}

export async function getInterviews(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.id;
  const role = req.user?.role;

  try {
    if (isMockDb) {
      let filtered = [];
      if (role === 'Student') {
        filtered = mockDb.interviews.filter(i => i.studentId === userId);
      } else if (role === 'Recruiter') {
        const recruiterJobs = mockDb.jobs.filter(j => j.postedBy === userId).map(j => j._id);
        filtered = mockDb.interviews.filter(i => recruiterJobs.includes(i.jobId));
      } else {
        filtered = mockDb.interviews; // Placement officer / Admin sees all
      }

      const enriched = filtered.map(i => {
        const student = mockDb.users.find(u => u._id === i.studentId);
        const job = mockDb.jobs.find(j => j._id === i.jobId);
        return {
          ...i,
          studentName: student?.name || 'Student',
          studentEmail: student?.email || '',
          jobTitle: job?.title || 'Job',
          company: job?.company || 'Company'
        };
      });

      return res.json({ interviews: enriched });
    } else {
      let query = {};
      if (role === 'Student') {
        query = { studentId: userId };
      } else if (role === 'Recruiter') {
        const jobs = await Job.find({ postedBy: userId });
        const jobIds = jobs.map(j => j._id);
        query = { jobId: { $in: jobIds } };
      }

      const list = await Interview.find(query)
        .populate('studentId', 'name email')
        .populate('jobId', 'title company');

      const formatted = list.map((i: any) => ({
        _id: i._id.toString(),
        jobId: i.jobId?._id?.toString(),
        studentId: i.studentId?._id?.toString(),
        studentName: i.studentId?.name || 'Student',
        studentEmail: i.studentId?.email || '',
        jobTitle: i.jobId?.title || 'Job',
        company: i.jobId?.company || 'Company',
        date: i.date,
        time: i.time,
        meetLink: i.meetLink,
        status: i.status,
        score: i.score
      }));

      return res.json({ interviews: formatted });
    }
  } catch (error: any) {
    logger.error(`Get interviews failed: ${error?.message || error}`);
    return res.status(500).json({ message: 'Server fetch interviews error' });
  }
}
