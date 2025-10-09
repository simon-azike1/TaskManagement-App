import React, { useEffect, useState } from 'react';
import { Plus, LogOut, RefreshCw } from 'lucide-react';
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
          title: `Welcome to TaskMaster, ${user?.firstName || user?.name}! 🎉`,
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
      toast.error('Failed to update task ❌'); //a6E5LQSQJbUAzNV//
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      {/* Header */}
      <header
        className={`bg-white/80 backdrop-blur-lg mt-5 border-b border-slate-200 sticky top-0 z-40 shadow-sm transition-all duration-500 ${
          mounted ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-slate-800 bg-clip-text text-transparent">
                  TaskMaster
                </h1>
                <p className="text-xs text-slate-500">Stay organized, stay productive</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleRefresh}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-xl transition-all duration-300 shadow-sm"
                title="Refresh Tasks"
              >
                <RefreshCw className="w-5 h-5" />
              </button>

              <button
                onClick={() => {
                  setEditingTask(null);
                  setShowTaskForm(true);
                }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.03] shadow-lg flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Task</span>
              </button>

              <button
                onClick={() => onNavigate && onNavigate('profile')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 shadow-sm"
              >
                Profile
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-xl shadow-md transition-all duration-300 transform hover:scale-[1.03]"
                title="Logout"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome */}
        <div
          className={`mb-8 transition-all duration-700 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
          }`}
        >
          <h2 className="text-3xl font-bold text-slate-800 mb-2">
            Welcome back, {user?.firstName || user?.name}! 👋
          </h2>
          <p className="text-slate-600">
            {isFirstTime ? "Let's get you started with your first tasks!" : "Here's what you have on your plate today."}
          </p>
          {stats.dueToday > 0 && (
            <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
              <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {stats.dueToday} task{stats.dueToday !== 1 ? 's' : ''} due today
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* First-time */}
        {isFirstTime && tasks.length === 0 && !isLoading && (
          <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
            <div className="text-center">
              <div className="bg-blue-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Welcome to TaskMaster! 🎉</h3>
              <p className="text-slate-600 mb-4">
                You're all set up! Create your first task to get started.
              </p>
              <button
                onClick={() => {
                  setEditingTask(null);
                  setShowTaskForm(true);
                }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.03] shadow-lg flex items-center gap-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                Create Your First Task
              </button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div
          className={`mb-8 bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-4 shadow-sm transition-all duration-700 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
          }`}
        >
          <StatsCards stats={stats} />
        </div>

        {/* Filters */}
        <div
          className={`mb-8 bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-4 shadow-sm transition-all duration-700 delay-75 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
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
          className={`bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-4 shadow-sm transition-all duration-700 delay-100 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
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
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-200 border-t-blue-600 mx-auto" />
              <p className="mt-4 text-slate-600">Loading your tasks...</p>
            </div>
          </div>
        )}

        {/* Footer info */}
        {user && tasks.length > 0 && (
          <div className="mt-8 text-center text-sm text-slate-500">
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
        className="sm:hidden fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl flex items-center justify-center active:scale-95 transition-transform"
        aria-label="Add Task"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? (taskData) => handleUpdateTask(editingTask._id, taskData) : handleCreateTask}
          onCancel={() => {
            setShowTaskForm(false);
            setEditingTask(null);
          }}
        />
      )}
      
  <ProfessionalFooter onNavigate={onNavigate} />
    </div>
  );
};

export default Dashboard;