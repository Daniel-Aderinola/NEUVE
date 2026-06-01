import dotenv from 'dotenv';
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET', 'MONGODB_URI', 'CLIENT_URL'];
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`❌ Missing required environment variable: ${varName}`);
    process.exit(1);
  }
});

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import categoryRoutes from './routes/categoryRoutes';
import cartRoutes from './routes/cartRoutes';
import orderRoutes from './routes/orderRoutes';
import { errorHandler, notFound } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimiter';

const app = express();

// Connect to database
connectDB();

// Middleware
// Enhanced security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));

// CORS - Strict whitelist
const allowedOrigins = [
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS: Origin not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // 24 hours
}));

// Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(cookieParser());

// Stripe webhook needs raw body (must be before JSON parser)
app.use('/api/orders/webhook', express.raw({ type: 'application/json' }));

// Parse JSON with size limit
app.use(express.json({ limit: '10kb' })); // Reduced from 10mb
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Apply rate limiting to all API routes
app.use('/api/', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = parseInt(process.env.PORT || '5000', 10);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

export default app;
