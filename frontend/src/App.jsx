import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Briefcase,
  TrendingUp
} from 'lucide-react';
import { notesAPI } from './services/servicesApi';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import FilterBar from './components/FilterBar';
import StatsCards from './components/StatsCards';

function App() {
  // Core state - Initialize tasks as empty array
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    category: '',
    priority: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // UI state
  const [viewMode, setViewMode] = useState('grid');

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await notesAPI.getNotes(filters);
      console.log('Full API Response:', response);
      
      // Your API returns: { success: true, count: 1, data: [...] }
      // So we need response.data.data
      const tasksData = response.data?.data || [];
      
      setTasks(tasksData);
      console.log('Tasks loaded:', tasksData.length, 'tasks');
      
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to fetch tasks. Please check your connection.');
      setTasks([]); // Ensure tasks is always an array
    } finally {
      setLoading(false);
    }
  };

  // Load tasks on mount and filter change
  useEffect(() => {
    fetchTasks();
  }, [filters]);

  // Task operations
  const handleCreateTask = async (taskData) => {
    try {
      console.log('Creating task:', taskData);
      const response = await notesAPI.createNote(taskData);
      console.log('Task created:', response.data);
      await fetchTasks(); // Refresh the list
      setShowForm(false);
      showSuccessMessage('Task created successfully! 🎉');
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Failed to create task');
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      console.log('Updating task:', editingTask._id, taskData);
      const response = await notesAPI.updateNote(editingTask._id, taskData);
      console.log('Task updated:', response.data);
      await fetchTasks(); // Refresh the list
      setEditingTask(null);
      setShowForm(false);
      showSuccessMessage('Task updated successfully! ✅');
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        console.log('Deleting task:', taskId);
        const response = await notesAPI.deleteNote(taskId);
        console.log('Task deleted:', response.data);
        await fetchTasks(); // Refresh the list
        showSuccessMessage('Task deleted successfully! 🗑️');
      } catch (err) {
        console.error('Error deleting task:', err);
        setError('Failed to delete task');
      }
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      console.log('Toggling task:', taskId);
      const response = await notesAPI.toggleNote(taskId);
      console.log('Task toggled:', response.data);
      await fetchTasks(); // Refresh the list
    } catch (err) {
      console.error('Error toggling task:', err);
      // If toggle endpoint doesn't exist, try manual update
      try {
        const task = tasks.find(t => t._id === taskId);
        if (task) {
          await notesAPI.updateNote(taskId, {
            ...task,
            completed: !task.completed,
            status: !task.completed ? 'completed' : 'pending'
          });
          await fetchTasks();
        }
      } catch (fallbackErr) {
        setError('Failed to toggle task');
      }
    }
  };

  const handleEditTask = (task) => {
    console.log('Editing task:', task);
    setEditingTask(task);
    setShowForm(true);
  };

  const handleBulkDelete = async (taskIds) => {
    if (window.confirm(`Are you sure you want to delete ${taskIds.length} tasks?`)) {
      try {
        console.log('Bulk deleting tasks:', taskIds);
        await Promise.all(taskIds.map(id => notesAPI.deleteNote(id)));
        await fetchTasks(); // Refresh the list
        showSuccessMessage(`${taskIds.length} tasks deleted successfully! 🗑️`);
      } catch (err) {
        console.error('Error bulk deleting tasks:', err);
        setError('Failed to delete tasks');
      }
    }
  };

  // Success message helper
  const showSuccessMessage = (message) => {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in border border-blue-500';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  // Calculate stats - Ensure tasks is always an array
  const safeStats = React.useMemo(() => {
    const taskArray = Array.isArray(tasks) ? tasks : [];
    
    const completed = taskArray.filter(t => t && t.completed).length;
    const total = taskArray.length;
    
    return {
      total,
      completed,
      pending: taskArray.filter(t => t && !t.completed && t.status !== 'in-progress').length,
      inProgress: taskArray.filter(t => t && t.status === 'in-progress').length,
      overdue: taskArray.filter(t => {
        if (!t || !t.dueDate || t.completed) return false;
        return new Date(t.dueDate) < new Date();
      }).length,
      highPriority: taskArray.filter(t => t && t.priority === 'high' && !t.completed).length,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [tasks]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl animate-fade-in border border-slate-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="flex items-center gap-3 text-3xl md:text-4xl font-bold text-slate-800">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                Task Manager
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </h1>
              <p className="text-slate-600 text-lg">
                Professional task management for enhanced productivity
              </p>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  {safeStats.total} Total Tasks
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  {safeStats.completionRate}% Complete
                </span>
                {safeStats.overdue > 0 && (
                  <span className="flex items-center gap-1 text-red-600">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    {safeStats.overdue} Overdue
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Add Task Button */}
              <button 
                onClick={() => {
                  setEditingTask(null);
                  setShowForm(true);
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-md"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Add Task</span>
              </button>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <StatsCards stats={safeStats} />

        {/* Filter Bar */}
        <FilterBar 
          filters={filters} 
          onFiltersChange={setFilters}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 border-l-4 border-l-red-500 animate-fade-in">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span className="text-red-800 font-medium flex-1">{error}</span>
              <button 
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600 text-xl font-bold transition-colors"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="animate-fade-in">
          {loading ? (
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-12 text-center shadow-lg border border-slate-200">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-4">
                <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              </div>
              <p className="text-slate-800 text-lg font-semibold">Loading your tasks...</p>
              <p className="text-slate-500 text-sm mt-2">Please wait while we fetch your data</p>
            </div>
          ) : (
            <TaskList 
              tasks={Array.isArray(tasks) ? tasks : []}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onToggle={handleToggleTask}
              onBulkDelete={handleBulkDelete}
              viewMode={viewMode}
            />
          )}
        </main>

        {/* Task Form Modal */}
        {showForm && (
          <TaskForm
            task={editingTask}
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
            onCancel={() => {
              setShowForm(false);
              setEditingTask(null);
            }}
          />
        )}

        {/* Footer */}
        <footer className="text-center py-6">
          <p className="text-slate-500 text-sm">
            Built with React & Node.js • Professional Task Management System
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
