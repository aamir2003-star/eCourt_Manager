const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Import User model
    const User = require('./models/User');

    // Delete existing admin if exists (to fix double-hashing issue)
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (existingAdmin) {
      await User.deleteOne({ username: 'admin' });
      console.log('🗑️  Deleted existing admin user (fixing password hash)');
    }

    // Create admin user with PLAIN password
    // The pre-save hook in User model will hash it automatically
    const admin = new User({
      username: 'admin',
      password: 'admin123',  // ✅ Plain password - pre-save hook will hash it
      role: 'admin',
      f_name: 'System',
      l_name: 'Administrator',
      email: 'admin@ecourt.com',
      contact: 9999999999,
      isActive: true,
      date_of_reg: new Date()
    });

    // Save - pre-save hook will automatically hash the password
    await admin.save();

    console.log('\n✅ Admin user created successfully!');
    console.log('═══════════════════════════════════');
    console.log('📧 Username: admin');
    console.log('🔑 Password: admin123');
    console.log('🌐 Login at: http://localhost:5173/login');
    console.log('═══════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
