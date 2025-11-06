// src/services/authService.js - IMPROVED
import api from './api';

export const authService = {
  
  // ✅ LOGIN
  login: async (credentials) => {
    try {
      console.log('🔐 authService.login:', credentials.username);
      
      const response = await api.post('/auth/login', credentials);
      
      console.log('✅ Login response:', response.data);

      if (response.data.token && response.data.user) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        console.log('💾 Saved token and user to localStorage');
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Login error:', error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ REGISTER
  register: async (userData) => {
    try {
      console.log('📝 authService.register');
      
      const response = await api.post('/auth/register', userData);

      if (response.data.token && response.data.user) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Register error:', error);
      throw error;
    }
  },

  // ✅ LOGOUT
  logout: async () => {
    try {
      console.log('👋 authService.logout');
      
      // Notify backend
      await api.post('/auth/logout').catch(() => {
        console.warn('⚠️ Backend logout notification failed');
      });

      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      console.log('✅ Logout complete');
    } catch (error) {
      console.error('❌ Logout error:', error);
      throw error;
    }
  },

  // ✅ GET CURRENT USER
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // ✅ GET TOKEN
  getToken: () => {
    return localStorage.getItem('token');
  },

  // ✅ VERIFY TOKEN - IMPORTANT!
  verifyToken: async (token) => {
    try {
      console.log('🔑 Verifying token...');
      
      const response = await api.get('/auth/verify-token', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('✅ Token verified:', response.data);
      return { 
        success: true, 
        valid: true,
        data: response.data 
      };
    } catch (error) {
      console.warn('⚠️ Token verification failed:', error.message);
      // Return false but don't throw - let AuthContext decide what to do
      return { 
        success: false, 
        valid: false,
        error: error.message 
      };
    }
  },

  // ✅ GET PROFILE
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      console.error('❌ Get profile error:', error);
      throw error;
    }
  },

  // ✅ UPDATE PROFILE
  updateProfile: async (formData) => {
    try {
      const response = await api.put('/auth/update-profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      console.error('❌ Update profile error:', error);
      throw error;
    }
  },

  // ✅ IS AUTHENTICATED
  isAuthenticated: () => {
    return !!localStorage.getItem('token') && !!localStorage.getItem('user');
  },

  // ✅ SET TOKEN
  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  },

  // ✅ SET USER
  setUser: (user) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }
};
