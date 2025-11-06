// src/context/AuthContext.jsx - FIXED
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

  // ✅ Initialize from localStorage on mount ONLY
  useEffect(() => {
    console.log('🔍 AuthProvider: Initializing auth');
    
    const initAuth = async () => {
      try {
        // Get stored token and user
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        console.log('📦 Stored:', { token: !!storedToken, user: !!storedUser });

        if (storedToken && storedUser) {
          console.log('✅ Found stored auth, restoring');
          
          try {
            // ✅ Verify token is valid
            const response = await authService.verifyToken(storedToken);
            
            console.log('🔑 Verify response:', response);

            if (response.success || response.valid) {
              console.log('✅ Token valid, restoring auth');
              setToken(storedToken);
              setUser(JSON.parse(storedUser));
            } else {
              console.log('❌ Token invalid, clearing');
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              setUser(null);
              setToken(null);
            }
          } catch (error) {
            console.warn('⚠️ Token verification error:', error.message);
            
            // ✅ IMPORTANT: Don't clear auth on verification error!
            // Keep the token if verification just failed
            console.log('✅ Keeping token despite verification error');
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
          }
        } else {
          console.log('❌ No stored auth');
          setUser(null);
          setToken(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
        console.log('✅ Auth initialization complete');
      }
    };

    initAuth();
  }, []); // ✅ Run ONLY once on mount

  // ✅ Listen for storage changes from other tabs
  useEffect(() => {
    console.log('🔔 Setting up storage listeners');
    
    const handleStorageChange = (e) => {
      console.log('📦 Storage event:', e.key, e.newValue ? 'set' : 'removed');
      
      if (e.key === 'token') {
        if (e.newValue) {
          setToken(e.newValue);
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        } else {
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

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // ✅ LOGIN
  const login = async (credentials) => {
    try {
      console.log('🔐 Login attempt');
      
      const data = await authService.login(credentials);
      
      console.log('✅ Login successful:', data.user.username);

      // ✅ Save token and user
      setToken(data.token);
      setUser(data.user);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      console.log('💾 Saved to localStorage');

      return data;
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  };

  // ✅ REGISTER
  const register = async (userData) => {
    try {
      console.log('📝 Register attempt');
      
      const data = await authService.register(userData);
      
      setToken(data.token);
      setUser(data.user);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      return data;
    } catch (error) {
      console.error('❌ Register error:', error);
      throw error;
    }
  };

  // ✅ LOGOUT
  const logout = () => {
    try {
      console.log('👋 Logout');
      
      authService.logout();
      
      setUser(null);
      setToken(null);

      localStorage.removeItem('token');
      localStorage.removeItem('user');

      console.log('✅ Logout complete');
    } catch (error) {
      console.error('❌ Logout error:', error);
    }
  };

  // ✅ UPDATE USER
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // ✅ Context value
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
