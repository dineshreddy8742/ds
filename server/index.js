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
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://dailsmart.in',
  'https://www.dailsmart.in'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow same-origin requests (origin is undefined) or allowed origins
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked for origin: ${origin}`);
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

// =====================================================
// Path Rewrite & API Versioning
// =====================================================

// Handle /api prefix universally for Vercel/Local consistency
app.use((req, res, next) => {
  if (req.url.startsWith('/api')) {
    req.url = req.url.substring(4) || '/';
  }
  next();
});

// =====================================================
// Routes
// =====================================================

// Health checks
app.get(['/health', '/status'], async (req, res) => {
  const status = {
    server: 'ONLINE',
    environment: process.env.NODE_ENV || 'production',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  };

  try {
    if (supabaseServer) {
        const { error } = await supabaseServer.from('colleges').select('count', { count: 'exact', head: true });
        status.database = error ? `ERROR: ${error.message}` : 'CONNECTED';
    } else {
        status.database = 'NOT_INITIALIZED (Check Env Vars)';
    }
  } catch (e) {
    status.database = `INIT_FAILED: ${e.message}`;
  }
  
  res.json(status);
});

// Mounted API routes (Auth handled by Supabase)
app.use('/leads', leadsRouter);
app.use('/colleges', collegesRouter);
app.use('/upload', uploadRouter);
app.use('/sync', syncRouter);
app.use('/audit', auditRouter);
app.use('/inquiries', inquiryRouter);
app.use('/messages', messagesRouter);


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
