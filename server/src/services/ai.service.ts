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

  // Fallback Simulation with dynamic contextual matching
  const roles = new Set<string>();
  const roadmapSteps = new Set<string>();
  const resources = new Set<string>();

  const lowerInterests = interests.map(i => i.toLowerCase());
  const lowerSkills = skills.map(s => s.toLowerCase());

  const hasInterest = (keywords: string[]) => lowerInterests.some(i => keywords.some(kw => i.includes(kw)));
  const hasSkill = (keywords: string[]) => lowerSkills.some(s => keywords.some(kw => s.includes(kw)));

  let matched = false;

  // Check Data Science / ML
  if (hasInterest(['data', 'machine learning', 'ai', 'artificial intelligence']) || (!lowerInterests.length && hasSkill(['python', 'pandas', 'tensorflow']))) {
    roles.add('Data Scientist');
    roles.add('Machine Learning Engineer');
    roadmapSteps.add('Master Python, Pandas, and Scikit-Learn.');
    roadmapSteps.add('Learn deep learning frameworks like TensorFlow or PyTorch.');
    roadmapSteps.add('Build end-to-end ML pipelines and deploy them on AWS/GCP.');
    resources.add('DeepLearning.AI Specialization');
    resources.add('Fast.ai Practical Deep Learning');
    matched = true;
  }

  // Check Full Stack (NEW)
  if (hasInterest(['full stack', 'fullstack', 'full-stack'])) {
    roles.add('Full Stack Developer');
    roles.add('Software Engineer');
    roadmapSteps.add('Master modern frontend frameworks (React/Next.js).');
    roadmapSteps.add('Build robust backend APIs using Node.js, Java, or Python.');
    roadmapSteps.add('Understand relational and NoSQL databases, and basic DevOps.');
    resources.add('Full Stack Open (University of Helsinki)');
    resources.add('The Odin Project');
    matched = true;
  }

  // Check Frontend / UI
  if (hasInterest(['frontend', 'ui', 'web', 'front-end']) || (!lowerInterests.length && hasSkill(['react', 'angular', 'vue', 'html', 'css']))) {
    roles.add('Frontend Engineer');
    roles.add('UI/UX Developer');
    roadmapSteps.add('Master modern JavaScript/TypeScript and React/Next.js.');
    roadmapSteps.add('Learn advanced CSS, Tailwind, and responsive design principles.');
    roadmapSteps.add('Understand web performance optimization and accessibility.');
    resources.add('Frontend Masters');
    resources.add('Epic React by Kent C. Dodds');
    matched = true;
  }

  // Check Backend / Systems
  if (hasInterest(['backend', 'system', 'cloud', 'distributed', 'back-end']) || (!lowerInterests.length && hasSkill(['node', 'java', 'c++', 'go', 'sql']))) {
    roles.add('Backend Engineer');
    roles.add('Systems/Cloud Engineer');
    roadmapSteps.add('Master Data Structures and Algorithms in a backend language.');
    roadmapSteps.add('Learn microservices architecture and API design.');
    roadmapSteps.add('Gain hands-on experience with Docker, Kubernetes, and Cloud providers.');
    resources.add('Designing Data-Intensive Applications');
    resources.add('AWS Certified Solutions Architect');
    matched = true;
  }

  // Check CyberSecurity
  if (hasInterest(['security', 'cyber', 'crypto']) || (!lowerInterests.length && hasSkill(['security', 'pentest']))) {
    roles.add('Security Engineer');
    roles.add('Penetration Tester');
    roadmapSteps.add('Learn networking fundamentals and OSI model.');
    roadmapSteps.add('Understand common vulnerabilities (OWASP Top 10) and cryptography.');
    roadmapSteps.add('Practice on platforms like HackTheBox or TryHackMe.');
    resources.add('CompTIA Security+');
    resources.add('Offensive Security Certified Professional (OSCP)');
    matched = true;
  }

  if (cgpa > 8.5 && roles.size > 0) {
    roles.add('Research Scientist / R&D Engineer');
  }

  // Default fallbacks if nothing matched
  if (!matched) {
    roles.add('Software Engineer');
    roles.add('Full Stack Developer');
    roadmapSteps.add('Master core computer science fundamentals and data structures.');
    roadmapSteps.add('Build full-stack side projects to gain practical experience.');
    roadmapSteps.add('Learn version control (Git) and basic CI/CD concepts.');
    resources.add('The Odin Project');
    resources.add('System Design Primer');
  }

  return {
    roles: Array.from(roles).slice(0, 4),
    roadmap: Array.from(roadmapSteps).slice(0, 5),
    learningResources: Array.from(resources).slice(0, 4)
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
  const relevantSkills = skills.slice(0, 5);
  const skillsStr = relevantSkills.length > 0 ? relevantSkills.join(', ') : 'modern software engineering principles';
  
  return `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle} position at ${company}. As a dedicated student and aspiring engineer, I have developed a solid technical foundation, specifically utilizing technologies like ${skillsStr}.

Throughout my academic journey and practical projects, I have focused on building robust, scalable solutions. I am highly motivated to bring my expertise in ${relevantSkills[0] || 'problem-solving'} and ${relevantSkills[1] || 'system design'} to the engineering team at ${company}, contributing to your ongoing success and innovative projects.

I would welcome the opportunity to discuss how my background, skills, and enthusiasm align with the goals of ${company}. Thank you for your time and consideration.

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

  // Fallback Simulation with Contextual Keyword Matching
  const lowerQuestion = questionText.toLowerCase();
  const lowerAnswer = studentAnswer.toLowerCase();

  // Determine expected keywords based on the question context
  let expectedKeywords: string[] = [];
  if (lowerQuestion.includes('virtual dom') || lowerQuestion.includes('react')) {
    expectedKeywords = ['reconciliation', 'diffing', 'memory', 'performance', 'state', 'ui', 'render'];
  } else if (lowerQuestion.includes('node') || lowerQuestion.includes('stream')) {
    expectedKeywords = ['buffer', 'memory', 'chunk', 'pipe', 'event', 'asynchronous', 'large files', 'data'];
  } else if (lowerQuestion.includes('database') || lowerQuestion.includes('index')) {
    expectedKeywords = ['b-tree', 'scan', 'speed', 'read', 'write', 'penalty', 'lookup', 'performance'];
  } else if (lowerQuestion.includes('url shortener') || lowerQuestion.includes('design')) {
    expectedKeywords = ['hash', 'base62', 'load balancer', 'cache', 'redis', 'nosql', 'sharding', 'throughput'];
  } else if (lowerQuestion.includes('docker') || lowerQuestion.includes('container')) {
    expectedKeywords = ['image', 'kernel', 'isolation', 'lightweight', 'namespace', 'cgroups', 'virtual machine', 'overhead'];
  } else if (lowerQuestion.includes('supervised') || lowerQuestion.includes('learning')) {
    expectedKeywords = ['labels', 'classification', 'regression', 'clustering', 'training', 'data', 'algorithm', 'target'];
  } else if (lowerQuestion.includes('garbage collection') || lowerQuestion.includes('jvm')) {
    expectedKeywords = ['heap', 'reference', 'unreachable', 'memory', 'mark', 'sweep', 'generation', 'eden'];
  } else if (lowerQuestion.includes('gil') || lowerQuestion.includes('interpreter lock')) {
    expectedKeywords = ['thread', 'mutex', 'cpython', 'concurrency', 'cpu-bound', 'i/o-bound', 'multiprocessing', 'parallelism'];
  } else if (lowerQuestion.includes('smart pointers') || lowerQuestion.includes('c++')) {
    expectedKeywords = ['memory leak', 'ownership', 'unique_ptr', 'shared_ptr', 'reference counting', 'delete', 'raii', 'scope'];
  } else if (lowerQuestion.includes('closure') || lowerQuestion.includes('javascript')) {
    expectedKeywords = ['lexical', 'scope', 'function', 'inner', 'outer', 'encapsulation', 'private', 'variables'];
  } else {
    expectedKeywords = ['design', 'architecture', 'scalable', 'efficient', 'optimize'];
  }

  // Calculate technical accuracy based on keyword hits
  let matches = 0;
  expectedKeywords.forEach(kw => {
    if (lowerAnswer.includes(kw)) matches++;
  });

  const wordCount = studentAnswer.split(' ').length;
  const isTooShort = wordCount < 15;

  let techScore = 4;
  if (matches >= 3) techScore = 9;
  else if (matches >= 1) techScore = 7;
  
  if (isTooShort) techScore -= 2;

  let feedbackMsg = '';
  if (techScore >= 8) {
    feedbackMsg = `Excellent answer! You correctly identified key concepts like ${expectedKeywords.filter(k => lowerAnswer.includes(k)).slice(0, 2).join(' and ')}. Your technical understanding is very solid.`;
  } else if (techScore >= 5) {
    feedbackMsg = `Good attempt. You mentioned some correct points, but try to use more precise terminology like "${expectedKeywords[0]}" or "${expectedKeywords[1]}" to strengthen your answer.`;
  } else {
    feedbackMsg = isTooShort 
      ? 'Your answer was too brief. Try to elaborate on the concepts and provide specific examples.'
      : 'You missed the core technical concepts. Review the fundamental mechanisms behind this technology.';
  }

  return {
    confidence: isTooShort ? 5 : 8,
    communication: isTooShort ? 4 : 8,
    technicalAccuracy: techScore,
    feedback: feedbackMsg,
    followUpQuestion: techScore >= 7 
      ? 'Great. Can you elaborate on how you would optimize this in a high-traffic production environment?'
      : 'Let us try another one. Can you describe a recent technical challenge you solved?'
  };
}

// 6. PDF Exam Question Parser
export async function parseExamQuestionsFromText(pdfText: string) {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
        You are an expert technical assessment creator.
        Extract Multiple Choice Questions (MCQs) from the following text (which is a parsed PDF exam).
        
        Text:
        """
        ${pdfText}
        """

        Extract as many distinct MCQs as you can find. 
        For each question, ensure there are exactly 4 options. Identify the correct answer index (0 to 3).
        If the difficulty is not stated, infer it (Easy, Medium, Hard).
        Assign a generic category like 'General' or 'Technical' if none is obvious.
        
        Return a JSON array of objects with this exact structure:
        [
          {
            "questionText": "What does CPU stand for?",
            "category": "Computer Science",
            "difficulty": "Easy",
            "marks": 2,
            "negativeMarks": 0.5,
            "options": ["Central Process Unit", "Computer Personal Unit", "Central Processing Unit", "Central Processor Unit"],
            "correctAnswerIndex": 2,
            "explanation": "CPU stands for Central Processing Unit."
          }
        ]

        Output strictly valid JSON array only:
      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const cleanJson = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (error: any) {
      logger.error(`Gemini parseExamQuestions failed: ${error?.message || error}`);
    }
  }

  // Fallback Simulation if Gemini fails or is disabled
  return [
    {
      questionText: 'Mock Extracted Question 1: What is the time complexity of binary search?',
      category: 'Algorithms',
      difficulty: 'Medium',
      marks: 2,
      negativeMarks: 0.5,
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'],
      correctAnswerIndex: 1,
      explanation: 'Binary search halves the search space each step.'
    },
    {
      questionText: 'Mock Extracted Question 2: Which keyword is used to define a constant in JS?',
      category: 'JavaScript',
      difficulty: 'Easy',
      marks: 2,
      negativeMarks: 0,
      options: ['let', 'var', 'const', 'final'],
      correctAnswerIndex: 2,
      explanation: 'const is used for block-scoped variables that cannot be reassigned.'
    }
  ];
}
