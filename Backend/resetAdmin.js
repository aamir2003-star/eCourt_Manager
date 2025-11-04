const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const testLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const User = require('./models/User');

    // Find admin user
    const admin = await User.findOne({ username: 'admin' });

    if (!admin) {
      console.log('❌ Admin user not found!');
      console.log('💡 Run: node createAdmin.js');
      process.exit(1);
    }

    console.log('✅ Admin user found:');
    console.log('   Username:', admin.username);
    console.log('   Role:', admin.role);
    console.log('   Email:', admin.email);
    console.log('   Active:', admin.isActive);
    console.log('   Has Password:', !!admin.password);
    console.log('   Password Hash:', admin.password ? admin.password.substring(0, 20) + '...' : 'MISSING!');

    // Test password comparison
    console.log('\n🔐 Testing password "admin123"...');
    const isMatch = await bcrypt.compare('admin123', admin.password);
    
    if (isMatch) {
      console.log('✅ Password matches! Login should work.');
    } else {
      console.log('❌ Password does NOT match!');
      console.log('💡 Try resetting admin password');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

testLogin();