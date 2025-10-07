import axios from 'axios';

const API_BASE_URL = import.meta.env.PROD 
  ? 'https://your-backend-url.com/api' 
  : '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Notes API functions
export const notesAPI = {
  // Get all notes with optional filters
  getNotes: (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return api.get(`/notes?${params}`);
  },

  // Get single note
  getNote: (id) => api.get(`/notes/${id}`),

  // Create new note
  createNote: (noteData) => api.post('/notes', noteData),

  // Update note
  updateNote: (id, noteData) => api.put(`/notes/${id}`, noteData),

  // Delete note
  deleteNote: (id) => api.delete(`/notes/${id}`),

  // Toggle completion
  toggleNote: (id) => api.patch(`/notes/${id}/toggle`),
};

export default api;
