# Smart Placement Portal 🚀

An end-to-end, AI-powered campus recruitment and placement management platform built with React, Node.js, and Google Gemini AI.

![Dashboard Preview](https://via.placeholder.com/1200x600?text=Smart+Placement+Portal+UI)

## 🌟 Overview

The Smart Placement Portal is a comprehensive solution designed to bridge the gap between universities, students, and corporate recruiters. It automates the entire placement lifecycle—from student skill assessment and resume building to recruiter job postings, AI-driven candidate shortlisting, and placement officer analytics.

By deeply integrating **Google Gemini AI**, the platform offers unprecedented intelligent features like automated resume analysis, mock technical interviews, AI-generated job descriptions, and precision job-matching algorithms.

## ✨ Core Journeys & Features

### 🎓 Student Journey
Empowering students to put their best foot forward.
1. **Intelligent Profiling:** Complete your profile and upload your resume.
2. **AI Resume Analysis:** Get instant ATS scoring, formatting suggestions, and missing keyword alerts.
3. **Smart Job Matching:** Discover jobs matched perfectly to your skill set and CGPA.
4. **Skill Assessments & Coding Tests:** Take platform-native coding tests and multi-stage skill assessments.
5. **AI Mock Interviews:** Practice with Gemini-powered dynamic technical and HR interviews, complete with real-time feedback.
6. **Career Roadmap:** Receive an AI-generated personalized career progression path based on current market trends.

### 🏢 Recruiter Journey
Streamlining the hiring pipeline for corporate partners.
1. **Company Branding:** Setup a verified company profile.
2. **AI Job Creator:** Instantly generate complete, professional Job Descriptions based on a single role title using Gemini.
3. **Automated Screening:** Set eligibility rules (CGPA, branches, experience) to automatically filter the talent pool.
4. **AI Resume Ranking:** View applications sorted by AI Match Score, complete with automated resume summaries.
5. **Outreach & Offers:** Use the AI Email Generator to instantly draft context-aware interview invitations and offer letters.

### 🛡️ Placement Officer Journey
Command center for university placement coordinators.
1. **Drive Management:** Create and track placement drives across four distinct phases (Eligible Students, Tests, Interviews, Offers).
2. **Recruiter Verification:** A dedicated dashboard to explicitly approve or reject incoming company registrations.
3. **Eligibility Engine:** Define campus-wide rules (Minimum CGPA, allowed branches, target semester, maximum backlogs).
4. **Certificate Auditing:** Verify and approve external student certifications (NPTEL, Coursera).
5. **Advanced Analytics:** A powerful reporting dashboard visualizing placement rates, average/highest packages, branch-wise metrics, and company distributions.

## 🛠️ Technology Stack

- **Frontend:** React (Vite), TypeScript, Tailwind CSS, Recharts, Lucide Icons.
- **Backend:** Node.js, Express, MongoDB (Mongoose).
- **AI Integration:** Google Gemini AI API (`@google/generative-ai`).
- **Architecture:** Role-based access control (Student, Recruiter, PlacementOfficer, Admin).

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB instance (local or Atlas)
- Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/smart-placement-portal.git
   cd "smart-placement-portal"
   ```

2. **Setup the Backend:**
   ```bash
   cd server
   npm install
   
   # Create a .env file and add your credentials
   echo "PORT=5000" > .env
   echo "MONGODB_URI=your_mongodb_connection_string" >> .env
   echo "GEMINI_API_KEY=your_gemini_api_key" >> .env
   echo "JWT_SECRET=your_jwt_secret" >> .env
   
   # Start the server (Development)
   npm run dev
   ```

3. **Setup the Frontend:**
   ```bash
   # Open a new terminal
   cd client
   npm install
   
   # Start the React application
   npm run dev
   ```

4. **Access the Portal:**
   Open `http://localhost:5173` in your browser.

## 🤖 AI Fallback Architecture
To ensure maximum reliability while utilizing free-tier AI endpoints, the platform implements **Graceful AI Fallbacks**. If the API encounters rate-limits or network errors, the system automatically injects high-quality, pre-defined templates (for JDs, emails, or mock questions) to ensure the user experience is never interrupted.

## 📄 License
This project is licensed under the MIT License.
