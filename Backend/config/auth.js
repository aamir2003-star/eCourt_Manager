
// config/auth.js
module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpire: '7d',
  bcryptSalt: 10
};

