import express from 'express';
import cors from 'cors';
import rfpRoutes from '../backend/src/routes/rfp.routes.js';
import vendorRoutes from '../backend/src/routes/vendor.routes.js';
import proposalRoutes from '../backend/src/routes/proposal.routes.js';

/**
 * Express app for Vercel serverless deployment
 */
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/rfps', rfpRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/proposals', proposalRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'AI RFP Manager API is running' });
});

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'AI RFP Manager API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found', path: req.path });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

export default app;
