const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const notesRoutes = require('./routes/notes');
require('dotenv').config();

const app = express();

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars);
  console.error('📝 Please check your .env file or environment variables');
  process.exit(1);
}

// Connect to MongoDB with better error handling
const connectDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    console.log('📍 MongoDB URI:', process.env.MONGODB_URI ? 'Set ✅' : 'Missing ❌');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`📊 Host: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`📊 Port: ${conn.connection.port}`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error('📝 Error message:', error.message);
    console.error('💡 Check your MONGODB_URI in environment variables');
    console.error('💡 Make sure MongoDB Atlas is set up correctly');
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS Configuration - Your specific URLs
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001', 
    'https://task-management-7mypw0yav-samzik234s-projects.vercel.app',
    'https://task-management-app-omega-flax.vercel.app',
    'https://task-management-samzik234s-projects.vercel.app',
    process.env.FRONTEND_URL,
    process.env.CORS_ORIGIN
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Security headers middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const origin = req.headers.origin || 'No origin';
  console.log(`${timestamp} - ${req.method} ${req.path} - Origin: ${origin}`);
  next();
});

// Routes
app.use('/api/notes', notesRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStatusText = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting'
  };

  res.json({ 
    status: 'OK', 
    message: 'Task Manager API is running successfully',
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatusText[dbStatus] || 'Unknown',
      host: mongoose.connection.host || 'Not connected',
      name: mongoose.connection.name || 'Not connected',
      readyState: dbStatus
    },
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    server: {
      port: process.env.PORT || 5000,
      cors: process.env.CORS_ORIGIN || 'localhost:3000'
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected ✅' : 'Disconnected ❌';
  
  res.json({ 
    message: '🚀 Task Manager API',
    version: '1.0.0',
    status: 'Running',
    database: dbStatus,
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      notes: '/api/notes',
      documentation: '/api'
    },
    routes: {
      'GET /api/notes': 'Get all tasks',
      'POST /api/notes': 'Create new task',
      'GET /api/notes/:id': 'Get specific task',
      'PUT /api/notes/:id': 'Update task',
      'DELETE /api/notes/:id': 'Delete task',
      'PATCH /api/notes/:id/toggle': 'Toggle task completion'
    },
    cors: {
      allowedOrigins: [
        'https://task-management-7mypw0yav-samzik234s-projects.vercel.app',
        'http://localhost:3000'
      ]
    }
  });
});

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Task Manager API Documentation',
    version: '1.0.0',
    baseUrl: req.protocol + '://' + req.get('host'),
    database: mongoose.connection.readyState === 1 ? 'Connected ✅' : 'Disconnected ❌',
    endpoints: {
      'GET /': 'API information and status',
      'GET /api': 'This documentation',
      'GET /api/health': 'Detailed health check',
      'GET /api/notes': 'Get all notes/tasks with optional filters',
      'POST /api/notes': 'Create new note/task',
      'GET /api/notes/:id': 'Get specific note/task by ID',
      'PUT /api/notes/:id': 'Update note/task by ID',
      'DELETE /api/notes/:id': 'Delete note/task by ID',
      'PATCH /api/notes/:id/toggle': 'Toggle note/task completion status'
    },
    queryParameters: {
      'GET /api/notes': {
        search: 'Search in title and description',
        status: 'Filter by status (pending, in-progress, completed)',
        category: 'Filter by category',
        priority: 'Filter by priority (low, medium, high)',
        sortBy: 'Sort field (createdAt, updatedAt, title, priority)',
        sortOrder: 'Sort order (asc, desc)'
      }
    },
    examples: {
      'Create Task': {
        method: 'POST',
        url: '/api/notes',
        body: {
          title: 'Complete project',
          description: 'Finish the task manager application',
          priority: 'high',
          category: 'work',
          dueDate: '2024-12-31'
        }
      },
      'Get Tasks': {
        method: 'GET',
        url: '/api/notes?status=pending&priority=high'
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: errors,
      timestamp: new Date().toISOString()
    });
  }
  
  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format',
      timestamp: new Date().toISOString()
    });
  }
  
  // MongoDB duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate field value',
      timestamp: new Date().toISOString()
    });
  }
  
  // Default error
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!',
    timestamp: new Date().toISOString()
  });
});

// Handle 404 - Route not found
app.use((req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    timestamp: new Date().toISOString(),
    availableRoutes: {
      'GET /': 'API information',
      'GET /api': 'API documentation', 
      'GET /api/health': 'Health check',
      'GET /api/notes': 'Get all tasks'
    },
    suggestion: 'Check the API documentation at /api for available endpoints'
  });
});

// Graceful shutdown handlers
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  mongoose.connection.close(() => {
    console.log('📊 MongoDB connection closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received. Shutting down gracefully...');
  mongoose.connection.close(() => {
    console.log('📊 MongoDB connection closed.');
    process.exit(0);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error('❌ Unhandled Promise Rejection:', err.message);
  mongoose.connection.close(() => {
    process.exit(1);
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Task Manager API Server Started Successfully!`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'Not set'}`);
  console.log(`✅ CORS configured for Vercel deployment`);
  console.log(`📋 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📖 API Documentation: http://localhost:${PORT}/api`);
  
  // Environment variables status
  console.log(`\n📋 Environment Variables Status:`);
  console.log(`   MONGODB_URI: ${process.env.MONGODB_URI ? '✅ Set' : '❌ Missing'}`);
  console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Set' : '⚠️  Missing (optional)'}`);
  console.log(`   FRONTEND_URL: ${process.env.FRONTEND_URL ? '✅ Set' : '⚠️  Missing'}`);
  console.log(`   CORS_ORIGIN: ${process.env.CORS_ORIGIN ? '✅ Set' : '⚠️  Missing'}`);
  
  console.log(`\n🎯 Ready to accept requests!`);
  console.log(`📱 Test with: curl http://localhost:${PORT}/api/health\n`);
});
