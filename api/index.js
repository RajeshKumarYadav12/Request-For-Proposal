import mongoose from 'mongoose';
import app from './server.js';

/**
 * Vercel serverless function handler
 */

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  try {
    await mongoose.connect(mongoUri);
    isConnected = true;
    console.log('✓ Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export default async function handler(req, res) {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}
