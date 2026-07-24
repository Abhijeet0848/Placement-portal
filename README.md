# Smart Placement Portal - AI-Powered Campus Recruitment Platform


A state-of-the-art, production-ready campus recruitment platform built with **React 19**, **TypeScript**, **Node.js/Express**, **MongoDB**, **Socket.io**, and **Google Gemini AI**. Designed to solve real placement challenges through AI-driven resume scoring, job matching, mock interviews, online coding assessments, real-time notifications, and placement analytics.

![Smart Placement Portal Banner](https://img.shields.io/badge/Smart%20Placement-Portal-4f46e5?style=for-the-badge&logo=react&logoColor=white)
![React](https://img.shields.io/badge/Frontend-React%2019%20%7C%20TypeScript%20%7C%20Tailwind-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express%20%7C%20MongoDB-339933?style=flat-square&logo=node.js)
![AI Gemini](https://img.shields.io/badge/AI-Google%20Gemini%20API-4285F4?style=flat-square&logo=google)
![Docker Ready](https://img.shields.io/badge/Deployment-Docker%20%7C%20Vercel%20%7C%20Render-2496ED?style=flat-square&logo=docker)


---

## 🌟 Key Features Across 4 User Roles

### 1. 🎓 Student Portal
- **AI Resume Analyzer**: Upload resume PDF/text for real-time ATS scoring, missing skill detection, grammar audit, and actionable suggestions.
- **AI Resume vs. Job Matcher**: Compare your candidate profile against job descriptions to obtain match percentages and gap breakdown.
- **AI Mock Interview Simulator**: Interactive text & voice mock interview engine that evaluates technical accuracy, confidence, and communication skills.
- **AI Career & Cover Letter Generator**: Generate tailored cover letters and personalized career progression roadmaps based on CGPA, branch, and skills.
- **Skill Assessment & Coding Lab**: Take domain-specific MCQ exams and solve algorithmic coding challenges with automated test case evaluation.
- **Smart Eligibility Checker**: Instant eligibility validation against recruiter CGPA cutoffs, allowed branches, and prerequisite skills.
- **Job Recommendations**: Smart scoring engine that recommends jobs prioritized by skill alignment and candidate history.
- **Real-Time Trackers**: Application status timelines, scheduled interview alerts, notice board, and company reviews.

### 2. 🏢 Recruiter Portal
- **Job posting & management**: Create job listings with CGPA requirements, required skills, target branches, and salary ranges.
- **AI Resume Ranking**: Automatically rank all applicant resumes based on semantic fit and technical matching.
- **Candidate Shortlisting**: Review candidate profiles, certificates, skill badges, and transition statuses (Applied -> Shortlisted -> Interview -> Hired/Rejected).
- **Live Interview Scheduler**: Schedule interview slots with automatic date/time validation, student notifications, and calendar links.
- **Automated Communication**: Send targeted emails for selection, rejection, and interview instructions.
- **Recruiter Analytics**: Visual charts for hiring ratios, application velocity, and top candidate skill distributions.

### 3. 🏛️ Placement Officer Portal
- **Student Document Verification**: Review and verify student marksheets, certificates, and profile accuracy.
- **Department Placement Analytics**: Comprehensive charts for placed vs. unplaced ratio, average package, highest package, department-wise breakdown, and top recruiters.
- **Placement Rules Engine**: Configure institute eligibility rules (e.g., minimum CGPA, active backlog caps, branch restrictions).
- **Broadcast Notice Board**: Publish campus-wide placement notices and drive announcements with real-time Socket.io delivery.
- **Reports Exporter**: Generate and export placement statistics reports for accreditation and management reviews.

### 4. ⚡ Admin Portal
- **User Management**: Search, filter, inspect, activate, or block user accounts across Students, Recruiters, and Officers.
- **Role & Permission Controls**: Granular security rules and access level configurations.
- **Audit Activity Logs**: Track system activity, authentication events, and administrative overrides.
- **Database Backup & Maintenance**: One-click database export/backup simulation and system health monitoring.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Recharts, Lucide Icons, Socket.io-Client, Canvas-Confetti
- **Backend**: Node.js, Express.js, TypeScript, Socket.io, Mongoose (MongoDB Atlas), Nodemailer, Multer, PDF Parse
- **AI Service**: Google Gemini Generative AI SDK (`@google/genai`)
- **Security**: JWT Access + Refresh Tokens, Bcrypt password hashing, Helmet.js headers, Express Rate Limiter, Zod validation
- **Deployment & DevOps**: Docker, Docker Compose, Vercel SPA routing (`vercel.json`), Render/Railway server build scripts

---

# Glimpse
<img width="1909" height="870" alt="image" src="https://github.com/user-attachments/assets/fdc7f61c-f4e8-4336-b632-ab1a05c7bb41" />
<img width="1893" height="847" alt="image" src="https://github.com/user-attachments/assets/4b4f0108-dfc9-4a98-95b7-98ee1715416f" />
<img width="1904" height="866" alt="image" src="https://github.com/user-attachments/assets/ac51eb04-8fc6-4e5f-bbce-e4f4c27cb6f3" />
<img width="1916" height="853" alt="image" src="https://github.com/user-attachments/assets/25dde12a-daaf-4eea-9e18-0cfac2d81b5e" />
<img width="1907" height="867" alt="image" src="https://github.com/user-attachments/assets/2f2c2954-7ac0-4f61-8388-b16b7f1195bb" />
<img width="1918" height="866" alt="image" src="https://github.com/user-attachments/assets/89e6a323-826f-4a0f-a647-ddf144e69c2c" />
<img width="1692" height="854" alt="image" src="https://github.com/user-attachments/assets/3182b8b3-22a3-4ea1-953e-00a48657f05b" />
<img width="1697" height="857" alt="image" src="https://github.com/user-attachments/assets/93255df7-e174-4ddf-9deb-0c3b39aaad23" />
<img width="1683" height="847" alt="image" src="https://github.com/user-attachments/assets/39335019-40f6-4929-8f91-2bbd3462ad6a" />
<img width="1699" height="854" alt="image" src="https://github.com/user-attachments/assets/740870d0-9fbc-4843-a185-8d491de67be8" />
<img width="1685" height="846" alt="image" src="https://github.com/user-attachments/assets/e0d20256-8c5f-4dce-82c4-1971260d751c" />
<img width="1918" height="867" alt="image" src="https://github.com/user-attachments/assets/28446b79-04a8-416e-9f27-9a4d0a8b96a8" />
<img width="1912" height="865" alt="image" src="https://github.com/user-attachments/assets/505d3a26-d3ec-460d-977c-5c191e7fa39f" />



# Smart Placement Portal - GitHub Repository Content

## 📋 Repository Description

**AI-Powered Campus Recruitment Platform** | React 19 + TypeScript + Node.js + MongoDB + Google Gemini AI

A production-ready, full-stack recruitment platform featuring AI-driven resume analysis, smart job matching, mock interviews, coding assessments, and real-time analytics. Built for Students, Recruiters, Placement Officers, and Admins.

---

## 🏷️ Repository Topics (Tags)

```
react-19
typescript
nodejs
express
mongodb
mongoose
google-gemini-ai
ai-powered
resume-analyzer
ats-scoring
job-matching
mock-interview
coding-assessment
placement-management
campus-recruitment
socket-io
jwt-authentication
role-based-access-control
tailwind-css
docker
vercel
render
full-stack
mern-stack
```

---

## 📝 Short Description (GitHub "About" Section)

> AI-powered campus recruitment platform with resume analysis, job matching, mock interviews, and real-time placement analytics. Built with React 19, Node.js, MongoDB, and Google Gemini AI.

---

## 🎯 Repository Features (GitHub Social Preview)

### ✨ Key Highlights
- 🤖 **AI Resume Analyzer** - ATS scoring, skill extraction, grammar audit
- 🎯 **Smart Job Matching** - Semantic profile-to-job matching with gap analysis
- 🎤 **AI Mock Interviews** - Voice & text-based interview simulation with evaluation
- 💻 **Coding Lab** - Algorithmic challenges with automated test cases
- 📊 **Real-Time Analytics** - Placement statistics, hiring ratios, skill distributions
- 🔐 **Role-Based Access** - Student, Recruiter, Officer, and Admin portals
- 📱 **Responsive Design** - Mobile-first UI with Tailwind CSS
- 🐳 **Docker Ready** - One-click deployment with Docker Compose

---

## 🚀 Quick Stats

- **Frontend**: React 19 + TypeScript + Tailwind CSS + Vite
- **Backend**: Node.js + Express + TypeScript + Socket.io
- **Database**: MongoDB (Mongoose ODM) with Mock DB fallback
- **AI Engine**: Google Gemini Generative AI SDK
- **Authentication**: JWT Access + Refresh Tokens
- **Deployment**: Docker, Vercel (Frontend), Render/Railway (Backend)

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/your-username/smart-placement-portal.git
cd smart-placement-portal

# Install all dependencies
npm run install-all

# Configure environment variables
cp server/.env.example server/.env
# Edit server/.env with your MongoDB URI, JWT secrets, and Gemini API key

# Run development servers
npm run dev
```

**Access Points:**
- 🌐 Frontend: http://localhost:5173
- 🔧 Backend API: http://localhost:5000
- 💚 Health Check: http://localhost:5000/health

---

## 🐳 Docker Deployment

```bash
# Start all services (MongoDB + Backend + Frontend)
docker-compose up --build -d

# View logs
docker-compose logs -f server
```

---



## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Smart Placement Portal                 │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐      ┌──────────────┐                │
│  │   React 19   │      │  Node.js     │                │
│  │  Frontend    │◄────►│  Express     │                │
│  │  (Vite)      │      │  Backend     │                │
│  └──────────────┘      └──────┬───────┘                │
│         │                      │                         │
│         │                      │                         │
│  ┌──────▼──────┐        ┌──────▼───────┐                │
│  │  Tailwind   │        │  MongoDB     │                │
│  │  Recharts   │        │  Mongoose    │                │
│  │  Socket.io  │        │              │                │
│  └─────────────┘        └──────────────┘                │
│         │                      │                         │
│         │                      │                         │
│  ┌──────▼──────────────────────▼───────┐                │
│  │     Google Gemini AI Engine          │                │
│  │  • Resume Analysis                   │                │
│  │  • Job Matching                      │                │
│  │  • Interview Evaluation              │                │
│  │  • Cover Letter Generation           │                │
│  └──────────────────────────────────────┘                │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 👥 User Roles & Permissions

| Role | Access Level |
|------|--------------|
| **Student** | Profile management, job applications, resume analysis, coding exams, mock interviews |
| **Recruiter** | Job posting, candidate shortlisting, interview scheduling, analytics dashboard |
| **Placement Officer** | Student verification, placement analytics, rules configuration, notice board |
| **Admin** | User management, role permissions, audit logs, database maintenance |

---

## 🔑 Core Features Breakdown

### 🤖 AI-Powered Tools
- **Resume Parser**: Extract skills, phone, experience from PDF using NLP
- **ATS Scorecard**: Real-time scoring with actionable improvement suggestions
- **Job Matcher**: Semantic similarity scoring between candidate profile and job description
- **Mock Interview**: AI interviewer with technical accuracy and communication evaluation
- **Career Roadmap**: Personalized career progression based on CGPA, branch, and skills
- **Cover Letter Generator**: AI-written tailored cover letters for specific jobs

### 📊 Analytics & Tracking
- **Student Dashboard**: Application status timeline, interview schedules, skill badges
- **Recruiter Analytics**: Hiring ratios, application velocity, top candidate skills
- **Officer Analytics**: Department-wise placement stats, average/highest packages, top recruiters
- **Real-Time Notifications**: Socket.io-powered instant alerts for interviews and updates

### 🔒 Enterprise-Grade Security Architecture (OWASP Compliant)
This application was engineered with a security-first mindset, fully mitigating the **OWASP Top 10** vulnerabilities and passing rigorous MERN-stack security audits:
- **Authentication & Sessions**: Stateless JWT architecture (Access + Secure Refresh Token rotation) with robust `bcryptjs` password hashing (10-round salt).
- **Role-Based Access Control (RBAC)**: Strict API middleware (`requireRole`) ensuring vertical and horizontal privilege separation across Students, Recruiters, Officers, and Admins.
- **Injection Protection**: Aggressive `express-mongo-sanitize` middleware completely blocking NoSQL injection payloads (e.g., `$gt`, `$set`).
- **Brute Force & DoS Mitigation**: `express-rate-limit` configured to block repetitive authentication attempts.
- **Data Integrity & Validation**: Strict Regex-based input validation pipelines enforcing constraints on Emails, Passwords, Phone numbers, and Job Metadata.
- **Cross-Site Scripting (XSS)**: Leverages React's native data-binding auto-escaping, combined with strict MIME-type and memory-size restrictions on all file uploads via `multer`.
- **HTTP Security Headers**: Powered by `helmet.js` to enforce HSTS (HTTPS only), disable MIME-sniffing, and defend against Clickjacking.
- **Information Leakage Prevention**: Global error handlers explicitly mask `500 Internal Server Errors`, logging stack traces privately on the backend while returning generic sanitized messages to the client.
- **Audit Trails**: Real-time logging of sensitive administrative actions (e.g., Database Backup/Restore, Permission changes) to track system usage.

---

## 🛠️ Tech Stack Details

### Frontend
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Data visualization library
- **Lucide React** - Beautiful icon library
- **Socket.io Client** - Real-time communication
- **Canvas Confetti** - Celebration animations

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe server code
- **Socket.io** - WebSocket for real-time features
- **Mongoose** - MongoDB object modeling
- **Multer** - File upload handling
- **PDF Parse** - Resume text extraction
- **Nodemailer** - Email notifications
- **Winston** - Logging framework
- **Bcrypt** - Password hashing
- **JWT** - Authentication tokens
- **Zod** - Schema validation

### AI & External Services
- **Google Gemini API** - Generative AI for resume analysis, interviews, and content generation
- **MongoDB Atlas** - Cloud database (or local MongoDB)

---

## 📁 Project Structure

```
smart-placement-portal/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   ├── context/                 # Auth & Socket contexts
│   │   ├── pages/
│   │   │   ├── Admin/               # Admin portal pages
│   │   │   ├── Auth/                # Login/Register
│   │   │   ├── Officer/             # Placement officer pages
│   │   │   ├── Recruiter/           # Recruiter pages
│   │   │   └── Student/             # Student portal pages
│   │   ├── services/                # API service layer
│   │   ├── App.tsx                  # Router configuration
│   │   └── main.tsx                 # Entry point
│   ├── public/
│   ├── vercel.json                  # Vercel deployment config
│   └── package.json
├── server/                          # Express Backend
│   ├── src/
│   │   ├── config/                  # Database configuration
│   │   ├── controllers/             # Route handlers
│   │   ├── db/                      # Mock database & seeds
│   │   ├── middleware/              # Auth, RBAC, validation
│   │   ├── models/                  # Mongoose schemas
│   │   ├── routes/                  # API routes
│   │   └── utils/                   # Logger & helpers
│   ├── Dockerfile                   # Production container
│   ├── .env.example                 # Environment template
│   └── package.json
├── docker-compose.yml               # Multi-container orchestration
├── package.json                     # Root workspace config
└── README.md                        # Full documentation
```

---

## 🧪 Testing

```bash
# Run backend tests (if configured)
cd server && npm test

# Run frontend tests (if configured)
cd client && npm test

# Lint code
npm run lint
```

---



## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---


---

## 👨‍💻 Author

**Your Name**
- GitHub: [https://github.com/Abhijeet0848]
- LinkedIn: [www.linkedin.com/in/abhijeetkumar-gautam]

---

## 🙏 Acknowledgments

- [React](https://react.dev/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Google Gemini AI](https://ai.google.dev/) - AI capabilities
- [MongoDB](https://www.mongodb.com/) - Database
- [Socket.io](https://socket.io/) - Real-time communication
- All contributors and testers

---



**Built with ❤️ for students and recruiters worldwide**

