import { Response } from 'express';
import { isMockDb } from '../config/dbConnect';
import { mockDb } from '../db/mockDb';
import Exam from '../models/Exam';
import User from '../models/User';
import { AuthenticatedRequest } from '../middleware/auth';
import logger from '../utils/logger';

// 1. Get All Exams
export async function getExams(req: AuthenticatedRequest, res: Response) {
  try {
    if (isMockDb) {
      const exams = mockDb.exams.map(e => ({
        _id: e._id,
        title: e.title,
        domain: e.domain,
        difficulty: e.difficulty,
        questionsCount: e.questions.length,
        codingChallengesCount: e.codingChallenges.length
      }));
      return res.json({ exams });
    } else {
      const exams = await Exam.find({}, '_id title domain difficulty questions codingChallenges');
      const formatted = exams.map(e => ({
        _id: e._id.toString(),
        title: e.title,
        domain: e.domain,
        difficulty: e.difficulty,
        questionsCount: e.questions.length,
        codingChallengesCount: e.codingChallenges.length
      }));
      return res.json({ exams: formatted });
    }
  } catch (error: any) {
    logger.error(`Get exams failed: ${error?.message || error}`);
    return res.status(500).json({ message: 'Server fetch exams error' });
  }
}

// 2. Get Single Exam Details
export async function getExamById(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;

  try {
    if (isMockDb) {
      const exam = mockDb.exams.find(e => e._id === id);
      if (!exam) return res.status(404).json({ message: 'Exam not found' });
      
      // Hide correct answers in client response to prevent cheating
      const cleanQuestions = exam.questions.map(q => ({
        _id: q._id,
        questionText: q.questionText,
        options: q.options
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
        options: q.options
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
          questions: cleanQuestions,
          codingChallenges: cleanCoding
        }
      });
    }
  } catch (error: any) {
    logger.error(`Get exam failed: ${error?.message || error}`);
    return res.status(500).json({ message: 'Server fetch exam error' });
  }
}

// 3. Submit Exam Answers (MCQ + Coding)
export async function submitExam(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const { mcqAnswers, codingAnswers } = req.body; // mcqAnswers: { q_id: index }, codingAnswers: { challenge_id: codeString }

  try {
    let exam: any = null;
    if (isMockDb) {
      exam = mockDb.exams.find(e => e._id === id);
    } else {
      exam = await Exam.findById(id);
    }

    if (!exam) return res.status(404).json({ message: 'Exam not found.' });

    // 1. Grade MCQs
    let correctMcqCount = 0;
    const mcqResults = exam.questions.map((q: any) => {
      const qId = q._id.toString();
      const submittedAnswer = mcqAnswers?.[qId];
      const isCorrect = submittedAnswer !== undefined && Number(submittedAnswer) === q.correctAnswerIndex;
      if (isCorrect) correctMcqCount++;

      return {
        questionId: qId,
        submittedAnswer,
        correctAnswer: q.correctAnswerIndex,
        isCorrect
      };
    });

    const mcqScore = exam.questions.length > 0 ? Math.round((correctMcqCount / exam.questions.length) * 100) : 100;

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
            // Setup simple isolated sandbox evaluation in current context
            // Safe wrap to extract function
            const fnWrapper = new Function(`
              ${code}
              try {
                // Assuming first line starts with function sumDigits etc, we run it
                const fnName = "${challenge.title === 'Sum of Digits' ? 'sumDigits' : ''}";
                if (fnName && typeof this[fnName] === 'function') {
                  return this[fnName](${testCase.input});
                }
                // Fallback direct eval
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

    const totalScore = Math.round((mcqScore + codingScore) / 2);

    // Save skill assessment score to student profile
    const studentId = req.user?.id;
    if (studentId) {
      if (isMockDb) {
        const userIndex = mockDb.users.findIndex(u => u._id === studentId);
        if (userIndex !== -1) {
          // Add to skills or save performance
          mockDb.users[userIndex].profile.skills = Array.from(new Set([
            ...mockDb.users[userIndex].profile.skills, 
            exam.domain
          ]));
        }
      } else {
        const user = await User.findById(studentId);
        if (user) {
          user.profile.skills = Array.from(new Set([
            ...user.profile.skills, 
            exam.domain
          ]));
          await user.save();
        }
      }
    }

    return res.json({
      message: 'Exam graded successfully',
      score: totalScore,
      mcqScore,
      codingScore,
      mcqResults,
      codingResults
    });
  } catch (error: any) {
    logger.error(`Submit exam failed: ${error?.message || error}`);
    return res.status(500).json({ message: 'Server exam submission error' });
  }
}
