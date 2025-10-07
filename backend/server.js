const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const notesRoutes = require('./routes/notes');

// Always load .env for local development
require('dotenv').config();

const app = express();

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars);
  console.error('📝 Please check your .env file');
  console.error('🔍 Available env vars:', Object.keys(process.env).filter(key => 
    key.includes('MONGO') || key.includes('JWT') || key.includes('FRONTEND') || key.includes('CORS')
  ));
  process.exit(1);
}

// Connect to MongoDB (FIXED - removed deprecated options)
const connectDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    console.log('📍 MongoDB URI:', process.env.MONGODB_URI ? 'Set ✅' : 'Missing ❌');
    
    // ✅ Removed deprecated useNewUrlParser and useUnifiedTopology
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`📊 Host: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS Configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://task-management-app-omega-flax.vercel.app', // ✅ Your correct frontend URL
    process.env.FRONTEND_URL,
    process.env.CORS_ORIGIN
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Enhanced request logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const origin = req.headers.origin || 'No origin';
  console.log(`${timestamp} - ${req.method} ${req.path} - Origin: ${origin}`);
  next();
});

// Routes
app.use('/api/notes', notesRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Task Manager API is running',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000,
    cors: {
      allowedOrigins: [
        'http://localhost:3000',
        'https://task-management-app-omega-flax.vercel.app'
      ]
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 Task Manager API',
    status: 'Running',
    database: mongoose.connection.readyState === 1 ? 'Connected ✅' : 'Disconnected ❌',
    environment: process.env.NODE_ENV || 'development',
    frontend: process.env.FRONTEND_URL || 'http://localhost:3000',
    endpoints: {
      health: '/api/health',
      notes: '/api/notes',
      documentation: '/api'
    }
  });
});

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Task Manager API Documentation',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'Connected ✅' : 'Disconnected ❌',
    endpoints: {
      'GET /': 'API information',
      'GET /api/health': 'Health check',
      'GET /api/notes': 'Get all tasks',
      'POST /api/notes': 'Create new task',
      'GET /api/notes/:id': 'Get specific task',
      'PUT /api/notes/:id': 'Update task',
      'DELETE /api/notes/:id': 'Delete task',
      'PATCH /api/notes/:id/toggle': 'Toggle task completion'
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.message);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 handler
app.use((req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    availableEndpoints: ['/api/health', '/api/notes', '/api'],
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Task Manager API Server Started!`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`📋 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📖 API Docs: http://localhost:${PORT}/api`);
  
  // Debug environment variables
  console.log(`\n📋 Environment Variables Status:`);
  console.log(`   MONGODB_URI: ${process.env.MONGODB_URI ? '✅ Set' : '❌ Missing'}`);
  console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Set' : '⚠️  Missing'}`);
  console.log(`   FRONTEND_URL: ${process.env.FRONTEND_URL ? '✅ Set' : '⚠️  Using default'}`);
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   PORT: ${PORT}`);
  
  console.log(`\n🎯 Ready to accept requests!\n`);
});
