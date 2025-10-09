const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true // Each note is linked to a user
  },
  title: String,
  content: String,
  description: String,
  category: {
    type: String,
    enum: ['work', 'personal', 'shopping', 'health', 'other', 'welcome'],
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
  dueDate: Date
}, {
  strict: false,          // Allows extra fields if needed
  collection: 'notes',
  timestamps: true        // Adds createdAt & updatedAt automatically
});

// Pre-save hook to auto-update 'completed' based on 'status'
noteSchema.pre('save', function(next) {
  if (this.status === 'completed') {
    this.completed = true;
  } else if (this.status !== 'completed') {
    this.completed = false;
  }
  next();
});

module.exports = mongoose.model('Note', noteSchema);
