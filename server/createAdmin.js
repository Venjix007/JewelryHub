import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error('MongoDB connection string (MONGO_URI or MONGODB_URI) not found in .env file.');
  process.exit(1);
}

async function createAdmin() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const email = 'admin@jewelry.com';
    const password = 'admin123';
    const name = 'Admin';
    const role = 'admin';

    // Delete any existing admin user
    await User.deleteOne({ email });
    console.log('Deleted existing admin user if any');

    // Create new admin user
    console.log('Creating admin with password:', password);
    const adminUser = new User({
      name,
      email,
      role,
    });
    
    // Hash password and set directly
    const hashedPassword = await bcrypt.hash(password, 10);
    adminUser.password = hashedPassword;
    
    // Save user with options to bypass pre-save
    const savedUser = await adminUser.save({ validateBeforeSave: false });
    console.log('Saved user with password:', savedUser.password);

    await adminUser.save();
    console.log('Admin user created successfully:', email);
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin user:', err);
    process.exit(1);
  }
}

createAdmin();
