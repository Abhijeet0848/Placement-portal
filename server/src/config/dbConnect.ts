import mongoose from 'mongoose';
import logger from '../utils/logger';

export let isMockDb = false;

export async function connectDB() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/Smart-placement';

  if (!process.env.MONGODB_URI) {
    logger.warn('No MONGODB_URI found in environment variables. Using the local MongoDB URI fallback.');
  }

  try {
    logger.info('Attempting to connect to MongoDB...');
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    logger.info('Successfully connected to MongoDB database.');
    isMockDb = false;
  } catch (error: any) {
    logger.error(`Failed to connect to MongoDB: ${error?.message || error}`);
    logger.warn('Failed MongoDB connection. Falling back to local in-memory Mock DB.');
    isMockDb = true;
  }
}
