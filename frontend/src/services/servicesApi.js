import axios from 'axios';

// Simple environment detection
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// API Configuration
const API_BASE_URL = isLocalhost 
  ? 'http://localhost:5000/api'  // Local development
  : 'https://taskmanagement-app-2oq9.onrender.com/api'; // Production

// Debug logging
console.log('🌍 Running on localhost?', isLocalhost);
console.log('🔗 API Base URL:', API_BASE_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
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

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.error('🔌 Network Error - Is your backend server running?');
      if (isLocalhost) {
        console.error('💡 Start backend: cd backend && node server.js');
      }
    }
    console.error('❌ API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API methods
export const notesAPI = {
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

  getNote: (id) => api.get(`/notes/${id}`),
  createNote: (noteData) => api.post('/notes', noteData),
  updateNote: (id, noteData) => api.put(`/notes/${id}`, noteData),
  deleteNote: (id) => api.delete(`/notes/${id}`),
  toggleNote: (id) => api.patch(`/notes/${id}/toggle`),
  healthCheck: () => api.get('/health'),
};

export default api;
