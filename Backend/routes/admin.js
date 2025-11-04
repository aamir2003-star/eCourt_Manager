const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const User = require('./models/User');

    // Check if admin exists
    const adminExists = await User.findOne({ username: 'admin' });
    if (adminExists) {
      console.log('❌ Admin already exists!');
      process.exit(0);
    }

    // Create admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await User.create({
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
      f_name: 'System',
      l_name: 'Admin',
      email: 'admin@ecourt.com',
      contact: 9999999999,
      isActive: true
    });

    console.log('✅ Admin created successfully!');
    console.log('📧 Username: admin');
    console.log('🔑 Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createAdmin();