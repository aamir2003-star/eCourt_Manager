// src/services/socketService.js
import io from 'socket.io-client';

let socket = null;

/**
 * Initialize Socket.io connection with authentication
 * @param {string} token - JWT token for authentication
 * @returns {Socket} Socket instance
 */
export const initializeSocket = (token) => {
  // Disconnect existing socket if any
  if (socket) {
    socket.disconnect();
  }

  // Create new socket connection
  socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
    auth: {
      token: token
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    transports: ['websocket', 'polling']
  });

  // Connection event handlers
  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('❌ Socket disconnected');
  });

  socket.on('connect_error', (error) => {
    console.error('⚠️ Connection error:', error);
  });

  socket.on('error', (error) => {
    console.error('⚠️ Socket error:', error);
  });

  return socket;
};

/**
 * Get current socket instance
 * @returns {Socket|null} Current socket instance or null
 */
export const getSocket = () => {
  return socket;
};

/**
 * Disconnect socket and clean up
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('🔌 Socket disconnected and cleaned up');
  }
};

/**
 * Check if socket is connected
 * @returns {boolean} Connection status
 */
export const isSocketConnected = () => {
  return socket && socket.connected;
};

/**
 * Emit event through socket
 * @param {string} event - Event name
 * @param {*} data - Event data
 */
export const emitSocket = (event, data) => {
  if (socket) {
    socket.emit(event, data);
  } else {
    console.warn('⚠️ Socket not initialized');
  }
};

/**
 * Listen to socket events
 * @param {string} event - Event name
 * @param {Function} callback - Event callback
 */
export const onSocket = (event, callback) => {
  if (socket) {
    socket.on(event, callback);
  } else {
    console.warn('⚠️ Socket not initialized');
  }
};

/**
 * Remove socket event listener
 * @param {string} event - Event name
 * @param {Function} callback - Event callback
 */
export const offSocket = (event, callback) => {
  if (socket) {
    socket.off(event, callback);
  }
};

/**
 * Listen to socket event once
 * @param {string} event - Event name
 * @param {Function} callback - Event callback
 */
export const onceSocket = (event, callback) => {
  if (socket) {
    socket.once(event, callback);
  }
};
