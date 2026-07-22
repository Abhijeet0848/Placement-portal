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

  // FORCE the exact raw Atlas connection string to completely bypass Vercel DNS SRV lookup timeouts
  const mongoUri = 'mongodb://gautamabhijeet050_db_user:YrHVtolXoqDopbtt@ac-fyfcr30-shard-00-00.pt91ykf.mongodb.net:27017,ac-fyfcr30-shard-00-01.pt91ykf.mongodb.net:27017,ac-fyfcr30-shard-00-02.pt91ykf.mongodb.net:27017/test?ssl=true&replicaSet=atlas-v09m31-shard-0&authSource=admin&retryWrites=true&w=majority';

  logger.info(`Connecting to MongoDB using explicitly hardcoded raw Atlas string...`);

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
