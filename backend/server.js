const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const notesRoutes = require('./routes/notes');

// Load .env for local development
require('dotenv').config();

const app = express();

// Smart environment detection
const isDevelopment = process.env.NODE_ENV !== 'production';
const isProduction = process.env.NODE_ENV === 'production';

// Smart configuration based on environment
const CONFIG = {
  development: {
    port: 5000,
    frontendUrl: 'http://localhost:5173',
    corsOrigins: [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5000'
    ]
  },
  production: {
    port: process.env.PORT || 10000,
    frontendUrl: 'https://task-management-app-omega-flax.vercel.app',
    corsOrigins: [
      'https://task-management-app-omega-flax.vercel.app',
      process.env.FRONTEND_URL,
      process.env.CORS_ORIGIN
    ]
  }
};

const currentConfig = isDevelopment ? CONFIG.development : CONFIG.production;

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars);
  process.exit(1);
}

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    console.log('📍 MongoDB URI:', process.env.MONGODB_URI ? 'Set ✅' : 'Missing ❌');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`📊 Host: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

connectDB();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Smart CORS Configuration
app.use(cors({
  origin: currentConfig.corsOrigins.filter(Boolean), // Remove null/undefined values
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
    port: currentConfig.port,
    frontend: currentConfig.frontendUrl,
    cors: {
      allowedOrigins: currentConfig.corsOrigins
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
    frontend: currentConfig.frontendUrl,
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

const PORT = currentConfig.port;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Task Manager API Server Started!`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
  console.log(`🔗 Frontend URL: ${currentConfig.frontendUrl}`);
  console.log(`📋 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📖 API Docs: http://localhost:${PORT}/api`);
  
  console.log(`\n📋 Configuration:`);
  console.log(`   Environment: ${isDevelopment ? 'Development 🔧' : 'Production 🚀'}`);
  console.log(`   Port: ${PORT}`);
  console.log(`   Frontend: ${currentConfig.frontendUrl}`);
  console.log(`   CORS Origins: ${currentConfig.corsOrigins.length} configured`);
  
  console.log(`\n📋 Environment Variables Status:`);
  console.log(`   MONGODB_URI: ${process.env.MONGODB_URI ? '✅ Set' : '❌ Missing'}`);
  console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Set' : '⚠️  Missing'}`);
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  
  console.log(`\n🎯 Ready to accept requests!\n`);
});
