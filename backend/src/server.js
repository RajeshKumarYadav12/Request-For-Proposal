import mongoose from 'mongoose';
import app from './app.js';
import { config } from './config/index.js';

/**
 * Connect to MongoDB and start the Express server.
 */

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(config.mongoUri);
    isConnected = true;
    console.log('✓ Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

const startServer = async () => {
  try {
    await connectDB();

    // Start Express server
    app.listen(config.port, () => {
      console.log(`✓ Server running on port ${config.port}`);
      console.log(`  Environment: ${config.nodeEnv}`);
      console.log(`  Health check: http://localhost:${config.port}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// For Vercel serverless
export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}

// For local development
if (process.env.NODE_ENV !== 'production') {
  startServer();
}
