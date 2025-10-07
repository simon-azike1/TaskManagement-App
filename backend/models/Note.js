const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  // Common fields that might exist
  title: {
    type: String,
    required: false // Make flexible for existing data
  },
  content: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: false
  },
  // Task-like fields we can add
  category: {
    type: String,
    enum: ['work', 'personal', 'shopping', 'health', 'other'],
    default: 'other'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  completed: {
    type: Boolean,
    default: false
  },
  dueDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { 
  strict: false, // Allow fields not in schema (for existing data)
  collection: 'notes' // Use your existing collection
});

// Update timestamp on save
noteSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Note', noteSchema);
