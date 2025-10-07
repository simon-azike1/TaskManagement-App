import axios from 'axios';

// API Configuration
const API_CONFIG = {
  development: 'http://localhost:5000/api',
  production: 'https://taskmanagement-app-2oq9.onrender.com' 
};

const API_BASE_URL = API_CONFIG[process.env.NODE_ENV] || API_CONFIG.development;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      console.error('🔍 API endpoint not found. Check your backend URL.');
    }
    
    return Promise.reject(error);
  }
);

// API methods
export const notesAPI = {
  // Get all notes with optional filters
  getNotes: async (filters = {}) => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        params.append(key, value);
      }
    });
    
    const queryString = params.toString();
    const url = queryString ? `/notes?${queryString}` : '/notes';
    
    return api.get(url);
  },

  // Get single note
  getNote: (id) => api.get(`/notes/${id}`),

  // Create new note
  createNote: (noteData) => api.post('/notes', noteData),

  // Update note
  updateNote: (id, noteData) => api.put(`/notes/${id}`, noteData),

  // Delete note
  deleteNote: (id) => api.delete(`/notes/${id}`),

  // Toggle note completion
  toggleNote: (id) => api.patch(`/notes/${id}/toggle`),

  // Health check
  healthCheck: () => api.get('/health'),
};

export default api;
