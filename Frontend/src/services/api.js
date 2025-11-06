// src/services/api.js - CORRECT VERSION
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Request interceptor - add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    console.log('[API] Request:', config.method.toUpperCase(), config.url);
    console.log('[API] Token:', token ? 'present' : 'missing');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('[API] Added token to headers');
    }
    
    return config;
  },
  (error) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

// ✅ Response interceptor - handle errors
api.interceptors.response.use(
  (response) => {
    console.log('[API] Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('[API] Response error:', {
      status: error.response?.status,
      message: error.response?.data?.message,
      url: error.config?.url,
    });

    // ❌ 401 - Token expired or invalid
    if (error.response?.status === 401) {
      console.warn('[API] 401 - Clearing auth');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;
