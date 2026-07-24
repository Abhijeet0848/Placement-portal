# SMART PLACEMENT PORTAL
## Complete Project Documentation

---

## 1. ABSTRACT
The **Smart Placement Portal** is an advanced, AI-powered campus recruitment system designed to bridge the gap between educational institutes, students, and corporate recruiters. Built using the modern MERN stack (MongoDB, Express.js, React 19, Node.js) and supercharged with Google's Gemini AI, the platform revolutionizes traditional placement drives. It automates resume parsing, conducts AI-driven mock interviews, facilitates semantic job matching, and provides real-time placement analytics. By decentralizing operations into four distinct portals (Student, Recruiter, Placement Officer, and Admin), the system ensures a streamlined, secure, and highly efficient hiring lifecycle.

---

## 2. INTRODUCTION
### 2.1 Background
Traditional campus recruitment processes are plagued by manual inefficiencies. Placement cells struggle with managing thousands of resumes, verifying student eligibility, and coordinating interview schedules. Concurrently, students often lack targeted feedback on their resumes and interview skills. Recruiters spend countless hours filtering unqualified applications. 

### 2.2 Objective
The objective of the Smart Placement Portal is to digitize and automate the entire campus recruitment workflow. The platform aims to:
- Empower students with AI-generated feedback to improve their employability.
- Enable recruiters to instantly shortlist candidates using semantic AI matching.
- Provide Placement Officers with real-time analytics and automated verification tools.
- Ensure enterprise-grade security for all sensitive user data.

---

## 3. SYSTEM ARCHITECTURE
The system is built on a robust Client-Server architecture utilizing the MERN stack.

### 3.1 Frontend Architecture (Client Tier)
- **Framework**: React 19 using TypeScript for strict type safety.
- **State Management**: React Context API.
- **Styling**: Tailwind CSS for responsive, mobile-first utility classes.
- **Routing**: React Router DOM (v6+) with protected layouts.
- **Real-Time Communication**: Socket.io-client for instant notifications.

### 3.2 Backend Architecture (Server Tier)
- **Environment**: Node.js runtime.
- **Framework**: Express.js RESTful API architecture.
- **Real-Time Engine**: Socket.io for WebSocket connections.
- **AI Integration**: `@google/genai` SDK for interacting with Gemini.
- **File Handling**: Multer for memory-storage uploads (resumes, avatars).

### 3.3 Database Layer (Data Tier)
- **Database**: MongoDB (Atlas Cloud).
- **ODM**: Mongoose for schema validation, strict typing, and relationship mapping.

---

## 4. MODULES & USER ROLES

### 4.1 Student Module
The student portal focuses on employability enhancement and application tracking.
- **AI Resume Analyzer**: Students upload their PDF resumes. The system uses `pdf-parse` to extract text and feeds it to Gemini AI, returning an ATS score, missing skills, and grammatical corrections.
- **Job Matching Engine**: Students can evaluate their profile against specific job descriptions to receive a match percentage.
- **Mock Interviews**: An interactive AI engine simulates technical and HR interviews, evaluating the student's confidence and technical accuracy in real-time.
- **Coding Lab**: Students can practice algorithmic challenges with automated test case evaluation.
- **Career Roadmap**: AI generates tailored progression roadmaps based on the student's CGPA, branch, and current skills.
- **Application Tracker**: Visual timeline tracking application status from "Applied" to "Hired/Rejected".

### 4.2 Recruiter Module
Designed for corporate HRs to source talent efficiently.
- **Job Creator**: Recruiters post job listings with strict eligibility criteria (e.g., Min CGPA 7.5, B.Tech CSE only).
- **AI Resume Ranking**: Automatically ranks all applicants based on their semantic fit with the job description.
- **Candidate Shortlisting**: Kan-ban style dashboard to move candidates through the hiring pipeline.
- **Live Scheduler**: Integrated calendar system to propose and confirm interview slots with students.
- **Automated Communication**: One-click bulk email dispatch (via Nodemailer) for selection or rejection notices.

### 4.3 Placement Officer Module
Built for college administration to oversee the drive.
- **Verification Dashboard**: Approve or reject student profiles and uploaded marksheets.
- **Rules Engine**: Configure global college rules (e.g., maximum 2 active backlogs allowed for placements).
- **Notice Board**: Broadcast urgent announcements to all students via WebSockets.
- **Placement Analytics**: Interactive `Recharts` graphs displaying department-wise placement ratios, average packages, and top recruiters.

### 4.4 Admin Module
The core control center for system maintenance.
- **User Management**: Activate, deactivate, or delete any user account in the system.
- **Role-Based Access Control (RBAC) Management**: Dynamically edit permissions for different roles.
- **Audit Logs**: View a historical ledger of all sensitive actions performed in the system.
- **Database Backup & Restore**: Instantly generate JSON dumps of the MongoDB database and restore them for disaster recovery testing.

---

## 5. ENTERPRISE-GRADE SECURITY IMPLEMENTATION
The platform is fully compliant with the OWASP Top 10 security standards, ensuring absolute protection of student and corporate data.

### 5.1 Authentication & Authorization
- **Stateless JWT**: Uses JSON Web Tokens with separated Access (1d) and Refresh (7d) tokens.
- **Password Cryptography**: All passwords are salted and hashed using `bcryptjs` (10-round work factor).
- **Blacklisted Tokens**: Upon logout, JWTs are pushed to a `BlacklistedToken` MongoDB collection, immediately invalidating them and preventing replay attacks.
- **Strict RBAC**: Custom `requireRole(['Admin'])` Express middlewares ensure vertical privilege separation.

### 5.2 Protection Against Common Vulnerabilities
- **NoSQL Injection**: Blocked using `express-mongo-sanitize`, which actively strips or rejects malformed JSON payloads containing query operators (`$gt`, `$set`).
- **Cross-Site Scripting (XSS)**: Mitigated natively by React's DOM auto-escaping. File uploads are strictly verified by MIME type to prevent malicious script uploads.
- **Brute Force Attacks**: Mitigated using `express-rate-limit`, permanently blocking IPs after 5 failed authentication attempts within a 15-minute window.
- **Information Leakage**: The global error handler intercepts all `500 Internal Server Errors`, logging the stack trace privately while returning a generic `Something went wrong` message to the client.

### 5.3 HTTP Security Headers
The application utilizes `helmet.js` to automatically configure:
- `Strict-Transport-Security` (HSTS) ensuring forced HTTPS connections.
- `X-Frame-Options` to prevent Clickjacking.
- `X-Content-Type-Options: nosniff` to prevent MIME-sniffing.

---

## 6. AI INTEGRATION CAPABILITIES
The platform heavily relies on Google's **Gemini Generative AI** to automate complex tasks that historically required human intervention.

### 6.1 System Prompts & Context Windows
The backend structures precise prompts to Gemini, providing it with the exact JSON schema required for the response. 
- Example: When generating a Mock Interview, the AI is prompted with the student's tech stack and the target job role, instructed to act as a Senior Technical Recruiter, and forced to return the questions in a parsable JSON array.

### 6.2 Data Privacy
Resume text extracted via `pdf-parse` is securely transmitted to the Gemini API over TLS. No user data is permanently stored in the AI models, ensuring compliance with academic privacy standards.

---

## 7. DATABASE SCHEMA DESIGN
The MongoDB database is normalized for efficiency but utilizes embedding where appropriate for read-heavy operations.

### 7.1 Key Collections
1. **Users**: Stores unified credentials (email, hashed password, role, verification status). Contains embedded schemas for Student Profiles, Recruiter Company details, etc.
2. **Jobs**: Stores job postings, linking to the `User` (Recruiter) who posted it via `ObjectId`.
3. **Applications**: A junction collection linking a Student `ObjectId` to a Job `ObjectId`, tracking the application status (`applied`, `shortlisted`, `rejected`, `hired`).
4. **Exams & Submissions**: Stores coding challenges and multiple-choice questions, linking student submissions and automated scores.
5. **Permissions & Logs**: Stores RBAC configurations and security audit trails.

---

## 8. TESTING & QUALITY ASSURANCE
The application was subjected to a rigorous security and functional testing pipeline.
- **Dependency Scanning**: Routine execution of `npm audit fix --force` maintaining 0 known vulnerabilities.
- **API Security Testing**: Verified using automated cURL and Postman scripts to confirm 401/403 responses for unauthorized access attempts.
- **Input Validation Testing**: Confirmed rejection of malformed data across all endpoints (e.g., negative salaries, invalid phone formats).

---

## 9. FUTURE SCOPE
While the current portal is highly advanced, future iterations may include:
1. **Video Proctoring**: Integrating WebRTC and AI eye-tracking for cheat-proof online exams.
2. **Blockchain Verification**: Issuing digital offer letters and certificates on a blockchain ledger to prevent forgery.
3. **Mobile Application**: A dedicated React Native mobile application for push notifications and on-the-go access.

---

## 10. CONCLUSION
The Smart Placement Portal represents a massive leap forward in campus recruitment technology. By marrying a highly secure, scalable MERN stack backend with the cognitive capabilities of Generative AI, the system removes administrative bottlenecks, empowers students, and provides recruiters with pinpoint accuracy in hiring. It is a robust, production-ready solution capable of handling the high-concurrency demands of modern placement drives.
