// src/services/api.js
import axios from 'axios';


const API_URL = 'http://localhost:5000/api';

let api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } catch (err) {
        console.error('Error clearing localStorage:', err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
