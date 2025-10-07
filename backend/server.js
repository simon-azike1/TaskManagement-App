const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const notesRoutes = require('./routes/notes');
require('dotenv').config();

const app = express();

// Connect to MongoDB directly
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
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
    'https://task-management-samzik234s-projects.vercel.app',
    'https://task-management.vercel.app',
    process.env.FRONTEND_URL,
    process.env.CORS_ORIGIN
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Security headers
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
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

// Routes
app.use('/api/notes', notesRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Task Manager API is running successfully',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 Task Manager API',
    version: '1.0.0',
    status: 'Running',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    endpoints: {
      health: '/api/health',
      notes: '/api/notes',
      'create-note': 'POST /api/notes',
      'get-notes': 'GET /api/notes',
      'update-note': 'PUT /api/notes/:id',
      'delete-note': 'DELETE /api/notes/:id',
      'toggle-note': 'PATCH /api/notes/:id/toggle'
    },
    cors: {
      allowedOrigins: [
        'https://task-management-7mypw0yav-samzik234s-projects.vercel.app',
        'http://localhost:3000'
      ]
    }
  });
});

// API Routes documentation
app.get('/api', (req, res) => {
  res.json({
    message: 'Task Manager API Documentation',
    baseUrl: req.protocol + '://' + req.get('host'),
    endpoints: {
      'GET /api/health': 'Health check',
      'GET /api/notes': 'Get all notes/tasks',
      'POST /api/notes': 'Create new note/task',
      'GET /api/notes/:id': 'Get specific note/task',
      'PUT /api/notes/:id': 'Update note/task',
      'DELETE /api/notes/:id': 'Delete note/task',
      'PATCH /api/notes/:id/toggle': 'Toggle note/task completion'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!',
    timestamp: new Date().toISOString()
  });
});

// Handle 404 - Route not found (FIXED - removed the problematic '*' route)
app.use((req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    availableRoutes: {
      'GET /': 'API information',
      'GET /api': 'API documentation', 
      'GET /api/health': 'Health check',
      'GET /api/notes': 'Get all notes'
    }
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  mongoose.connection.close(() => {
    console.log('📊 MongoDB connection closed.');
    process.exit(0);
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Task Manager API Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'Not set'}`);
  console.log(`✅ CORS configured for Vercel deployment`);
  console.log(`📋 API Documentation: http://localhost:${PORT}/api`);
});
