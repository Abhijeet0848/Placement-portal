import mongoose from 'mongoose';
import logger from '../utils/logger';

export let isMockDb = false;

// Disable Mongoose buffering globally to prevent Vercel 504 Gateway Timeouts
mongoose.set('bufferCommands', false);

// Global cache for serverless environments
let isConnected = false;

export async function connectDB() {
  if (isConnected) {
    logger.info('Using cached MongoDB connection');
    return;
  }

  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/placement';

  logger.info(`Connecting to MongoDB Atlas cluster...`);

  try {
    logger.info('Attempting to connect to MongoDB...');
    const db = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferCommands: false,  // Do not hang the Vercel function if connection drops
    });
    
    isConnected = db.connections[0].readyState === 1;
    logger.info('Successfully connected to MongoDB database.');
    isMockDb = false;
  } catch (error: any) {
    logger.error(`Failed to connect to MongoDB: ${error?.message || error}`);
    logger.warn('Failed MongoDB connection. Falling back to local in-memory Mock DB.');
    isMockDb = true;
  }
}
