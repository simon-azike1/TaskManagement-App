const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const notesRoutes = require('./routes/notes');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/usersRoutes');

require('dotenv').config();

const app = express();
const isDevelopment = process.env.NODE_ENV !== 'production';

const CONFIG = {
  development: {
    port: 5000,
    frontendUrl: 'http://localhost:5173',
    corsOrigins: ['http://localhost:5173', 'http://localhost:3000']
  },
  production: {
    port: process.env.PORT || 10000,
    frontendUrl: process.env.FRONTEND_URL || 'https://task-management-app-omega-flax.vercel.app',
    corsOrigins: [
      process.env.FRONTEND_URL,
      process.env.CORS_ORIGIN
    ]
  }
};

const currentConfig = isDevelopment ? CONFIG.development : CONFIG.production;

// Validate environment variables
['MONGODB_URI', 'JWT_SECRET'].forEach(envVar => {
  if (!process.env[envVar]) {
    console.error(`❌ Missing environment variable: ${envVar}`);
    process.exit(1);
  }
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}, DB: ${conn.connection.name}`);
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
};
connectDB();

// Security middleware - Configure helmet to allow CORS
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// ✅ CORS setup - MUST come before rate limiting and body parser
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);

    if (currentConfig.corsOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`❌ CORS blocked: ${origin}`);
      callback(new Error(`CORS not allowed for origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Handle preflight requests explicitly
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.sendStatus(204);
  }
  next();
});

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting - Come after CORS
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, try again later.' }
}));

// Auth rate limiting - More lenient in development
app.use('/api/auth/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDevelopment ? 50 : 10,
  message: { success: false, message: 'Too many authentication attempts, try again later.' }
}));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin || 'No origin'}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/users', userRoutes);


// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    environment: process.env.NODE_ENV || 'development',
    frontend: currentConfig.frontendUrl,
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({ message: '🚀 Task Manager API', environment: process.env.NODE_ENV || 'development' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.message);
  res.status(500).json({ success: false, message: err.message, timestamp: new Date().toISOString() });
});

// 404 handler - MUST be last
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found', timestamp: new Date().toISOString() });
});

const PORT = currentConfig.port;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Frontend URL: ${currentConfig.frontendUrl}`);
  console.log(`CORS Origins: ${currentConfig.corsOrigins.join(', ')}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});