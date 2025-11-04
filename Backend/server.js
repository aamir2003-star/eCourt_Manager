// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { verifySocketToken } = require('./middleware/auth');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.io setup with CORS
const io = socketIo(server, {
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      process.env.CLIENT_URL
    ],
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', process.env.CLIENT_URL],
  credentials: true
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create upload directories
const fs = require('fs');
const uploadDirs = ['uploads/documents', 'uploads/photos'];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// ========== Socket.io Middleware & Connection ==========

// Store online users
const onlineUsers = new Map();

// Socket.io authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error('Authentication token required'));
  }

  const verification = verifySocketToken(token);
  
  if (!verification.valid) {
    return next(new Error('Invalid authentication token'));
  }

  socket.userId = verification.userId;
  socket.decoded = verification.decoded;
  next();
});

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.userId} (Socket ID: ${socket.id})`);

  // Store user as online
  onlineUsers.set(socket.userId, {
    id: socket.userId,
    socketId: socket.id,
    role: socket.decoded.role,
    connectedAt: new Date(),
    lastActivity: new Date()
  });

  // Emit online users to all clients
  io.emit('online_users', Array.from(onlineUsers.values()));

  // Notify others that user joined
  socket.broadcast.emit('user_joined', {
    userId: socket.userId,
    role: socket.decoded.role,
    timestamp: new Date()
  });

  // Join user to their role room
  socket.join(`role_${socket.decoded.role}`);

  // Join user to their personal room
  socket.join(`user_${socket.userId}`);

  // ========== Real-time Case Events ==========

  socket.on('case_updated', (caseData) => {
    console.log(`Case updated: ${caseData._id}`);
    io.emit('case_update', caseData);
  });

  socket.on('case_created', (caseData) => {
    console.log(`Case created: ${caseData._id}`);
    io.emit('case_added', caseData);
  });

  socket.on('case_deleted', (caseId) => {
    console.log(`Case deleted: ${caseId}`);
    io.emit('case_removed', caseId);
  });

  // ========== Document Events ==========

  socket.on('document_uploaded', (data) => {
    console.log(`Document uploaded: ${data.documentId}`);
    io.emit('document_added', data);
  });

  socket.on('document_deleted', (documentId) => {
    console.log(`Document deleted: ${documentId}`);
    io.emit('document_removed', documentId);
  });

  // ========== Hearing Events ==========

  socket.on('hearing_scheduled', (data) => {
    console.log(`Hearing scheduled: ${data.hearingId}`);
    io.emit('hearing_created', data);
  });

  socket.on('hearing_updated', (data) => {
    console.log(`Hearing updated: ${data.hearingId}`);
    io.emit('hearing_update', data);
  });

  socket.on('hearing_cancelled', (hearingId) => {
    console.log(`Hearing cancelled: ${hearingId}`);
    io.emit('hearing_removed', hearingId);
  });

  // ========== Appointment Events ==========

  socket.on('appointment_booked', (data) => {
    console.log(`Appointment booked: ${data.appointmentId}`);
    io.to(`role_staff`).emit('appointment_request', data);
  });

  socket.on('appointment_confirmed', (data) => {
    console.log(`Appointment confirmed: ${data.appointmentId}`);
    io.to(`user_${data.clientId}`).emit('appointment_confirmed', data);
  });

  // ========== Notification Events ==========

  socket.on('send_notification', (data) => {
    io.to(`user_${data.recipientId}`).emit('new_notification', data);
  });

  // ========== Keep-alive & Activity Tracking ==========

  socket.on('activity', () => {
    const user = onlineUsers.get(socket.userId);
    if (user) {
      user.lastActivity = new Date();
      onlineUsers.set(socket.userId, user);
    }
  });

  // ========== Disconnection Handler ==========

  socket.on('disconnect', () => {
    const user = onlineUsers.get(socket.userId);
    onlineUsers.delete(socket.userId);
    
    console.log(`User disconnected: ${socket.userId}`);
    
    // Notify others that user left
    io.emit('user_left', {
      userId: socket.userId,
      timestamp: new Date()
    });
    
    // Update online users list
    io.emit('online_users', Array.from(onlineUsers.values()));
  });

  // ========== Error Handler ==========

  socket.on('error', (error) => {
    console.error(`Socket error for user ${socket.userId}:`, error);
  });
});

// ========== REST API Routes ==========

app.use('/api/auth', require('./routes/auth'));
app.use('/api/cases', require('./routes/case'));
app.use('/api/users', require('./routes/user'));
app.use('/api/appointments', require('./routes/appointment'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/inquiries', require('./routes/inquiry'));
app.use('/api/locations', require('./routes/location'));
app.use('/api/case-requests', require('./routes/caseRequest'));
app.use('/api/notifications', require('./routes/notification'));

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'eCourt Manager API is running',
    onlineUsers: onlineUsers.size
  });
});

app.use(errorHandler);

// ========== Server Start ==========

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Socket.io enabled on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.log(`❌ Error: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = { app, server, io };
