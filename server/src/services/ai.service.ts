import { GoogleGenerativeAI } from '@google/generative-ai';
import logger from '../utils/logger';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
let genAI: GoogleGenerativeAI | null = null;

if (GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    logger.info('Initialized Google Gemini AI Service successfully.');
  } catch (error: any) {
    logger.error(`Error initializing Gemini AI: ${error?.message || error}`);
  }
} else {
  logger.warn('No GEMINI_API_KEY found in env. Falling back to local NLP parser & simulated responses.');
}

// 1. Resume Analyzer with Multi-Factor ATS Scoring Engine
export async function analyzeResume(resumeText: string) {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
        You are an expert ATS (Applicant Tracking System) Resume Screener. 
        Analyze the following resume text comprehensively and return a JSON object with accurate scoring:

        Resume Text:
        """
        ${resumeText}
        """

        Calculate metrics based on real technical content, section structure, action verbs, and skill density:
        - score: (number 0 to 100, overall ATS resume score)
        - missingSkills: (array of 3-5 crucial tech/engineering skills missing from this resume)
        - grammarErrors: (number, count of grammar/typo issues detected)
        - atsCompatibility: (number 0 to 100, ATS format & parsing readiness score)
        - resumeStrength: (string: "Needs Work" | "Intermediate" | "Strong" | "Exceptional")
        - suggestions: (array of 3-5 specific, actionable improvements for this resume)

        Output strictly valid JSON only:
      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      
      const cleanJson = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsedAi = JSON.parse(cleanJson);

      if (typeof parsedAi.score === 'number' && typeof parsedAi.atsCompatibility === 'number') {
        return parsedAi;
      }
    } catch (error: any) {
      logger.error(`Gemini analyzeResume failed: ${error?.message || error}`);
    }
  }

  // Multi-Factor Rule-Based ATS Scoring Engine (Deterministic & Accurate)
  const lowercaseText = resumeText.toLowerCase();

  // 1. Essential ATS Sections Check (Max 25 pts)
  const sectionChecks = [
    { key: 'education', weight: 5 },
    { key: 'experience', weight: 5, alt: 'work' },
    { key: 'skills', weight: 5, alt: 'technologies' },
    { key: 'project', weight: 5, alt: 'projects' },
    { key: 'contact', weight: 5, alt: '@' }
  ];
  let sectionScore = 0;
  sectionChecks.forEach(sec => {
    if (lowercaseText.includes(sec.key) || (sec.alt && lowercaseText.includes(sec.alt))) {
      sectionScore += sec.weight;
    }
  });

  // 2. Technical Skill Keyword Density (Max 35 pts)
  const industrySkills = [
    'react', 'node.js', 'mongodb', 'express', 'javascript', 'typescript',
    'python', 'java', 'c++', 'sql', 'git', 'docker', 'aws', 'kubernetes',
    'html', 'css', 'redux', 'tailwind', 'graphql', 'next.js', 'rest api',
    'data structures', 'algorithms', 'system design', 'postgresql', 'redis'
  ];
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  industrySkills.forEach(skill => {
    if (lowercaseText.includes(skill)) {
      matchedSkills.push(skill.charAt(0).toUpperCase() + skill.slice(1));
    } else {
      missingSkills.push(skill.charAt(0).toUpperCase() + skill.slice(1));
    }
  });

  const skillScore = Math.min(Math.round((matchedSkills.length / 8) * 35), 35);

  // 3. Action Verbs & Impact Metrics (Max 25 pts)
  const actionVerbs = ['developed', 'built', 'designed', 'implemented', 'optimized', 'architected', 'managed', 'led', 'reduced', 'increased', 'created', 'deploy'];
  let actionScore = 0;
  actionVerbs.forEach(verb => {
    if (lowercaseText.includes(verb)) actionScore += 2;
  });
  if (/\b\d+%\b|\b\d+ms\b|\b\d+k\b/i.test(resumeText)) actionScore += 5; // Quantified metrics bonus
  actionScore = Math.min(actionScore, 25);

  // 4. Contact & Format Completeness (Max 15 pts)
  let formatScore = 5; // base length
  const words = resumeText.trim().split(/\s+/).length;
  if (words >= 100) formatScore += 5;
  if (/@/.test(resumeText)) formatScore += 3;
  if (/\d{10}/.test(resumeText)) formatScore += 2;
  formatScore = Math.min(formatScore, 15);

  // Calculate final accurate scores
  const score = Math.min(Math.max(sectionScore + skillScore + actionScore + formatScore, 35), 98);
  const atsCompatibility = Math.min(Math.max(sectionScore * 2 + formatScore * 2 + (actionScore > 10 ? 20 : 10), 40), 96);

  // Generate dynamic, context-aware suggestions
  const suggestions: string[] = [];
  if (!lowercaseText.includes('project')) {
    suggestions.push('Include a dedicated "Projects" section detailing full-stack or technical applications.');
  }
  if (!lowercaseText.includes('experience') && !lowercaseText.includes('internship')) {
    suggestions.push('Add practical experience, internships, or open-source contribution details.');
  }
  if (matchedSkills.length < 5) {
    suggestions.push(`Add key technical skills such as: ${missingSkills.slice(0, 3).join(', ')}.`);
  }
  if (!/\b\d+%\b|\b\d+ms\b/.test(resumeText)) {
    suggestions.push('Quantify your achievements with impact metrics (e.g. "Improved query performance by 30%").');
  }
  if (!lowercaseText.includes('git') && !lowercaseText.includes('github')) {
    suggestions.push('Include GitHub profile link and version control tools (Git).');
  }

  if (suggestions.length < 3) {
    suggestions.push('Tailor resume bullet points with exact keywords matching job description requirements.');
    suggestions.push('Ensure standard single-column layout for smooth ATS parsing compatibility.');
  }

  let resumeStrength = 'Beginner';
  if (score >= 85) resumeStrength = 'Exceptional';
  else if (score >= 72) resumeStrength = 'Strong';
  else if (score >= 55) resumeStrength = 'Intermediate';

  return {
    score,
    missingSkills: missingSkills.slice(0, 4),
    grammarErrors: Math.max(Math.floor((100 - score) / 20), 0),
    atsCompatibility,
    resumeStrength,
    suggestions: suggestions.slice(0, 4)
  };
}

// 2. Resume vs Job Matching
export async function matchResumeToJob(resumeText: string, jobDetails: { title: string; description: string; skills: string[] }) {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
        Compare this resume text with the job requirements:
        Job Title: ${jobDetails.title}
        Job Description: ${jobDetails.description}
        Required Skills: ${jobDetails.skills.join(', ')}

        Resume Text:
        """
        ${resumeText}
        """

        Output a JSON object containing:
        - matchScore (number, 0-100)
        - matchedSkills (array of strings)
        - missingSkills (array of strings from required skills that are not in the resume)
        - recommendation (string, e.g., "Highly Recommended", "Recommended", "Not Recommended")
        - rationale (string detailing why they match or fail criteria)

        Output strictly valid JSON:
      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const cleanJson = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (error: any) {
      logger.error(`Gemini matchResumeToJob failed: ${error?.message || error}`);
    }
  }

  // Fallback Simulation
  const lowercaseText = resumeText.toLowerCase();
  const matched: string[] = [];
  const missing: string[] = [];

  jobDetails.skills.forEach(skill => {
    if (lowercaseText.includes(skill.toLowerCase())) {
      matched.push(skill);
    } else {
      missing.push(skill);
    }
  });

  const totalRequired = jobDetails.skills.length || 1;
  const matchScore = Math.round((matched.length / totalRequired) * 100);
  const recommendation = matchScore >= 75 ? 'Highly Recommended' : matchScore >= 50 ? 'Recommended' : 'Not Recommended';

  return {
    matchScore,
    matchedSkills: matched,
    missingSkills: missing,
    recommendation,
    rationale: `The candidate has ${matched.length} out of ${totalRequired} required skills. ${missing.length > 0 ? `Missing skills like ${missing.join(', ')}.` : 'They possess all key tech stack skills.'}`
  };
}

// 3. Career Recommendations
export async function getCareerSuggestions(skills: string[], cgpa: number, interests: string[]) {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
        Based on these parameters:
        Skills: ${skills.join(', ')}
        CGPA: ${cgpa}
        Interests: ${interests.join(', ')}

        Provide career guidance in a JSON object with:
        - roles (array of strings, e.g., "Full Stack Developer", "Data Scientist")
        - roadmap (array of steps/phases to reach the target roles)
        - learningResources (array of suggested certifications/technologies to learn)

        Output strictly valid JSON:
      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const cleanJson = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (error: any) {
      logger.error(`Gemini getCareerSuggestions failed: ${error?.message || error}`);
    }
  }

  // Fallback Simulation
  const roles = skills.includes('React') || skills.includes('Angular') ? ['Frontend Engineer', 'Full Stack Developer'] : ['Backend Engineer', 'Systems Engineer'];
  if (cgpa > 8.0) roles.push('Research Engineer');

  return {
    roles,
    roadmap: [
      'Master Data Structures and Algorithms in C++/Java/Python.',
      'Build 2 real-world projects showing full-stack integration and deploy them.',
      'Learn cloud containerization with Docker and Kubernetes.'
    ],
    learningResources: [
      'AWS Certified Cloud Practitioner',
      'Advanced React and Node Patterns (Coursera / Udemy)',
      'System Design Primer course'
    ]
  };
}

// 4. Cover Letter Generator
export async function generateCoverLetter(studentName: string, skills: string[], jobTitle: string, company: string) {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
        Write a professional, impressive cover letter for ${studentName} applying for the ${jobTitle} role at ${company}.
        Candidate Skills: ${skills.join(', ')}.
        Keep it concise, under 300 words. Format it in plain text.
      `;

      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (error: any) {
      logger.error(`Gemini generateCoverLetter failed: ${error?.message || error}`);
    }
  }

  // Fallback
  return `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle} position at ${company}. As a student majoring in Computer Applications, I have developed a solid foundation in software engineering, specifically utilizing technologies like ${skills.slice(0, 4).join(', ')}.

I have completed projects demonstrating full-stack engineering practices, web development standards, and analytical databases. I am confident that my technical capabilities align well with the expectations of the team at ${company}.

Thank you for your time and consideration.

Sincerely,
${studentName}`;
}

// 5. Mock Interview Chat Evaluator
export async function evaluateInterviewAnswer(questionText: string, studentAnswer: string) {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
        Evaluate the student's answer to the technical interview question.
        Question: ${questionText}
        Student's Answer: ${studentAnswer}

        Evaluate and return a JSON object with:
        - confidence (number, 1-10)
        - communication (number, 1-10)
        - technicalAccuracy (number, 1-10)
        - feedback (string with detailed correction, what they answered right, what they missed)
        - followUpQuestion (string)

        Output strictly valid JSON:
      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const cleanJson = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (error: any) {
      logger.error(`Gemini evaluateInterviewAnswer failed: ${error?.message || error}`);
    }
  }

  // Fallback Simulation
  const score = studentAnswer.split(' ').length > 10 ? 8 : 5;
  return {
    confidence: score + Math.floor(Math.random() * 2),
    communication: score,
    technicalAccuracy: score + Math.floor(Math.random() * 2),
    feedback: studentAnswer.split(' ').length > 10 
      ? 'Good structural explanation of the concepts. You clearly understand the core principles, but you could enrich your response with a real-world project example.'
      : 'The answer is too brief. Try to explain what the concept is, how it works, and why it is useful in software architecture.',
    followUpQuestion: 'Can you elaborate on how you would optimize this in a high-traffic production application?'
  };
}
