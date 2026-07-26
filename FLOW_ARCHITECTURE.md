# Smart Placement Portal - Complete Flow Architecture

This document provides a comprehensive overview of the system architecture, data flow, and user journeys within the **Smart Placement Portal**. It is designed to help developers, stakeholders, and recruiters understand the platform's inner workings.

---

## 1. High-Level System Architecture

The platform follows a robust Client-Server architecture utilizing the MERN stack and Google Gemini AI for advanced intelligent features.

```mermaid
flowchart TD
    %% Client Tier
    subgraph Client Tier [Frontend - React 19]
        UI[User Interface]
        Context[React Context API]
        SocketC[Socket.io Client]
        UI --> Context
        Context --> UI
    end

    %% Server Tier
    subgraph Server Tier [Backend - Node.js & Express]
        API[RESTful APIs]
        Auth[JWT Authentication]
        SocketS[Socket.io Server]
        Uploads[Multer File Handling]
        AI_Controller[Gemini AI Controller]
        
        API --> Auth
        API --> Uploads
        API --> AI_Controller
    end

    %% Data Tier & External Services
    subgraph Data Tier [Database & Cloud]
        MongoDB[(MongoDB Atlas)]
    end
    
    subgraph External Services
        Gemini[Google Gemini AI]
    end

    %% Connections
    UI -- "HTTP Requests (Axios)" --> API
    SocketC -- "WebSockets (Real-time)" <--> SocketS
    Auth -- "Query/Update" --> MongoDB
    Uploads -- "Store Meta" --> MongoDB
    AI_Controller -- "Prompts/Parsing" --> Gemini
```

---

## 2. Core User Journeys

The portal is decentralized into distinct modules for different users, ensuring a streamlined placement lifecycle.

### 2.1 Student Journey Flow
Empowers students with intelligent profiling, AI resume feedback, and automated skill assessments.

```mermaid
flowchart TD
    S([Student]) --> Reg[Register / Login]
    Reg --> Profile[Complete Profile & Upload Resume]
    Profile --> AI_Res[AI Resume Analyzer]
    
    AI_Res -- ATS Score & Feedback --> Dashboard[Student Dashboard]
    
    Dashboard --> Jobs[View & Apply for Jobs]
    Jobs --> AI_Match[AI Job Matching Percentage]
    
    Dashboard --> Prep[Interview Preparation]
    Prep --> Coding[Coding Lab Challenges]
    Prep --> MockInt[AI Mock Interviews]
    
    Dashboard --> Track[Track Application Status]
```

### 2.2 Recruiter Journey Flow
Streamlines the hiring pipeline for corporate partners using AI-driven shortlisting and matching.

```mermaid
flowchart TD
    R([Recruiter]) --> Reg[Register / Login]
    Reg --> Verify[Wait for PO Verification]
    Verify -- Approved --> Dashboard[Recruiter Dashboard]
    
    Dashboard --> PostJob[Create Job Posting]
    PostJob --> AI_JD[AI Generates Job Description]
    
    Dashboard --> Manage[Manage Applications]
    Manage --> AI_Rank[AI Resume Ranking & Shortlisting]
    
    AI_Rank --> Shortlist[Shortlist Candidates]
    Shortlist --> Schedule[Schedule Interviews]
    Schedule --> Email[Automated Email Outreach]
    Email --> Hire[Finalize Hires]
```

### 2.3 Placement Officer (PO) Journey Flow
The command center for university placement coordinators to oversee and regulate the entire drive.

```mermaid
flowchart TD
    PO([Placement Officer]) --> Login[Login]
    Login --> Dashboard[PO Dashboard]
    
    Dashboard --> VerifyReq[Verify Recruiter & Student Profiles]
    VerifyReq -- Approve/Reject --> UpdateStatus[Update System Status]
    
    Dashboard --> Rules[Configure Placement Rules]
    Rules --> Engine[Eligibility Engine]
    
    Dashboard --> Drive[Manage Placement Drives]
    Drive --> Track[Track Drive Phases]
    
    Dashboard --> Analytics[View Advanced Analytics]
    Analytics --> Stats[Placement Ratios, Top Recruiters, Avg Package]
    
    Dashboard --> Notify[Broadcast Urgent Notices via WebSockets]
```

---

## 3. Data Flow & AI Integration Lifecycle

This diagram illustrates how data flows securely through the system when a student uploads a resume and applies for a job, showcasing the Gemini AI integration.

```mermaid
sequenceDiagram
    participant Student
    participant Frontend
    participant Backend
    participant GeminiAI
    participant MongoDB
    
    Student->>Frontend: Uploads Resume (PDF)
    Frontend->>Backend: POST /api/resume/upload
    Backend->>Backend: Parse PDF Text (pdf-parse)
    
    Backend->>GeminiAI: Send extracted text + prompt for analysis
    GeminiAI-->>Backend: Return ATS Score, Missing Skills, Corrections
    
    Backend->>MongoDB: Save Resume Data & AI Feedback
    MongoDB-->>Backend: Success Confirmation
    Backend-->>Frontend: Display AI Feedback to Student
    
    Student->>Frontend: Apply for a Job
    Frontend->>Backend: POST /api/jobs/apply
    Backend->>MongoDB: Fetch Job Description
    
    Backend->>GeminiAI: Compare Resume Text vs Job Description
    GeminiAI-->>Backend: Return Match % and Semantic Fit Summary
    
    Backend->>MongoDB: Save Application with AI Match Score
    Backend-->>Frontend: Application Successful
```

---

## 4. Enterprise-Grade Security Flow

Ensuring absolute protection of student and corporate data is paramount.

```mermaid
graph LR
    Req[Incoming Request] --> RateLimit[Rate Limiting]
    RateLimit --> Headers[Helmet HTTP Headers]
    Headers --> Sanitize[NoSQL Injection Sanitization]
    Sanitize --> Auth[JWT Authentication Validation]
    Auth --> RBAC[Role-Based Access Control]
    RBAC --> Controller[API Controller Logic]
    Controller --> DB[(Database)]
    
    style Req fill:#f9f,stroke:#333,stroke-width:2px
    style DB fill:#ff9,stroke:#333,stroke-width:2px
```

## 5. Technology Stack Summary
* **Frontend**: React 19 (TypeScript), Tailwind CSS, React Router, Recharts
* **Backend**: Node.js, Express.js, Socket.io
* **Database**: MongoDB (Mongoose)
* **AI Integrations**: Google Gemini API (`@google/genai`)
* **Security**: JWT, bcryptjs, Helmet, Express-Rate-Limit, express-mongo-sanitize

---
*Generated for the Smart Placement Portal Project.*
