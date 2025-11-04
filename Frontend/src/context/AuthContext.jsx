// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Initialize from localStorage on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Get stored token and user
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          // Verify token is still valid with server
          try {
            const response = await authService.verifyToken(storedToken);
            if (response.success) {
              setToken(storedToken);
              setUser(JSON.parse(storedUser));
            } else {
              // Token invalid, clear storage
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              setUser(null);
              setToken(null);
            }
          } catch (error) {
            // Verification failed, clear storage
            console.error('Token verification failed:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            setToken(null);
          }
        } else {
          // No stored session
          const currentUser = authService.getCurrentUser();
          setUser(currentUser);
          const currentToken = authService.getToken();
          setToken(currentToken);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        if (e.newValue) {
          // Token was set in another tab
          setToken(e.newValue);
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        } else {
          // Token was removed in another tab
          setToken(null);
          setUser(null);
        }
      } else if (e.key === 'user') {
        if (e.newValue) {
          setUser(JSON.parse(e.newValue));
        } else {
          setUser(null);
        }
      }
    };

    // Listen for custom events from other tabs
    const handleUserLogin = (event) => {
      const { token: newToken, user: newUser } = event.detail;
      setToken(newToken);
      setUser(newUser);
    };

    const handleUserLogout = () => {
      setToken(null);
      setUser(null);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userLogin', handleUserLogin);
    window.addEventListener('userLogout', handleUserLogout);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLogin', handleUserLogin);
      window.removeEventListener('userLogout', handleUserLogout);
    };
  }, []);

  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      
      // Store in state
      setToken(data.token);
      setUser(data.user);

      // Store in localStorage for persistence
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Notify other tabs about login
      window.dispatchEvent(
        new CustomEvent('userLogin', {
          detail: { token: data.token, user: data.user }
        })
      );

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      
      // Store in state
      setToken(data.token);
      setUser(data.user);

      // Store in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Notify other tabs about login
      window.dispatchEvent(
        new CustomEvent('userLogin', {
          detail: { token: data.token, user: data.user }
        })
      );

      return data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = () => {
    try {
      authService.logout();
      
      // Clear state
      setUser(null);
      setToken(null);

      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Notify other tabs about logout
      window.dispatchEvent(new CustomEvent('userLogout'));
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Notify other tabs
    window.dispatchEvent(
      new CustomEvent('userUpdated', {
        detail: { user: userData }
      })
    );
  };

  const value = {
    user,
    loading,
    token,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role === 'admin',
    isStaff: user?.role === 'staff',
    isClient: user?.role === 'client'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
