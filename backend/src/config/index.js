import dotenv from 'dotenv';

dotenv.config();

/**
 * Central configuration object for the application.
 * All environment variables are loaded here.
 */
export const config = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/ai_rfp_manager',
  
  // Email sending (SMTP)
  email: {
    smtp: {
      host: process.env.EMAIL_SMTP_HOST,
      port: parseInt(process.env.EMAIL_SMTP_PORT || '587'),
      user: process.env.EMAIL_SMTP_USER,
      pass: process.env.EMAIL_SMTP_PASS,
    },
    from: process.env.EMAIL_FROM || 'RFP Manager <no-reply@example.com>',
  },
  
  // Email receiving (IMAP)
  imap: {
    host: process.env.IMAP_HOST,
    port: parseInt(process.env.IMAP_PORT || '993'),
    user: process.env.IMAP_USER,
    pass: process.env.IMAP_PASS,
  },
  
  // AI provider
  ai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  },
  
  logLevel: process.env.LOG_LEVEL || 'info',
};
