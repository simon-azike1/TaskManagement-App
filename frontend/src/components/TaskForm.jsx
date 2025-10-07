import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, Tag, Flag, FileText, Type } from 'lucide-react';

const TaskForm = ({ task, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'other',
    priority: 'medium',
    status: 'pending',
    dueDate: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        category: task.category || 'other',
        priority: task.priority || 'medium',
        status: task.status || 'pending',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      });
    }
  }, [task]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const submitData = { ...formData };
      if (submitData.dueDate) {
        submitData.dueDate = new Date(submitData.dueDate).toISOString();
      }
      
      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-bounce-in shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm">
              <FileText className="w-6 h-6 text-white" />
            </div>
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-500 hover:text-slate-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-white">
          {/* Title */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-slate-700 font-semibold">
              <Type className="w-4 h-4 text-blue-600" />
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter task title..."
              className={`w-full px-4 py-3 bg-white border rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all shadow-sm ${
                errors.title 
                  ? 'border-red-300 focus:ring-red-200 focus:border-red-400' 
                  : 'border-slate-300 focus:ring-blue-200 focus:border-blue-500'
              }`}
            />
            {errors.title && (
              <p className="text-red-600 text-sm flex items-center gap-1">
                <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-slate-700 font-semibold">
              <FileText className="w-4 h-4 text-blue-600" />
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter task description..."
              rows={4}
              className={`w-full px-4 py-3 bg-white border rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all resize-none shadow-sm ${
                errors.description 
                  ? 'border-red-300 focus:ring-red-200 focus:border-red-400' 
                  : 'border-slate-300 focus:ring-blue-200 focus:border-blue-500'
              }`}
            />
            <div className="flex justify-between text-xs">
              <span>{errors.description && <span className="text-red-600">{errors.description}</span>}</span>
              <span className="text-slate-500">{formData.description.length}/500</span>
            </div>
          </div>

          {/* Row 1: Category and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-slate-700 font-semibold">
                <Tag className="w-4 h-4 text-blue-600" />
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all shadow-sm cursor-pointer"
              >
                <option value="work" className="bg-white text-slate-700">💼 Work</option>
                <option value="personal" className="bg-white text-slate-700">👤 Personal</option>
                <option value="shopping" className="bg-white text-slate-700">🛒 Shopping</option>
                <option value="health" className="bg-white text-slate-700">🏥 Health</option>
                <option value="other" className="bg-white text-slate-700">📝 Other</option>
              </select>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-slate-700 font-semibold">
                <Flag className="w-4 h-4 text-blue-600" />
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all shadow-sm cursor-pointer"
              >
                <option value="low" className="bg-white text-slate-700">🟢 Low</option>
                <option value="medium" className="bg-white text-slate-700">🟡 Medium</option>
                <option value="high" className="bg-white text-slate-700">🔴 High</option>
              </select>
            </div>
          </div>

          {/* Row 2: Status and Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-slate-700 font-semibold">
                <Flag className="w-4 h-4 text-blue-600" />
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all shadow-sm cursor-pointer"
              >
                <option value="pending" className="bg-white text-slate-700">⏳ Pending</option>
                <option value="in-progress" className="bg-white text-slate-700">🔄 In Progress</option>
                <option value="completed" className="bg-white text-slate-700">✅ Completed</option>
              </select>
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-slate-700 font-semibold">
                <Calendar className="w-4 h-4 text-blue-600" />
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleChange('dueDate', e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 hover:border-slate-400 font-semibold rounded-lg transition-all duration-300 shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {task ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {task ? 'Update Task' : 'Create Task'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
