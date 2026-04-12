import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { supabaseServer } from './supabase.js';
import { errorHandler, notFoundHandler } from './middleware/error.js';

// Import routes
import leadsRouter from './routes/leads.js';
import collegesRouter from './routes/colleges.js';
import uploadRouter from './routes/upload.js';
import syncRouter from './routes/sync.js';
import auditRouter from './routes/audit.js';
import inquiryRouter from './routes/inquiry.js';
import messagesRouter from './routes/messages.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// =====================================================
// Security & Middleware Setup
// =====================================================

// Helmet for security headers
app.use(helmet());

// CORS configuration
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map(origin => origin.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// HTTP request logging
app.use(morgan('dev'));

// =====================================================
// Rate Limiting
// =====================================================

const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 500,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX) || 20,
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply general rate limiter to all routes
app.use(generalLimiter);

// =====================================================
// Health Check Endpoint
// =====================================================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// =====================================================
// Routes
// =====================================================

// Auth routes will be handled by Supabase client directly from frontend
// No need for custom auth endpoints

// API routes (require authentication via middleware)
const apiPrefixes = ['/api', ''];
apiPrefixes.forEach(prefix => {
  app.use(`${prefix}/leads`, leadsRouter);
  app.use(`${prefix}/colleges`, collegesRouter);
  app.use(`${prefix}/upload`, uploadRouter);
  app.use(`${prefix}/sync`, syncRouter);
  app.use(`${prefix}/audit`, auditRouter);
  app.use(`${prefix}/inquiries`, inquiryRouter);
  app.use(`${prefix}/messages`, messagesRouter);
});

// Database Health & Neural Pulse Pulse
app.get('/api/status', async (req, res) => {
  const status = {
    server: 'ONLINE',
    port: PORT,
    supabase_url: process.env.SUPABASE_URL?.substring(0, 15) + '...',
    supabase_service_key_set: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    timestamp: new Date().toISOString()
  };

  try {
    const { data, error } = await supabaseServer.from('colleges').select('count', { count: 'exact', head: true });
    status.supabase_connection = error ? `ERROR: ${error.message}` : '✅ CONFIGURED & REACHABLE';
    status.node_count = data || 0;
  } catch (e) {
    status.supabase_connection = `💥 CRASH: ${e.message}`;
  }

  res.json(status);
});

// =====================================================
// Error Handling
// =====================================================

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// =====================================================
// Start Server
// =====================================================

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`
  ╔══════════════════════════════════════════════════════════╗
  ║                                                          ║
  ║   🚀 DialSmart Backend Server                            ║
  ║   📡 Running on: http://localhost:${PORT}                 ║
  ║   🌍 Environment: ${process.env.NODE_ENV || 'development'}                           ║
  ║   ⚡ Health check: http://localhost:${PORT}/api/health   ║
  ║                                                          ║
  ╚══════════════════════════════════════════════════════════╝
    `);
  });
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

export default app;
