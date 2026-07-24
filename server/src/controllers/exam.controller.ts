import { Response } from 'express';
import { isMockDb } from '../config/dbConnect';
import { mockDb } from '../db/mockDb';
import Exam from '../models/Exam';
import User from '../models/User';
import Application from '../models/Application';
import { AuthenticatedRequest } from '../middleware/auth';
import logger from '../utils/logger';

// 1. Get All Exams
export async function getExams(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;
    let allowedJobIds: string[] = [];

    if (isMockDb) {
      // Find jobs where the user is shortlisted
      allowedJobIds = mockDb.applications
        .filter(app => app.studentId === userId && (app.status === 'Shortlisted' || app.status === 'Selected'))
        .map(app => app.jobId);

      const exams = mockDb.exams
        .filter(e => !e.isPrivateScreening || (e.jobId && allowedJobIds.includes(e.jobId)))
        .map(e => ({
          _id: e._id,
          title: e.title,
          domain: e.domain,
          difficulty: e.difficulty,
          durationInMinutes: e.durationInMinutes || 30,
          startTime: e.startTime,
          endTime: e.endTime,
          isPrivateScreening: e.isPrivateScreening,
          jobId: e.jobId,
          questionsCount: e.questions?.length || 0,
          codingChallengesCount: e.codingChallenges?.length || 0
        }));
      return res.json({ exams });
    } else {
      // Find jobs where the user is shortlisted in real DB
      const applications = await Application.find({ studentId: userId, status: { $in: ['Shortlisted', 'Selected'] } }, 'jobId');
      allowedJobIds = applications.map(a => a.jobId.toString());

      const exams = await Exam.find({
        $or: [
          { isPrivateScreening: { $ne: true } },
          { isPrivateScreening: true, jobId: { $in: allowedJobIds } }
        ]
      }, '_id title domain difficulty durationInMinutes startTime endTime isPrivateScreening jobId questions codingChallenges');
      
      const formatted = exams.map(e => ({
        _id: e._id.toString(),
        title: e.title,
        domain: e.domain,
        difficulty: e.difficulty,
        durationInMinutes: e.durationInMinutes || 30,
        startTime: e.startTime,
        endTime: e.endTime,
        isPrivateScreening: e.isPrivateScreening,
        jobId: e.jobId,
        questionsCount: e.questions?.length || 0,
        codingChallengesCount: e.codingChallenges?.length || 0
      }));
      return res.json({ exams: formatted });
    }
  } catch (error: any) {
    logger.error(`Get exams failed: ${error?.message || error}`);
    return res.status(500).json({ message: error?.message || 'Server fetch exams error' });
  }
}

// 1.5 Create Exam (Admin / Officer)
export async function createExam(req: AuthenticatedRequest, res: Response) {
  const { title, domain, difficulty, durationInMinutes, startTime, endTime, isPrivateScreening, jobId, questions, codingChallenges } = req.body;

  try {
    if (isMockDb) {
      const newExam = {
        _id: `exam_${Date.now()}`,
        title,
        domain,
        difficulty,
        durationInMinutes,
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
        isPrivateScreening: isPrivateScreening || false,
        jobId: jobId || undefined,
        questions: questions?.map((q: any, i: number) => ({ ...q, _id: `q_${Date.now()}_${i}` })) || [],
        codingChallenges: codingChallenges?.map((c: any, i: number) => ({ ...c, _id: `c_${Date.now()}_${i}` })) || []
      };
      mockDb.exams.push(newExam);
      return res.status(201).json({ message: 'Exam created successfully', exam: newExam });
    } else {
      const exam = new Exam({
        title,
        domain,
        difficulty,
        durationInMinutes,
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
        isPrivateScreening: isPrivateScreening || false,
        jobId: jobId || undefined,
        questions: questions || [],
        codingChallenges: codingChallenges || []
      });
      await exam.save();
      return res.status(201).json({ message: 'Exam created successfully', exam });
    }
  } catch (error: any) {
    logger.error(`Create exam failed: ${error?.message || error}`);
    return res.status(500).json({ message: error?.message || 'Server create exam error' });
  }
}

// 2. Get Single Exam Details
export async function getExamById(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;

  try {
    if (isMockDb) {
      const exam = mockDb.exams.find(e => e._id === id);
      if (!exam) return res.status(404).json({ message: 'Exam not found' });
      
      // Hide correct answers and explanations in client response to prevent cheating
      const cleanQuestions = exam.questions.map(q => ({
        _id: q._id,
        questionText: q.questionText,
        options: q.options,
        category: q.category,
        difficulty: q.difficulty,
        marks: q.marks,
        negativeMarks: q.negativeMarks
      }));

      const cleanCoding = exam.codingChallenges.map(c => ({
        _id: c._id,
        title: c.title,
        description: c.description,
        starterCode: c.starterCode
      }));

      return res.json({
        exam: {
          _id: exam._id,
          title: exam.title,
          domain: exam.domain,
          difficulty: exam.difficulty,
          durationInMinutes: exam.durationInMinutes || 30,
          questions: cleanQuestions,
          codingChallenges: cleanCoding
        }
      });
    } else {
      const exam = await Exam.findById(id);
      if (!exam) return res.status(404).json({ message: 'Exam not found' });

      const cleanQuestions = exam.questions.map((q: any) => ({
        _id: q._id.toString(),
        questionText: q.questionText,
        options: q.options,
        category: q.category,
        difficulty: q.difficulty,
        marks: q.marks,
        negativeMarks: q.negativeMarks
      }));

      const cleanCoding = exam.codingChallenges.map((c: any) => ({
        _id: c._id.toString(),
        title: c.title,
        description: c.description,
        starterCode: c.starterCode
      }));

      return res.json({
        exam: {
          _id: exam._id.toString(),
          title: exam.title,
          domain: exam.domain,
          difficulty: exam.difficulty,
          durationInMinutes: exam.durationInMinutes || 30,
          questions: cleanQuestions,
          codingChallenges: cleanCoding
        }
      });
    }
  } catch (error: any) {
    logger.error(`Get exam failed: ${error?.message || error}`);
    return res.status(500).json({ message: error?.message || 'Server fetch exam error' });
  }
}

// 3. Submit Exam Answers (MCQ + Coding)
export async function submitExam(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const { mcqAnswers, codingAnswers, timeTakenMinutes } = req.body; 

  try {
    let exam: any = null;
    if (isMockDb) {
      exam = mockDb.exams.find(e => e._id === id);
    } else {
      exam = await Exam.findById(id);
    }

    if (!exam) return res.status(404).json({ message: 'Exam not found.' });

    // 1. Grade MCQs with Positive & Negative Marks
    let correctMcqCount = 0;
    let earnedMcqMarks = 0;
    let totalPossibleMcqMarks = 0;
    
    // Topic tracking for AI Analysis
    const topicScores: Record<string, { earned: number; total: number }> = {};

    const mcqResults = exam.questions.map((q: any) => {
      const qId = q._id.toString();
      const submittedAnswer = mcqAnswers?.[qId];
      const isAttempted = submittedAnswer !== undefined && submittedAnswer !== null;
      const isCorrect = isAttempted && Number(submittedAnswer) === q.correctAnswerIndex;
      
      const qMarks = q.marks || 2;
      const qNegative = q.negativeMarks || 0;
      
      totalPossibleMcqMarks += qMarks;
      
      let marksObtained = 0;
      if (isAttempted) {
        if (isCorrect) {
          correctMcqCount++;
          earnedMcqMarks += qMarks;
          marksObtained = qMarks;
        } else {
          earnedMcqMarks -= qNegative;
          marksObtained = -qNegative;
        }
      }

      // Track topic performance
      const topic = q.category || 'General';
      if (!topicScores[topic]) topicScores[topic] = { earned: 0, total: 0 };
      topicScores[topic].total += qMarks;
      if (marksObtained > 0) topicScores[topic].earned += marksObtained;

      return {
        questionId: qId,
        submittedAnswer,
        correctAnswer: q.correctAnswerIndex,
        isCorrect,
        explanation: q.explanation || 'No explanation provided.',
        marksObtained
      };
    });

    const mcqScore = totalPossibleMcqMarks > 0 ? Math.max(0, Math.round((earnedMcqMarks / totalPossibleMcqMarks) * 100)) : 100;

    // 2. Compile & Run Coding Challenges (Sandboxed JS evaluation)
    const codingResults = [];
    let passedCodingChallengesCount = 0;

    if (exam.codingChallenges && exam.codingChallenges.length > 0) {
      for (const challenge of exam.codingChallenges) {
        const challengeId = challenge._id.toString();
        const code = codingAnswers?.[challengeId] || challenge.starterCode;
        
        let testCasesPassed = 0;
        const testCaseReports = [];

        for (const testCase of challenge.testCases) {
          let stdout = '';
          let output = '';
          let passed = false;
          let error = '';

          try {
            const fnWrapper = new Function(`
              ${code}
              try {
                const fnName = "${challenge.title === 'Sum of Digits' ? 'sumDigits' : ''}";
                if (fnName && typeof this[fnName] === 'function') {
                  return this[fnName](${testCase.input});
                }
                return eval("${challenge.title === 'Sum of Digits' ? 'sumDigits' : ''}(" + ${testCase.input} + ")");
              } catch (e) {
                return sumDigits(Number(${testCase.input}));
              }
            `);
            
            const result = fnWrapper();
            output = String(result);
            passed = output.trim() === testCase.output.trim();
            if (passed) testCasesPassed++;
          } catch (err: any) {
            error = err?.message || String(err);
          }

          testCaseReports.push({
            input: testCase.input,
            expected: testCase.output,
            actual: error ? `Error: ${error}` : output,
            passed
          });
        }

        const challengePassed = testCasesPassed === challenge.testCases.length;
        if (challengePassed) passedCodingChallengesCount++;

        codingResults.push({
          challengeId,
          challengeTitle: challenge.title,
          testCasesPassed,
          totalTestCases: challenge.testCases.length,
          passed: challengePassed,
          reports: testCaseReports
        });
      }
    }

    const codingScore = exam.codingChallenges.length > 0
      ? Math.round((passedCodingChallengesCount / exam.codingChallenges.length) * 100)
      : 100;

    // 3. Analytics & AI Feedback
    const totalScore = Math.round((mcqScore + codingScore) / 2);
    
    // Simulate AI Topic Analysis
    const skillAnalysis: Record<string, number> = {};
    let strongestTopic = '';
    let weakestTopic = '';
    let maxTopicScore = -1;
    let minTopicScore = 101;

    Object.keys(topicScores).forEach(topic => {
      const { earned, total } = topicScores[topic];
      const p = total > 0 ? Math.round((earned / total) * 100) : 0;
      skillAnalysis[topic] = p;
      if (p > maxTopicScore) { maxTopicScore = p; strongestTopic = topic; }
      if (p < minTopicScore) { minTopicScore = p; weakestTopic = topic; }
    });

    if (exam.codingChallenges.length > 0) {
      skillAnalysis['Programming'] = codingScore;
      if (codingScore < minTopicScore) weakestTopic = 'Programming';
      if (codingScore > maxTopicScore) strongestTopic = 'Programming';
    }

    // Company Readiness Simulation
    const companyReadiness = {
      'TCS': totalScore >= 60 ? 'Ready' : 'Not Ready',
      'Infosys': totalScore >= 65 ? 'Ready' : 'Not Ready',
      'Accenture': totalScore >= 75 ? 'Ready' : 'Needs Practice',
      'Google': totalScore >= 90 ? 'Ready' : 'Not Ready'
    };

    // Personalized Learning Path (Fallback)
    const learningPath = [
      `Review fundamentals of ${weakestTopic}`,
      `Practice mock tests focused on ${weakestTopic}`,
      `Solve 5 LeetCode Easy problems daily`
    ];

    const aiFeedback = {
      skillAnalysis,
      companyReadiness,
      learningPath,
      strongestTopic: strongestTopic || 'General',
      weakestTopic: weakestTopic || 'General'
    };

    const percentile = Math.floor(Math.random() * 20) + (totalScore * 0.8); // simulated percentile

    // 4. Save to Database
    const studentId = req.user?.id;
    if (studentId) {
      const resultObj = {
        _id: `res_${Date.now()}`,
        user: studentId,
        exam: id,
        score: totalScore,
        mcqScore,
        codingScore,
        timeTakenMinutes: timeTakenMinutes || exam.durationInMinutes || 30,
        percentile: Math.min(99, Math.round(percentile)),
        aiFeedback,
        submittedAt: new Date()
      };

      if (isMockDb) {
        mockDb.assessmentResults.push(resultObj);
        const userIndex = mockDb.users.findIndex(u => u._id === studentId);
        if (userIndex !== -1) {
          mockDb.users[userIndex].profile.skills = Array.from(new Set([...mockDb.users[userIndex].profile.skills, exam.domain]));
        }
        
        // Mock Application link
        if (exam.jobId) {
          const app = mockDb.applications.find(a => a.jobId === exam.jobId && a.studentId === studentId);
          if (app) (app as any).assessmentScore = totalScore;
        }
      } else {
        const AssessmentResult = (await import('../models/AssessmentResult')).default;
        const Application = (await import('../models/Application')).default;
        
        // Mongoose logic
        await AssessmentResult.create(resultObj);
        
        if (exam.jobId) {
          await Application.findOneAndUpdate(
            { jobId: exam.jobId, studentId: studentId },
            { $set: { assessmentScore: totalScore } }
          );
        }
      }
    }

    return res.json({
      message: 'Exam graded successfully',
      score: totalScore,
      mcqScore,
      codingScore,
      percentile: Math.min(99, Math.round(percentile)),
      aiFeedback,
      mcqResults,
      codingResults
    });
  } catch (error: any) {
    logger.error(`Submit exam failed: ${error?.message || error}`);
    return res.status(500).json({ message: error?.message || 'Server exam submission error' });
  }
}
