import bcryptjs from 'bcryptjs';

// Types
export interface User {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'Student' | 'Recruiter' | 'PlacementOfficer' | 'Admin';
  profile: {
    phone?: string;
    cgpa?: number;
    cgpaScale?: string;
    branch?: string;
    skills: string[];
    experience: string[];
    projects: { title: string; description: string; url?: string }[];
    education: { institution: string; degree: string; year: string }[];
    resumeUrl?: string;
    resumeScore?: number;
    resumeAnalysis?: any;
    verified: boolean;
    certificates: { name: string; url: string; verified: boolean; issueDate: string }[];
  };
  createdAt: Date;
}

export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary: number; // in LPA
  requirements: {
    minCGPA: number;
    branches: string[];
    skills: string[];
  };
  postedBy: string; // User ID of Recruiter
  applicantsCount: number;
  createdAt: Date;
}

export interface Application {
  _id: string;
  jobId: string;
  studentId: string;
  status: 'Applied' | 'Shortlisted' | 'Rejected' | 'Selected';
  resumeUrl: string;
  matchScore: number;
  matchDetails: {
    matchedSkills: string[];
    missingSkills: string[];
    recommendation: string;
  };
  appliedAt: Date;
}

export interface Interview {
  _id: string;
  jobId: string;
  studentId: string;
  date: string;
  time: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  meetLink: string;
  score?: {
    confidence: number;
    communication: number;
    technicalAccuracy: number;
    feedback: string;
  };
  createdAt: Date;
}

export interface Discussion {
  _id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  category: 'General' | 'Interview' | 'Job' | 'Official';
  replies: {
    _id: string;
    authorId: string;
    authorName: string;
    authorRole: string;
    content: string;
    createdAt: Date;
  }[];
  createdAt: Date;
}

export interface Review {
  _id: string;
  company: string;
  studentId: string;
  rating: number; // 1-5
  salary: number; // in LPA
  difficulty: number; // 1-5
  title: string;
  content: string;
  interviewProcess: string;
  tips: string;
  createdAt: Date;
}

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface SkillExam {
  _id: string;
  title: string;
  domain: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questions: {
    _id: string;
    questionText: string;
    options: string[];
    correctAnswerIndex: number;
  }[];
  codingChallenges: {
    _id: string;
    title: string;
    description: string;
    starterCode: string;
    testCases: { input: string; output: string }[];
  }[];
}

class MockDatabase {
  users: User[] = [];
  jobs: Job[] = [];
  applications: Application[] = [];
  interviews: Interview[] = [];
  discussions: Discussion[] = [];
  reviews: Review[] = [];
  notifications: Notification[] = [];
  exams: SkillExam[] = [];

  constructor() {
    this.seed();
  }

  private seed() {
    const salt = bcryptjs.genSaltSync(10);
    const passwordHash = bcryptjs.hashSync('password123', salt);

    // 1. Seed Users
    this.users = [
      {
        _id: 'usr_stud_1',
        name: 'Amit Sharma',
        email: 'student@placement.com',
        passwordHash,
        role: 'Student',
        profile: {
          phone: '+91 9876543210',
          cgpa: 8.5,
          branch: 'MCA',
          skills: ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'HTML', 'CSS'],
          experience: ['Web Developer Intern at TechCorp (3 months)'],
          projects: [
            {
              title: 'E-Commerce App',
              description: 'MERN stack application with cart and stripe payment integration.',
              url: 'https://github.com/amit/ecommerce'
            }
          ],
          education: [
            { institution: 'National Institute of Technology', degree: 'MCA', year: '2027' },
            { institution: 'Delhi University', degree: 'BCA', year: '2024' }
          ],
          resumeUrl: 'https://res.cloudinary.com/demo/image/upload/sample_resume.pdf',
          resumeScore: 82,
          resumeAnalysis: {
            score: 82,
            missingSkills: ['Docker', 'AWS', 'Redis'],
            grammarErrors: 2,
            atsCompatibility: 88
          },
          verified: true,
          certificates: [
            { name: 'React Development Certificate (Coursera)', url: 'https://coursera.org/verify/react', verified: true, issueDate: '2025-05-10' }
          ]
        },
        createdAt: new Date()
      },
      {
        _id: 'usr_rec_1',
        name: 'Sarah Connor',
        email: 'recruiter@placement.com',
        passwordHash,
        role: 'Recruiter',
        profile: {
          skills: [],
          experience: [],
          projects: [],
          education: [],
          verified: true,
          certificates: []
        },
        createdAt: new Date()
      },
      {
        _id: 'usr_off_1',
        name: 'Dr. Ramesh Kumar',
        email: 'officer@placement.com',
        passwordHash,
        role: 'PlacementOfficer',
        profile: {
          skills: [],
          experience: [],
          projects: [],
          education: [],
          verified: true,
          certificates: []
        },
        createdAt: new Date()
      },
      {
        _id: 'usr_adm_1',
        name: 'System Admin',
        email: 'admin@placement.com',
        passwordHash,
        role: 'Admin',
        profile: {
          skills: [],
          experience: [],
          projects: [],
          education: [],
          verified: true,
          certificates: []
        },
        createdAt: new Date()
      }
    ];

    // 2. Seed Jobs
    this.jobs = [
      {
        _id: 'job_1',
        title: 'Full Stack Engineer',
        company: 'Google',
        location: 'Bangalore, India (Hybrid)',
        description: 'Join our Cloud Platform team to build next-generation cloud dashboard UI.',
        salary: 18,
        requirements: {
          minCGPA: 8.0,
          branches: ['MCA', 'B.Tech CSE'],
          skills: ['React', 'Node.js', 'MongoDB', 'JavaScript']
        },
        postedBy: 'usr_rec_1',
        applicantsCount: 1,
        createdAt: new Date(Date.now() - 3600000 * 24 * 3) // 3 days ago
      },
      {
        _id: 'job_2',
        title: 'Backend Developer',
        company: 'Amazon',
        location: 'Hyderabad, India (On-site)',
        description: 'Looking for a solid Node.js/Python engineer to manage distribution APIs.',
        salary: 24,
        requirements: {
          minCGPA: 7.5,
          branches: ['MCA', 'B.Tech CSE', 'M.Tech'],
          skills: ['Node.js', 'AWS', 'Docker', 'SQL']
        },
        postedBy: 'usr_rec_1',
        applicantsCount: 0,
        createdAt: new Date(Date.now() - 3600000 * 24 * 1) // 1 day ago
      }
    ];

    // 3. Seed Application
    this.applications = [
      {
        _id: 'app_1',
        jobId: 'job_1',
        studentId: 'usr_stud_1',
        status: 'Applied',
        resumeUrl: 'https://res.cloudinary.com/demo/image/upload/sample_resume.pdf',
        matchScore: 94,
        matchDetails: {
          matchedSkills: ['React', 'Node.js', 'MongoDB', 'JavaScript'],
          missingSkills: [],
          recommendation: 'Highly Recommended'
        },
        appliedAt: new Date(Date.now() - 3600000 * 24 * 2)
      }
    ];

    // 4. Seed Discussions
    this.discussions = [
      {
        _id: 'disc_1',
        title: 'Google Full Stack Interview Rounds 2026',
        content: 'Hey guys, I have my interview tomorrow. Can anyone share what they ask in the Web developer rounds?',
        authorId: 'usr_stud_1',
        authorName: 'Amit Sharma',
        authorRole: 'Student',
        category: 'Interview',
        replies: [
          {
            _id: 'reply_1',
            authorId: 'usr_rec_1',
            authorName: 'Sarah Connor',
            authorRole: 'Recruiter',
            content: 'Focus on System Design, React performance optimizations, and basic DS/Algo. Good luck!',
            createdAt: new Date(Date.now() - 3600000 * 2)
          }
        ],
        createdAt: new Date(Date.now() - 3600000 * 6)
      },
      {
        _id: 'disc_2',
        title: 'Important: Resume Upload Deadline',
        content: 'All MCA and CSE students are required to upload their verified Coursera/NPTEL certificates by next Friday.',
        authorId: 'usr_off_1',
        authorName: 'Dr. Ramesh Kumar',
        authorRole: 'PlacementOfficer',
        category: 'Official',
        replies: [],
        createdAt: new Date(Date.now() - 3600000 * 24)
      }
    ];

    // 5. Seed Reviews
    this.reviews = [
      {
        _id: 'rev_1',
        company: 'Google',
        studentId: 'usr_stud_1',
        rating: 5,
        salary: 18,
        difficulty: 4,
        title: 'Tough but great experience',
        content: 'Had 4 rounds. 1 coding round (LeetCode Medium), 2 React technical rounds, and 1 behavioral round.',
        interviewProcess: 'Took around 3 weeks from shortlist to selection offer.',
        tips: 'Be strong in JS closures, promises, and React rendering cycle.',
        createdAt: new Date()
      }
    ];

    // 6. Seed Skill Exams
    this.exams = [
      {
        _id: 'exam_web',
        title: 'Full Stack Fundamentals MCQ',
        domain: 'Frontend',
        difficulty: 'Medium',
        questions: [
          {
            _id: 'q1',
            questionText: 'Which React hook is used to handle side effects?',
            options: ['useState', 'useEffect', 'useContext', 'useReducer'],
            correctAnswerIndex: 1
          },
          {
            _id: 'q2',
            questionText: 'What is the purpose of CORS in Express?',
            options: [
              'To enable compression',
              'To allow requests from other origins',
              'To encrypt traffic',
              'To hash user passwords'
            ],
            correctAnswerIndex: 1
          },
          {
            _id: 'q3',
            questionText: 'Which database type is MongoDB?',
            options: ['Relational', 'Document-based NoSQL', 'Key-Value store', 'Graph Database'],
            correctAnswerIndex: 1
          }
        ],
        codingChallenges: [
          {
            _id: 'code1',
            title: 'Sum of Digits',
            description: 'Write a function sumDigits(n) that takes a positive integer n and returns the sum of all its digits. For example, sumDigits(123) should return 6.',
            starterCode: 'function sumDigits(n) {\n  // Write your code here\n  return 0;\n}',
            testCases: [
              { input: '123', output: '6' },
              { input: '456', output: '15' },
              { input: '9', output: '9' }
            ]
          }
        ]
      }
    ];
  }
}

export const mockDb = new MockDatabase();
