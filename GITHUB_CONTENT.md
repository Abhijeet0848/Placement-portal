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

## 🌐 Production Deployment

### Frontend (Vercel)
1. Push to GitHub
2. Import to Vercel
3. Set Root Directory: `client`
4. Add env: `VITE_API_URL=https://your-backend-api.onrender.com/api`

### Backend (Render/Railway)
1. Create Web Service
2. Set Root Directory: `server`
3. Add env vars: `MONGODB_URI`, `JWT_SECRET`, `GEMINI_API_KEY`, `CLIENT_ORIGIN`

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

### 🔒 Security & Authentication
- JWT Access + Refresh Token mechanism
- Bcrypt password hashing
- Role-Based Access Control (RBAC)
- Helmet.js security headers
- Express Rate Limiter
- Zod input validation

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

## 📝 Environment Variables

### Server (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-placement
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret
GEMINI_API_KEY=your_google_gemini_api_key
CLIENT_ORIGIN=http://localhost:5173
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Client (.env)
```env
VITE_API_URL=http://localhost:5000/api
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

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@your-username](https://github.com/your-username)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/your-profile)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- [React](https://react.dev/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Google Gemini AI](https://ai.google.dev/) - AI capabilities
- [MongoDB](https://www.mongodb.com/) - Database
- [Socket.io](https://socket.io/) - Real-time communication
- All contributors and testers

---

## 📞 Support

For support, email your.email@example.com or open an issue in the GitHub repository.

---

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced analytics with ML predictions
- [ ] Video interview integration
- [ ] Multi-language support (i18n)
- [ ] Blockchain certificate verification
- [ ] Integration with LinkedIn/Indeed job APIs
- [ ] Advanced chatbot for career guidance
- [ ] Peer-to-peer mentorship matching

---

## ⭐ Star History

If you find this project useful, please consider giving it a star!

[![Star History Chart](https://api.star-history.com/svg?repos=your-username/smart-placement-portal&type=Date)](https://star-history.com/#your-username/smart-placement-portal&Date)

---

## 📊 GitHub Stats

![GitHub Stats](https://github-readme-stats.vercel.app/api?username=your-username&show_icons=true&theme=radical)

![Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=your-username&layout=compact&theme=radical)

---

**Built with ❤️ for students and recruiters worldwide**