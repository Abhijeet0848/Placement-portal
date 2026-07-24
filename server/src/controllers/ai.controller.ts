import { Response } from 'express';
import { analyzeResume, getCareerSuggestions, generateCoverLetter, evaluateInterviewAnswer, matchResumeToJob, parseExamQuestionsFromText } from '../services/ai.service';
import { parseResumePDF } from '../services/parser.service';
import { AuthenticatedRequest } from '../middleware/auth';
import { isMockDb } from '../config/dbConnect';
import { mockDb } from '../db/mockDb';
import User from '../models/User';
import logger from '../utils/logger';

// 1. Analyze Uploaded PDF Resume
export async function analyzeResumeUpload(req: AuthenticatedRequest, res: Response) {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded. Please upload a PDF resume.' });
  }

  try {
    logger.info(`Parsing PDF buffer of size ${req.file.size} bytes...`);
    const parsed = await parseResumePDF(req.file.buffer);
    
    // Analyze full extracted text using Gemini / Local Multi-factor NLP Engine
    const resumeText = (parsed.fullText && parsed.fullText.trim().length > 20)
      ? parsed.fullText
      : `Name: ${parsed.name}. Email: ${parsed.email}. Phone: ${parsed.phone}. Skills: ${parsed.skills.join(', ')}.`;
    const analysis = await analyzeResume(resumeText);

    // Save parsing/scores to student's profile if authenticated
    if (req.user) {
      if (isMockDb) {
        const userIndex = mockDb.users.findIndex(u => u._id === req.user?.id);
        if (userIndex !== -1) {
          mockDb.users[userIndex].profile.skills = Array.from(new Set([...mockDb.users[userIndex].profile.skills, ...parsed.skills]));
          mockDb.users[userIndex].profile.resumeScore = analysis.score;
          mockDb.users[userIndex].profile.resumeAnalysis = analysis;
          if (parsed.phone) mockDb.users[userIndex].profile.phone = parsed.phone;
        }
      } else {
        const user = await User.findById(req.user.id);
        if (user) {
          user.profile.skills = Array.from(new Set([...user.profile.skills, ...parsed.skills]));
          user.profile.resumeScore = analysis.score;
          user.profile.resumeAnalysis = analysis;
          if (parsed.phone) user.profile.phone = parsed.phone;
          await user.save();
        }
      }
    }

    return res.json({
      message: 'Resume parsed and analyzed successfully',
      parsed,
      analysis
    });
  } catch (error: any) {
    logger.error(`Resume analysis upload failed: ${error?.message || error}`);
    return res.status(500).json({ message: error?.message || 'Server resume parsing error' });
  }
}

// 2. Mock Interview Round evaluation
export async function evaluateInterview(req: AuthenticatedRequest, res: Response) {
  const { questionText, studentAnswer } = req.body;

  if (!questionText || !studentAnswer) {
    return res.status(400).json({ message: 'Question text and student answer are required.' });
  }

  try {
    const feedback = await evaluateInterviewAnswer(questionText, studentAnswer);
    return res.json({ feedback });
  } catch (error: any) {
    logger.error(`Evaluate interview failed: ${error?.message || error}`);
    return res.status(500).json({ message: error?.message || 'Server interview evaluation error' });
  }
}

// 3. Career Recommendations
export async function getCareerRoadmap(req: AuthenticatedRequest, res: Response) {
  const { skills, cgpa, interests } = req.body;

  if (!skills || !interests) {
    return res.status(400).json({ message: 'Skills and interests parameters are required.' });
  }

  try {
    const recommendations = await getCareerSuggestions(skills, Number(cgpa) || 7.0, interests);
    return res.json({ recommendations });
  } catch (error: any) {
    logger.error(`Career roadmap failed: ${error?.message || error}`);
    return res.status(500).json({ message: error?.message || 'Server career recommendations error' });
  }
}

// 4. Cover Letter Generation
export async function createCoverLetter(req: AuthenticatedRequest, res: Response) {
  const { skills, jobTitle, company } = req.body;

  if (!skills || !jobTitle || !company) {
    return res.status(400).json({ message: 'Skills, job title, and company details are required.' });
  }

  try {
    const studentName = req.user?.name || 'Applicant';
    const coverLetter = await generateCoverLetter(studentName, skills, jobTitle, company);
    return res.json({ coverLetter });
  } catch (error: any) {
    logger.error(`Cover letter failed: ${error?.message || error}`);
    return res.status(500).json({ message: error?.message || 'Server cover letter generation error' });
  }
}

// 5. Resume to Job Matching
export async function matchJob(req: AuthenticatedRequest, res: Response) {
  const { resumeText, jobDetails } = req.body;

  if (!resumeText || !jobDetails) {
    return res.status(400).json({ message: 'Resume text and job details are required.' });
  }

  try {
    const result = await matchResumeToJob(resumeText, jobDetails);
    return res.json(result);
  } catch (error: any) {
    logger.error(`Job matching failed: ${error?.message || error}`);
    return res.status(500).json({ message: error?.message || 'Server job matching error' });
  }
}

// 6. Parse Exam PDF Upload
export async function parseExamUpload(req: AuthenticatedRequest, res: Response) {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded. Please upload a PDF file containing exam questions.' });
  }

  try {
    logger.info(`Parsing Exam PDF buffer of size ${req.file.size} bytes...`);
    const parsed = await parseResumePDF(req.file.buffer);
    
    if (!parsed.fullText || parsed.fullText.trim().length < 20) {
       return res.status(400).json({ message: 'Could not extract enough text from the PDF. Please ensure it is a text-based PDF.' });
    }

    const questions = await parseExamQuestionsFromText(parsed.fullText);

    return res.json({
      message: 'Exam parsed successfully',
      questions
    });
  } catch (error: any) {
    logger.error(`Exam parsing upload failed: ${error?.message || error}`);
    return res.status(500).json({ message: error?.message || 'Server exam parsing error' });
  }
}
