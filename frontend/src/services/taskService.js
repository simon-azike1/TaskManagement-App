// Task Service for managing user-specific tasks
class TaskService {
  constructor() {
    this.storageKey = 'taskmaster_tasks';
    this.initializeStorage();
  }

  initializeStorage() {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify({}));
    }
  }

  // Get all tasks for a specific user
  getUserTasks(userId) {
    try {
      const allTasks = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
      return allTasks[userId] || [];
    } catch (error) {
      console.error('Error getting user tasks:', error);
      return [];
    }
  }

  // Save tasks for a specific user
  saveUserTasks(userId, tasks) {
    try {
      const allTasks = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
      allTasks[userId] = tasks;
      localStorage.setItem(this.storageKey, JSON.stringify(allTasks));
      return true;
    } catch (error) {
      console.error('Error saving user tasks:', error);
      return false;
    }
  }

  // Create a new task
  createTask(userId, taskData) {
    try {
      const tasks = this.getUserTasks(userId);
      const newTask = {
        id: Date.now().toString(),
        title: taskData.title,
        description: taskData.description || '',
        priority: taskData.priority || 'medium',
        status: taskData.status || 'pending',
        category: taskData.category || 'general',
        dueDate: taskData.dueDate || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        completed: false
      };

      tasks.push(newTask);
      this.saveUserTasks(userId, tasks);
      return newTask;
    } catch (error) {
      console.error('Error creating task:', error);
      return null;
    }
  }

  // Update an existing task
  updateTask(userId, taskId, updates) {
    try {
      const tasks = this.getUserTasks(userId);
      const taskIndex = tasks.findIndex(task => task.id === taskId);
      
      if (taskIndex === -1) {
        throw new Error('Task not found');
      }

      tasks[taskIndex] = {
        ...tasks[taskIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      this.saveUserTasks(userId, tasks);
      return tasks[taskIndex];
    } catch (error) {
      console.error('Error updating task:', error);
      return null;
    }
  }

  // Delete a task
  deleteTask(userId, taskId) {
    try {
      const tasks = this.getUserTasks(userId);
      const filteredTasks = tasks.filter(task => task.id !== taskId);
      this.saveUserTasks(userId, filteredTasks);
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      return false;
    }
  }

  // Toggle task completion
  toggleTaskCompletion(userId, taskId) {
    try {
      const tasks = this.getUserTasks(userId);
      const task = tasks.find(task => task.id === taskId);
      
      if (!task) {
        throw new Error('Task not found');
      }

      const updatedTask = {
        ...task,
        completed: !task.completed,
        status: !task.completed ? 'completed' : 'pending',
        updatedAt: new Date().toISOString()
      };

      return this.updateTask(userId, taskId, updatedTask);
    } catch (error) {
      console.error('Error toggling task completion:', error);
      return null;
    }
  }

  // Get task statistics for a user
  getTaskStats(userId) {
    try {
      const tasks = this.getUserTasks(userId);
      
      return {
        total: tasks.length,
        completed: tasks.filter(task => task.completed).length,
        pending: tasks.filter(task => !task.completed).length,
        overdue: tasks.filter(task => {
          if (!task.dueDate || task.completed) return false;
          return new Date(task.dueDate) < new Date();
        }).length,
        byPriority: {
          high: tasks.filter(task => task.priority === 'high').length,
          medium: tasks.filter(task => task.priority === 'medium').length,
          low: tasks.filter(task => task.priority === 'low').length
        },
        byCategory: tasks.reduce((acc, task) => {
          acc[task.category] = (acc[task.category] || 0) + 1;
          return acc;
        }, {})
      };
    } catch (error) {
      console.error('Error getting task stats:', error);
      return {
        total: 0,
        completed: 0,
        pending: 0,
        overdue: 0,
        byPriority: { high: 0, medium: 0, low: 0 },
        byCategory: {}
      };
    }
  }

  // Search tasks
  searchTasks(userId, query) {
    try {
      const tasks = this.getUserTasks(userId);
      const lowercaseQuery = query.toLowerCase();
      
      return tasks.filter(task => 
        task.title.toLowerCase().includes(lowercaseQuery) ||
        task.description.toLowerCase().includes(lowercaseQuery) ||
        task.category.toLowerCase().includes(lowercaseQuery)
      );
    } catch (error) {
      console.error('Error searching tasks:', error);
      return [];
    }
  }

  // Filter tasks
  filterTasks(userId, filters) {
    try {
      let tasks = this.getUserTasks(userId);

      if (filters.status) {
        tasks = tasks.filter(task => task.status === filters.status);
      }

      if (filters.priority) {
        tasks = tasks.filter(task => task.priority === filters.priority);
      }

      if (filters.category) {
        tasks = tasks.filter(task => task.category === filters.category);
      }

      if (filters.completed !== undefined) {
        tasks = tasks.filter(task => task.completed === filters.completed);
      }

      return tasks;
    } catch (error) {
      console.error('Error filtering tasks:', error);
      return [];
    }
  }

  // Get tasks due today
  getTasksDueToday(userId) {
    try {
      const tasks = this.getUserTasks(userId);
      const today = new Date().toDateString();
      
      return tasks.filter(task => {
        if (!task.dueDate || task.completed) return false;
        return new Date(task.dueDate).toDateString() === today;
      });
    } catch (error) {
      console.error('Error getting tasks due today:', error);
      return [];
    }
  }

  // Initialize default tasks for new users
  initializeUserTasks(userId, userName) {
    try {
      const existingTasks = this.getUserTasks(userId);
      if (existingTasks.length > 0) {
        return existingTasks; // User already has tasks
      }

      // Create welcome tasks for new users
      const welcomeTasks = [
        {
          id: `welcome_1_${Date.now()}`,
          title: `Welcome to TaskMaster, ${userName}! 🎉`,
          description: 'This is your first task. Click the checkbox to mark it as complete!',
          priority: 'high',
          status: 'pending',
          category: 'welcome',
          dueDate: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          completed: false
        },
        {
          id: `welcome_2_${Date.now() + 1}`,
          title: 'Explore the Dashboard',
          description: 'Take a look around and familiarize yourself with the interface.',
          priority: 'medium',
          status: 'pending',
          category: 'welcome',
          dueDate: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          completed: false
        },
        {
          id: `welcome_3_${Date.now() + 2}`,
          title: 'Create Your First Task',
          description: 'Click the "Add Task" button to create your own task.',
          priority: 'medium',
          status: 'pending',
          category: 'welcome',
          dueDate: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          completed: false
        }
      ];

      this.saveUserTasks(userId, welcomeTasks);
      return welcomeTasks;
    } catch (error) {
      console.error('Error initializing user tasks:', error);
      return [];
    }
  }
}

// Export singleton instance
export const taskService = new TaskService();
export default taskService;
