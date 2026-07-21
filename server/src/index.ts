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
import Exam from './models/Exam';

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

const clientOrigin = process.env.CLIENT_ORIGIN || '*';

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  logger.error(`Express error handler: ${err?.message || err}`);
  res.status(err?.status || 500).json({
    message: err?.message || 'Internal server error occurred.'
  });
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
