import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { connectDB, isMockDb } from './config/dbConnect';
import router from './routes/api';
import logger from './utils/logger';
import mongoSanitize from 'express-mongo-sanitize';
import Exam from './models/Exam';

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// Configure Socket.io
const io = new Server(server, {
  cors: {
    origin: clientOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Real-time notification broadcast helper
app.set('socketio', io);

io.on('connection', (socket) => {
  logger.info(`Socket client connected: ${socket.id}`);
  
  socket.on('join_room', (userId) => {
    socket.join(userId);
    logger.info(`User ${userId} joined their notification room.`);
  });

  socket.on('disconnect', () => {
    logger.info(`Socket client disconnected: ${socket.id}`);
  });
});

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: false // Allows loading local uploads if needed
}));
app.use(cors({
  origin: clientOrigin,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Sanitize data against NoSQL Query Injection (and explicitly reject malformed input)
app.use(mongoSanitize({
  onSanitize: ({ req, key }) => {
    const err: any = new Error('Invalid input');
    err.status = 400;
    throw err;
  }
}));

// Rate limiting (Prevent DDoS / Brute Force)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests from this IP, please try again after 15 minutes.' }
});
app.use('/api/', limiter);

// Mount API routes
app.use('/api', router);

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    database: isMockDb ? 'Mock In-Memory DB' : 'MongoDB Atlas',
    time: new Date()
  });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Always log the detailed error safely on the server
  logger.error(`Express error handler: ${err?.message || err}`);
  
  const status = err?.status || 500;
  
  // Only send specific error messages for 4xx client errors (like 400 Bad Request).
  // For 500 Internal Server errors (like MongoDB crashes), mask the message.
  const isClientError = status >= 400 && status < 500;
  const message = isClientError ? (err?.message || 'Bad Request') : 'Something went wrong.';

  res.status(status).json({ message });
});

// Start Server
const PORT = process.env.PORT || 5000;

async function bootstrap() {
  // Connect to Database (real or fallback)
  await connectDB();

  // If using real MongoDB, we will no longer seed initial exam questions.

  server.listen(PORT, () => {
    logger.info(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

bootstrap();
