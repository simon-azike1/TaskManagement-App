// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');
const userRoutes = require('./routes/usersRoutes');

const app = express();

// ===== Environment & Config =====
const isDevelopment = process.env.NODE_ENV !== 'production';

const CONFIG = {
  development: {
    port: process.env.PORT || 10000, // ✅ Changed from 5000 to 10000
    frontendUrl: 'http://localhost:5173',
    corsOrigins: [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000'
    ]
  },
  production: {
    port: process.env.PORT || 10000, // ✅ Changed from 1000 to 10000
    frontendUrl: process.env.FRONTEND_URL || 'https://task-management-app-omega-flax.vercel.app',
    corsOrigins: [
      process.env.FRONTEND_URL,
      process.env.CORS_ORIGIN,
      'https://task-management-app-omega-flax.vercel.app',
      'http://localhost:5173', // ✅ Added for local testing with production DB
      'http://localhost:3000'
    ].filter(Boolean) // Remove undefined/null values
  }
};

const currentConfig = isDevelopment ? CONFIG.development : CONFIG.production;

// ===== Trust Proxy (Render / Vercel) =====
app.set('trust proxy', 1); // important for express-rate-limit behind a proxy

// ===== MongoDB Connection =====
if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
  console.error('❌ Missing essential environment variables');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
  .then(conn => console.log(`✅ MongoDB Connected: ${conn.connection.host}`))
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

// ===== Security & Middleware =====
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (Postman, mobile apps, server-to-server)
    if (!origin) return callback(null, true);
    
    if (currentConfig.corsOrigins.includes(origin)) {
      console.log(`✅ CORS accepted: ${origin}`);
      return callback(null, true);
    }
    
    console.warn(`❌ CORS blocked: ${origin}`);
    console.warn(`Allowed origins:`, currentConfig.corsOrigins);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly (use regex instead of *)
// app.options(cors(corsOptions));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===== Rate Limiting =====
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: isDevelopment ? 500 : 100, // More lenient in development
  message: { success: false, message: 'Too many requests, try again later.' }
}));

app.use('/api/auth', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDevelopment ? 100 : 10, // More lenient in development
  message: { success: false, message: 'Too many authentication attempts, try again later.' }
}));

// ===== Logging =====
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin || 'No origin'}`);
  next();
});

// ===== Routes =====
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
    corsOrigins: currentConfig.corsOrigins,
    timestamp: new Date().toISOString()
  });
});

// Root
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 Task Manager API', 
    environment: process.env.NODE_ENV || 'development',
    isDevelopment,
    allowedOrigins: currentConfig.corsOrigins
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.message);
  res.status(500).json({ 
    success: false, 
    message: err.message, 
    timestamp: new Date().toISOString() 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found', 
    timestamp: new Date().toISOString() 
  });
});

// ===== Start Server =====
const PORT = currentConfig.port;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'} (isDevelopment: ${isDevelopment})`);
  console.log(`Frontend URL: ${currentConfig.frontendUrl}`);
  console.log(`CORS Origins: ${currentConfig.corsOrigins.join(', ')}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});