import mongoose from 'mongoose';
import app from './app.js';
import { config } from './config/index.js';

/**
 * Connect to MongoDB and start the Express server.
 */
const startServer = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoUri);
    console.log('✓ Connected to MongoDB');

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

startServer();
