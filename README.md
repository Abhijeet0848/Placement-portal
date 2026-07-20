# Smart Placement Portal - AI-Powered Campus Recruitment Platform

![Smart Placement Portal Banner](https://img.shields.io/badge/Smart%20Placement-Portal-4f46e5?style=for-the-badge&logo=react&logoColor=white)
![React](https://img.shields.io/badge/Frontend-React%2019%20%7C%20TypeScript%20%7C%20Tailwind-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express%20%7C%20MongoDB-339933?style=flat-square&logo=node.js)
![AI Gemini](https://img.shields.io/badge/AI-Google%20Gemini%20API-4285F4?style=flat-square&logo=google)
![Docker Ready](https://img.shields.io/badge/Deployment-Docker%20%7C%20Vercel%20%7C%20Render-2496ED?style=flat-square&logo=docker)

A state-of-the-art, production-ready campus recruitment platform built with **React 19**, **TypeScript**, **Node.js/Express**, **MongoDB**, **Socket.io**, and **Google Gemini AI**. Designed to solve real placement challenges through AI-driven resume scoring, job matching, mock interviews, online coding assessments, real-time notifications, and placement analytics.

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
- **AI Service**: Google Gemini Generative AI SDK (`@google/generative-ai`)
- **Security**: JWT Access + Refresh Tokens, Bcrypt password hashing, Helmet.js headers, Express Rate Limiter, Zod validation
- **Deployment & DevOps**: Docker, Docker Compose, Vercel SPA routing (`vercel.json`), Render/Railway server build scripts

---

## 🚀 Quickstart Guide

### Prerequisites
- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **MongoDB**: Local MongoDB server OR MongoDB Atlas connection URI

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/your-username/smart-placement-portal.git
cd smart-placement-portal

# Install dependencies across root, client, and server
npm run install-all
```

### 2. Configure Environment Variables
Copy `.env.example` in the `server` directory to `.env`:
```bash
cp server/.env.example server/.env
```
Edit `server/.env` with your MongoDB URI, JWT Secrets, and Google Gemini API key.

### 3. Run Locally in Development Mode
```bash
npm run dev
```
- **Client**: `http://localhost:5173`
- **Server**: `http://localhost:5000`
- **Health Check**: `http://localhost:5000/health`

---

## 🐳 Docker Deployment

Run the complete stack (MongoDB + Express Backend) in isolated Docker containers:

```bash
# Build and start services in the background
docker-compose up --build -d

# Check running container status
docker-compose ps

# View logs
docker-compose logs -f server
```

---

## 🌐 Production Cloud Deployment Guide

### Deploying Frontend to Vercel
1. Push your repository to **GitHub**.
2. Log into [Vercel](https://vercel.com) and click **Add New Project**.
3. Select your repository and set the **Root Directory** to `client`.
4. Configure Build Command: `npm run build` | Output Directory: `dist`.
5. Add Environment Variable:
   - `VITE_API_URL` = `https://your-backend-api.onrender.com/api`
6. Click **Deploy**. Vercel will automatically configure single-page app rewrites via `client/vercel.json`.

### Deploying Backend to Render / Railway
1. Log into [Render](https://render.com) and create a **Web Service**.
2. Connect your GitHub repository and set the **Root Directory** to `server`.
3. Set Build Command: `npm run build` | Start Command: `npm start`.
4. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `PORT` = `5000`
   - `CLIENT_ORIGIN` = `https://your-frontend-app.vercel.app`
   - `MONGODB_URI` = `your_mongodb_atlas_connection_string`
   - `JWT_SECRET` = `your_secure_jwt_secret`
   - `GEMINI_API_KEY` = `your_google_gemini_key`
5. Click **Deploy Web Service**.

---

## 📁 Repository Structure

```text
Smart Placement Portal/
├── client/                     # Vite + React 19 Frontend
│   ├── public/                 # Static assets & PWA manifest.json
│   ├── src/
│   │   ├── components/         # Navigation, Layouts, Visual Cards
│   │   ├── context/            # AuthContext & SocketContext
│   │   ├── pages/
│   │   │   ├── Admin/          # User Management, Logs, Backup, Permissions
│   │   │   ├── Auth/           # Login & Registration Pages
│   │   │   ├── Officer/        # Student Verification, Analytics, Notices, Rules
│   │   │   ├── Recruiter/      # Candidates, Scheduler, Job Creator, Emails
│   │   │   └── Student/        # Resume Analyzer, Mock Interview, Coding Lab, Profile
│   │   ├── services/           # Axios-like Fetch API Service wrapper
│   │   ├── App.tsx             # Main React Router setup
│   │   └── main.tsx            # Entry point
│   ├── vercel.json             # Vercel SPA routing rewrite rules
│   └── package.json
├── server/                     # Express + TypeScript Backend
│   ├── src/
│   │   ├── config/             # DB Connection & Mock fallback logic
│   │   ├── controllers/        # Auth, Jobs, AI, Exam, Discussion, Recommendation
│   │   ├── db/                 # Seed & Mock database
│   │   ├── middleware/         # Auth & Role-based Access Control (RBAC)
│   │   ├── models/             # Mongoose Models (User, Job, Application, Interview)
│   │   ├── routes/             # REST API routes (`api.ts`)
│   │   └── utils/              # Winston Logger & helpers
│   ├── Dockerfile              # Multi-stage production container build
│   ├── .dockerignore
│   ├── .env.example            # Template for environment configuration
│   └── package.json
├── docker-compose.yml          # Container orchestration (Frontend + Backend + DB)
├── package.json                # Root package for workspace scripts
└── README.md                   # Complete documentation
```

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
