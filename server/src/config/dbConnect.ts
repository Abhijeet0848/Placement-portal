import mongoose from 'mongoose';
import logger from '../utils/logger';

export let isMockDb = false;

// Global cache for serverless environments
let isConnected = false;

export async function connectDB() {
  if (isConnected) {
    logger.info('Using cached MongoDB connection');
    return;
  }

  // Using the user's provided Atlas connection string as fallback if env var is missing
  // Removing /Smart-placement so it defaults to the 'test' database where their data is
  const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://gautamabhijeet050_db_user:YrHVtolXoqDopbtt@cluster0.pt91ykf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

  if (!process.env.MONGODB_URI) {
    logger.warn('No MONGODB_URI found in environment variables. Using the hardcoded Atlas fallback.');
  }

  try {
    logger.info('Attempting to connect to MongoDB...');
    const db = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
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
