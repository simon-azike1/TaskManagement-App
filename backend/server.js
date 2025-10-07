const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const notesRoutes = require('./routes/notes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Root route - ADD THIS
app.get('/', (req, res) => {
  res.json({ 
    message: 'Task Manager API is running!', 
    status: 'success',
    endpoints: {
      notes: '/api/notes'
    }
  });
});

// Routes
app.use('/api/notes', notesRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 API available at http://localhost:${PORT}/api/notes`);
});
