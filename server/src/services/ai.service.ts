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

// 5. Mock Interview Chat Conversational Agent
export async function evaluateInterviewAnswer(history: { sender: string, text: string }[]) {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const formattedHistory = history.map(h => `${h.sender === 'AI' ? 'Interviewer' : 'Candidate'}: ${h.text}`).join('\n');
      const prompt = `
        You are an expert technical interviewer conducting a mock interview.
        Here is the conversation history so far:
        ${formattedHistory}

        Provide your next response as the Interviewer. 
        If the candidate answered a question, briefly and naturally acknowledge or correct their answer, then ask the next technical question.
        If they say they don't know, provide a brief, polite explanation and move on to a different topic.
        Do NOT output JSON. Just reply naturally with your text as the interviewer.
      `;

      const result = await model.generateContent(prompt);
      return { text: result.response.text().trim() };
    } catch (error: any) {
      logger.error(`Gemini evaluateInterviewAnswer failed: ${error?.message || error}`);
    }
  }

  // Fallback Simulation
  const lastUserMsg = history[history.length - 1]?.text?.toLowerCase() || '';
  if (lastUserMsg.includes('not know') || lastUserMsg.includes("don't know")) {
    return { text: "That's completely fine! Let's move on to a different topic. Can you explain what REST APIs are and what HTTP methods are commonly used?" };
  }
  return { text: "Good attempt. To build on that, how would you ensure that your code is scalable and maintainable in a large production environment?" };
}

// 6. Final Mock Interview Report Generator
export async function generateInterviewReport(history: { sender: string, text: string }[]) {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const formattedHistory = history.map(h => `${h.sender === 'AI' ? 'Interviewer' : 'Candidate'}: ${h.text}`).join('\n');
      const prompt = `
        You are an expert technical interviewer evaluating a completed mock interview.
        Here is the full transcript:
        ${formattedHistory}

        Evaluate the candidate's overall performance and return a JSON object with:
        - avgConfidence (number, 0-100)
        - avgCommunication (number, 0-100)
        - avgAccuracy (number, 0-100)
        - feedbackSummary (string: 3-4 sentences summarizing their strengths and areas for improvement)

        Output strictly valid JSON:
      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const cleanJson = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (error: any) {
      logger.error(`Gemini generateInterviewReport failed: ${error?.message || error}`);
    }
  }

  // Fallback simulation
  return {
    avgConfidence: 80,
    avgCommunication: 75,
    avgAccuracy: 70,
    feedbackSummary: "You showed a good fundamental understanding of core concepts. Moving forward, try to provide more detailed real-world examples when explaining technical definitions. Keep practicing!"
  };
}

// General AI Assistant Chat
export async function generateGeneralChatResponse(history: { sender: string, text: string }[]) {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const formattedHistory = history.map(h => `${h.sender === 'AI' ? 'Assistant' : 'Student'}: ${h.text}`).join('\n');
      const prompt = `
        You are a helpful, encouraging, and intelligent AI Assistant embedded within the Smart Placement Portal for students.
        Your goal is to help students with career guidance, platform navigation, interview preparation, and technical questions.
        
        Here is the conversation history:
        ${formattedHistory}

        Provide your next response as the Assistant. Be conversational, concise, and helpful. Do NOT output JSON.
      `;

      const result = await model.generateContent(prompt);
      return { text: result.response.text().trim() };
    } catch (error: any) {
      logger.error(`Gemini generateGeneralChatResponse failed: ${error?.message || error}`);
    }
  }

  // Fallback simulation
  return {
    text: "I am the Smart Placement Portal AI Assistant! However, it seems my AI connection is currently offline. How else can I help you today?"
  };
}

// 7. Generate Exam Questions from AI
export async function generateExamQuestions(topic: string, difficulty: string, count: number) {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
        You are an expert technical assessment creator.
        Generate exactly ${count} multiple choice questions (MCQs) about the topic "${topic}" at a "${difficulty}" difficulty level.
        
        Output strictly valid JSON that matches the following schema:
        [
          {
            "questionText": "Question text here",
            "category": "${topic}",
            "difficulty": "${difficulty}",
            "marks": 2,
            "negativeMarks": 0.5,
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswerIndex": 0,
            "explanation": "Explanation for the correct answer"
          }
        ]
        
        Respond only with the JSON array. Do not include markdown blocks or any other text.
      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const cleanJson = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (error: any) {
      logger.error(`Gemini generateExamQuestions failed: ${error?.message || error}`);
    }
  }

  // Fallback simulation
  return Array.from({ length: count }).map((_, i) => ({
    questionText: `Generated Question ${i + 1} about ${topic} (${difficulty})`,
    category: topic,
    difficulty,
    marks: 2,
    negativeMarks: 0.5,
    options: ['A', 'B', 'C', 'D'],
    correctAnswerIndex: 0,
    explanation: 'Simulated fallback explanation.'
  }));
}

// 8. PDF Exam Question Parser
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
