// src/context/SocketContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeSocket, disconnectSocket } from '../services/socketService'; 
import { useAuth } from './AuthContext';

const SocketContext = createContext();

  export const SocketProvider = ({ children }) => {
  const { user, token, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (isAuthenticated && token) {
      // Initialize socket connection
      const socketInstance = initializeSocket(token);

      socketInstance.on('connect', () => {
        setIsConnected(true);
        console.log('✅ Connected to server');
      });

      socketInstance.on('disconnect', () => {
        setIsConnected(false);
        console.log('❌ Disconnected from server');
      });

      // Listen for online users
      socketInstance.on('online_users', (users) => {
        setOnlineUsers(users);
      });

      // User joined notification
      socketInstance.on('user_joined', (userData) => {
        console.log('👤 User joined:', userData);
        setOnlineUsers(prev => [...prev, userData]);
      });

      // User left notification
      socketInstance.on('user_left', (userId) => {
        console.log('👤 User left:', userId);
        setOnlineUsers(prev => prev.filter(u => u.id !== userId));
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    }
  }, [isAuthenticated, token]);

  const value = {
    socket,
    isConnected,
    onlineUsers,
    emit: (event, data) => socket?.emit(event, data),
    on: (event, callback) => socket?.on(event, callback),
    off: (event, callback) => socket?.off(event, callback)
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};
