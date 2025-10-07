const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const notesRoutes = require('./routes/notes');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// CORS - Allow your Vercel frontend
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-app-name.vercel.app', // Replace with your actual Vercel URL
    process.env.FRONTEND_URL
  ],
  credentials: true
}));

// Routes
app.use('/api/notes', notesRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Task Manager API is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Task Manager API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      notes: '/api/notes'
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});
