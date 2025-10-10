import React, { useEffect, useState } from 'react';
import { Plus, LogOut, RefreshCw, Sparkles } from 'lucide-react';
import StatsCards from './StatsCards';
import FilterBar from './FilterBar';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import { notesAPI, authAPI } from '../services/servicesApi';
import { toast } from 'react-toastify';
import ProfessionalFooter from './Footer';

const Dashboard = ({ user, onNavigate, onLogout }) => {
  const [mounted, setMounted] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isFirstTime, setIsFirstTime] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    category: '',
    priority: ''
  });

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (user?._id || user?.id) loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id, user?.id]);

  useEffect(() => {
    applyFilters();
  }, [tasks, filters]);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await notesAPI.getNotes();
      if (response.data.success) {
        const userTasks = response.data.data || [];
        setTasks(userTasks);
        if (userTasks.length === 0) {
          setIsFirstTime(true);
          await createWelcomeTasks();
        }
      } else {
        setError('Failed to load tasks');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setError('Session expired. Please login again.');
        setTimeout(() => onLogout && onLogout(), 1500);
      } else {
        setError('Failed to load tasks. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const createWelcomeTasks = async () => {
    try {
      const welcomeTasks = [
        {
          title: `Welcome to Chetro, ${user?.firstName || user?.name}! 🎉`,
          content: 'This is your first task. Click the checkbox to mark it as complete!',
          category: 'welcome',
          priority: 'high',
          status: 'pending',
          isCompleted: false
        },
        {
          title: 'Explore the Dashboard',
          content: 'Take a look around and familiarize yourself with the interface.',
          category: 'welcome',
          priority: 'medium',
          status: 'pending',
          isCompleted: false
        },
        {
          title: 'Create Your First Task',
          content: 'Click the "Add Task" button to create your own task.',
          category: 'welcome',
          priority: 'medium',
          status: 'pending',
          isCompleted: false
        }
      ];
      for (const taskData of welcomeTasks) {
        try {
          const res = await notesAPI.createNote(taskData);
          if (res.data.success) setTasks(prev => [res.data.data, ...prev]);
        } catch (e) {
          // no-op
        }
      }
    } catch {
      // no-op
    }
  };

  const applyFilters = () => {
    let filtered = [...tasks];

    if (filters.search) {
      const s = filters.search.toLowerCase();
      filtered = filtered.filter(task =>
        task.title?.toLowerCase().includes(s) ||
        task.content?.toLowerCase().includes(s) ||
        task.description?.toLowerCase().includes(s) ||
        task.category?.toLowerCase().includes(s)
      );
    }

    if (filters.status) {
      if (filters.status === 'completed') {
        filtered = filtered.filter(t => t.completed === true || t.isCompleted === true);
      } else if (filters.status === 'pending') {
        filtered = filtered.filter(
          t => (t.status === 'pending' || !t.status) && !t.completed && !t.isCompleted
        );
      } else if (filters.status === 'in-progress') {
        filtered = filtered.filter(t => t.status === 'in-progress');
      } else if (filters.status === 'overdue') {
        const now = new Date();
        filtered = filtered.filter(t => {
          if (!t.dueDate || t.completed || t.isCompleted) return false;
          return new Date(t.dueDate) < now;
        });
      }
    }

    if (filters.category) filtered = filtered.filter(t => t.category === filters.category);
    if (filters.priority) filtered = filtered.filter(t => t.priority === filters.priority);

    setFilteredTasks(filtered);
  };

  const calculateStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed || t.isCompleted).length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const pending = tasks.filter(
      t => (t.status === 'pending' || !t.status) && !t.completed && !t.isCompleted
    ).length;

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const now = new Date();
    const overdue = tasks.filter(t => {
      if (!t.dueDate || t.completed || t.isCompleted) return false;
      return new Date(t.dueDate) < now;
    }).length;

    const today = new Date().toDateString();
    const dueToday = tasks.filter(t => {
      if (!t.dueDate || t.completed || t.isCompleted) return false;
      return new Date(t.dueDate).toDateString() === today;
    }).length;

    return { total, completed, inProgress, pending, completionRate, overdue, dueToday };
  };

  const handleCreateTask = async (taskData) => {
    try {
      const apiData = {
        title: taskData.title,
        content: taskData.description,
        category: taskData.category || 'general',
        priority: taskData.priority || 'medium',
        status: taskData.status || 'pending',
        dueDate: taskData.dueDate,
        isCompleted: taskData.status === 'completed'
      };
      const response = await notesAPI.createNote(apiData);
      if (response.data.success) {
        setTasks(prev => [response.data.data, ...prev]);
        setShowTaskForm(false);
        setIsFirstTime(false);
        toast.success('Task created ✅');
      } else {
        toast.error('Failed to create task ❌');
      }
    } catch {
      toast.error('Failed to create task ❌');
    }
  };

  const handleEditTask = (task) => {
    const formTask = {
      ...task,
      description: task.content || task.description,
      completed: task.completed || task.isCompleted
    };
    setEditingTask(formTask);
    setShowTaskForm(true);
    toast.info('Editing task ✏️');
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      const apiData = {
        title: taskData.title,
        content: taskData.description,
        category: taskData.category,
        priority: taskData.priority,
        status: taskData.status,
        dueDate: taskData.dueDate,
        isCompleted: taskData.status === 'completed'
      };
      const response = await notesAPI.updateNote(taskId, apiData);
      if (response.data.success) {
        setTasks(prev => prev.map(t => (t._id === taskId ? response.data.data : t)));
        setEditingTask(null);
        setShowTaskForm(false);
        setError('');
        toast.success('Task edited ✏️');
      } else {
        setError('Failed to update task');
        toast.error('Failed to update task ❌');
      }
    } catch {
      setError('Failed to update task. Please try again.');
      toast.error('Failed to update task ❌');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      const response = await notesAPI.deleteNote(taskId);
      if (response.data.success) {
        setTasks(prev => prev.filter(t => t._id !== taskId));
        toast.success('Task deleted 🗑️');
      } else {
        toast.error('Failed to delete task ❌');
      }
    } catch {
      toast.error('Failed to delete task ❌');
    }
  };

  const handleToggleTask = async (taskId) => {
    const prev = [...tasks];
    setTasks(p => p.map(t => (t._id === taskId ? { ...t, completed: !t.completed } : t)));
    try {
      const response = await notesAPI.toggleNote(taskId);
      const updated = response.data.data || response.data.note;
      setTasks(p => p.map(t => (t._id === taskId ? { ...t, ...updated } : t)));
      toast.success('Task updated ✅');
    } catch {
      setTasks(prev);
      toast.error('Failed to update task ❌');
    }
  };

  const handleRefresh = () => {
    loadTasks();
    toast.info('Tasks refreshed 🔄');
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      toast.success('Logged out ✅');
    } catch {
      toast.error('Logout failed ❌');
    } finally {
      onLogout && onLogout();
    }
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-black relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <header
        className={`bg-black/40 backdrop-blur-xl border-b pt-5 pb-5 border-blue-900/30 sticky top-0 z-40 shadow-2xl shadow-blue-900/20 transition-all duration-500 ${
          mounted ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center min-w-0 flex-1 group">
              <div className="h-9 w-9 sm:h-10 sm:w-10 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50 flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-blue-500/70">
                <svg className="h-5 w-5 sm:h-6 sm:w-6 text-white transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-2 sm:ml-4 min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent truncate transition-all duration-300 group-hover:from-blue-300 group-hover:to-blue-100">
                  Chetro
                </h1>
                <p className="text-xs text-blue-300/60 hidden sm:block">Stay organized, stay productive</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
              <button
                onClick={handleRefresh}
                className="bg-blue-900/30 hover:bg-blue-800/40 text-blue-200 p-1.5 sm:p-2 rounded-lg transition-all duration-300 border border-blue-700/30 hover:border-blue-600/50 hover:scale-110 active:scale-95 group"
                title="Refresh Tasks"
              >
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:rotate-180" />
              </button>

              <button
                onClick={() => {
                  setEditingTask(null);
                  setShowTaskForm(true);
                }}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 flex items-center gap-1 sm:gap-2 text-sm sm:text-base group"
              >
                <Plus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
                <span className="hidden xs:inline">Add</span>
              </button>

              <button
                onClick={() => onNavigate && onNavigate('profile')}
                className="bg-blue-700/40 hover:bg-blue-600/50 text-blue-100 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all duration-300 border border-blue-600/30 hover:border-blue-500/50 text-sm sm:text-base hidden sm:block hover:scale-105 active:scale-95"
              >
                Profile
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center justify-center bg-red-600/80 hover:bg-red-600 text-white font-semibold px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg shadow-lg shadow-red-600/20 transition-all duration-300 transform hover:scale-105 active:scale-95 border border-red-500/30 text-sm sm:text-base group"
                title="Logout"
              >
                <LogOut className="w-4 h-4 sm:mr-1 transition-transform duration-300 group-hover:-translate-x-1" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto py-4 sm:py-8 px-3 sm:px-6 lg:px-8 relative z-10">
        {/* Welcome */}
        <div
          className={`mb-6 sm:mb-8 transition-all duration-700 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-100">
              Welcome back, {user?.firstName || user?.name}!
            </h2>
            <span className="text-2xl sm:text-3xl animate-bounce inline-block">👋</span>
          </div>
          <p className="text-blue-200/70 text-sm sm:text-base">
            {isFirstTime ? "Let's get you started with your first tasks!" : "Here's what you have on your plate today."}
          </p>
          {stats.dueToday > 0 && (
            <div className="mt-3 inline-flex items-center px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-blue-600/20 text-blue-200 border border-blue-500/30 animate-pulse hover:scale-105 transition-transform duration-300">
              <svg className="w-4 h-4 mr-1.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ animationDuration: '3s' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {stats.dueToday} task{stats.dueToday !== 1 ? 's' : ''} due today
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 sm:mb-6 bg-red-900/20 border border-red-500/30 text-red-200 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl backdrop-blur-sm animate-shake">
            <div className="flex items-center text-sm sm:text-base">
              <svg className="w-5 h-5 mr-2 flex-shrink-0 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="break-words">{error}</span>
            </div>
          </div>
        )}

        {/* First-time */}
        {isFirstTime && tasks.length === 0 && !isLoading && (
          <div className="mb-6 sm:mb-8 bg-gradient-to-r from-blue-900/30 to-blue-800/20 border border-blue-700/30 rounded-xl p-4 sm:p-6 backdrop-blur-sm hover:border-blue-600/50 transition-all duration-500 hover:scale-[1.02]">
            <div className="text-center">
              <div className="bg-blue-600/20 p-3 rounded-full w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 flex items-center justify-center border border-blue-500/30 animate-bounce" style={{ animationDuration: '2s' }}>
                <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-blue-300" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-blue-100 mb-2">Welcome to Chetro! 🎉</h3>
              <p className="text-blue-200/70 mb-4 text-sm sm:text-base">
                You're all set up! Create your first task to get started.
              </p>
              <button
                onClick={() => {
                  setEditingTask(null);
                  setShowTaskForm(true);
                }}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-600/30 flex items-center gap-2 mx-auto text-sm sm:text-base group"
              >
                <Plus className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
                Create Your First Task
              </button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div
          className={`mb-4 sm:mb-8 bg-black/40 backdrop-blur-md border border-blue-900/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-xl shadow-blue-900/10 transition-all duration-700 hover:border-blue-800/40 hover:shadow-blue-800/20 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <StatsCards stats={stats} />
        </div>

        {/* Filters */}
        <div
          className={`mb-4 sm:mb-8 bg-black/40 backdrop-blur-md border border-blue-900/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-xl shadow-blue-900/10 transition-all duration-700 delay-75 hover:border-blue-800/40 hover:shadow-blue-800/20 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <FilterBar
            filters={filters}
            onFiltersChange={setFilters}
            taskCount={filteredTasks.length}
            totalTasks={tasks.length}
          />
        </div>

        {/* List */}
        <div
          className={`bg-black/40 backdrop-blur-md border border-blue-900/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-xl shadow-blue-900/10 transition-all duration-700 delay-100 hover:border-blue-800/40 hover:shadow-blue-800/20 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <TaskList
            tasks={filteredTasks}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onToggle={handleToggleTask}
            isLoading={isLoading}
            emptyMessage={
              tasks.length === 0
                ? 'No tasks yet. Create your first task to get started!'
                : 'No tasks match your current filters.'
            }
          />
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-2 border-blue-900/30 border-t-blue-500 mx-auto" />
                <div className="absolute inset-0 animate-ping rounded-full h-10 w-10 sm:h-12 sm:w-12 border border-blue-500/20 mx-auto" style={{ animationDuration: '2s' }} />
              </div>
              <p className="mt-4 text-blue-200/70 text-sm sm:text-base animate-pulse">Loading your tasks...</p>
            </div>
          </div>
        )}

        {/* Footer info */}
        {user && tasks.length > 0 && (
          <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-blue-300/50">
            Showing tasks for {user.firstName} {user.lastName} • Last updated: {new Date().toLocaleTimeString()}
          </div>
        )}
      </main>

      {/* Floating Add (mobile) */}
      <button
        onClick={() => {
          setEditingTask(null);
          setShowTaskForm(true);
        }}
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-2xl shadow-blue-600/40 flex items-center justify-center transition-all duration-300 border-2 border-blue-400/30 hover:shadow-blue-500/60 z-50 group hover:scale-110 active:scale-95 animate-bounce hover:animate-none"
        aria-label="Add Task"
        style={{ animationDuration: '3s' }}
      >
        <Plus className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:rotate-90" />
        <span className="absolute inset-0 rounded-full bg-blue-400/20 animate-ping" style={{ animationDuration: '2s' }}></span>
      </button>

      {/* Task Form Modal */}
      {showTaskForm && (
        <div className="animate-fadeIn">
          <TaskForm
            task={editingTask}
            onSubmit={editingTask ? (taskData) => handleUpdateTask(editingTask._id, taskData) : handleCreateTask}
            onCancel={() => {
              setShowTaskForm(false);
              setEditingTask(null);
            }}
          />
        </div>
      )}
      
      <ProfessionalFooter onNavigate={onNavigate} />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;