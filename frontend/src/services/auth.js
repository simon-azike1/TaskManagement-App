// frontend/src/api/auth.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Register
export const registerUser = (userData) => {
  return axios.post(`${API_URL}/register`, userData);
};

// Login
export const loginUser = (userData) => {
  return axios.post(`${API_URL}/login`, userData);
};

// Get logged-in user
export const getCurrentUser = (token) => {
  return axios.get(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Logout
export const logoutUser = (token) => {
  return axios.post(`${API_URL}/logout`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
