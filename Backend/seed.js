const mongoose = require('mongoose');
const State = require('./models/State');
const City = require('./models/City');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await State.deleteMany({});
    await City.deleteMany({});
    console.log('Cleared existing data');

    // Create states
    const maharashtra = await State.create({ state_name: 'Maharashtra' });
    const gujarat = await State.create({ state_name: 'Gujarat' });
    const karnataka = await State.create({ state_name: 'Karnataka' });
    const delhi = await State.create({ state_name: 'Delhi' });
    console.log('Created states');

    // Create cities
    await City.create([
      { city_name: 'Mumbai', state: maharashtra._id },
      { city_name: 'Pune', state: maharashtra._id },
      { city_name: 'Nagpur', state: maharashtra._id },
      { city_name: 'Ahmedabad', state: gujarat._id },
      { city_name: 'Surat', state: gujarat._id },
      { city_name: 'Bangalore', state: karnataka._id },
      { city_name: 'Mysore', state: karnataka._id },
      { city_name: 'New Delhi', state: delhi._id }
    ]);
    console.log('Created cities');

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();