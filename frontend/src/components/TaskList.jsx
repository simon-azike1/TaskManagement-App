import React from 'react';
import { 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertTriangle,
  Calendar,
  Tag,
  Flag,
  MoreVertical
} from 'lucide-react';
import { format } from 'date-fns';

const TaskList = ({ tasks, onEdit, onDelete, onToggle }) => {
  if (tasks.length === 0) {
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-12 text-center animate-fade-in shadow-lg border border-slate-200">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-slate-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12 text-slate-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-800 mb-2">No tasks found</h3>
        <p className="text-slate-500">Create your first task to get started!</p>
      </div>
    );
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'from-red-500 to-red-600';
      case 'medium': return 'from-blue-500 to-blue-600';
      case 'low': return 'from-slate-400 to-slate-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'work': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'personal': return 'bg-slate-50 text-slate-700 border-slate-200';
      case 'shopping': return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'health': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status, completed) => {
    if (completed) return <CheckCircle2 className="w-5 h-5 text-blue-600" />;
    if (status === 'in-progress') return <Clock className="w-5 h-5 text-cyan-600" />;
    return <Circle className="w-5 h-5 text-slate-400" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">
          Your Tasks ({tasks.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task, index) => (
          <TaskCard
            key={task._id}
            task={task}
            index={index}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggle={onToggle}
            getPriorityColor={getPriorityColor}
            getCategoryColor={getCategoryColor}
            getStatusIcon={getStatusIcon}
          />
        ))}
      </div>
    </div>
  );
};

const TaskCard = ({ 
  task, 
  index, 
  onEdit, 
  onDelete, 
  onToggle, 
  getPriorityColor, 
  getCategoryColor, 
  getStatusIcon 
}) => {
  const [showActions, setShowActions] = React.useState(false);

  return (
    <div 
      className={`bg-white/95 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-xl animate-fade-in border border-slate-200 shadow-lg ${
        task.completed ? 'opacity-75' : ''
      }`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onToggle(task._id)}
            className="transition-transform hover:scale-110"
          >
            {getStatusIcon(task.status, task.completed)}
          </button>
          
          {/* Priority Indicator */}
          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getPriorityColor(task.priority)} shadow-sm`}></div>
        </div>

        {/* Actions Menu */}
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-slate-400" />
          </button>

          {showActions && (
            <div className="absolute right-0 top-8 bg-white backdrop-blur-lg border border-slate-200 rounded-lg py-2 min-w-[120px] z-10 shadow-lg">
              <button
                onClick={() => {
                  onEdit(task);
                  setShowActions(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => {
                  onDelete(task._id);
                  setShowActions(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className={`text-lg font-semibold mb-2 ${
        task.completed ? 'line-through text-slate-500' : 'text-slate-800'
      }`}>
        {task.title || 'Untitled Task'}
      </h3>

      {/* Description */}
      {task.description && (
        <p className="text-slate-600 text-sm mb-4 line-clamp-3">
          {task.description}
        </p>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {/* Category */}
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border ${getCategoryColor(task.category)}`}>
          <Tag className="w-3 h-3" />
          {task.category || 'other'}
        </span>

        {/* Priority */}
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-gradient-to-r ${getPriorityColor(task.priority)} text-white shadow-sm`}>
          <Flag className="w-3 h-3" />
          {task.priority || 'medium'}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        {/* Due Date */}
        {task.dueDate && (
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>
              {format(new Date(task.dueDate), 'MMM dd, yyyy')}
            </span>
          </div>
        )}

        {/* Created Date */}
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>
            {task.createdAt ? format(new Date(task.createdAt), 'MMM dd') : 'Recently'}
          </span>
        </div>
      </div>

      {/* Progress Bar for In-Progress Tasks */}
      {task.status === 'in-progress' && !task.completed && (
        <div className="mt-4 bg-slate-200 rounded-full h-1 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-pulse w-2/3"></div>
        </div>
      )}

      {/* Completion Badge */}
      {task.completed && (
        <div className="mt-4 pt-3 border-t border-slate-200">
          <div className="flex items-center gap-2 text-xs text-blue-600">
            <CheckCircle2 className="w-3 h-3" />
            <span className="font-medium">Completed</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
