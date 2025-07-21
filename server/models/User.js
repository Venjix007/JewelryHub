import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['customer', 'seller', 'admin'],
    default: 'customer',
  },
  phone: {
    type: String,
    trim: true,
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  avatar: {
    type: String,
    default: '',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  // Seller specific fields
  storeName: {
    type: String,
    trim: true,
  },
  storeDescription: {
    type: String,
    trim: true,
  },
  businessLicense: {
    type: String,
    trim: true,
  },
  // Admin specific fields
  permissions: [{
    type: String,
    enum: ['manage_users', 'manage_products', 'manage_categories', 'manage_orders'],
  }],
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    // Check if password is already hashed
    const isHashed = this.password && this.password.startsWith('$2a$');
    if (!isHashed) {
      // Generate salt and hash password only if it's not already hashed
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      console.log('Pre-save hash:', hashedPassword);
      this.password = hashedPassword;
    } else {
      console.log('Password is already hashed, skipping rehashing');
    }
    next();
  } catch (error) {
    console.error('Error hashing password:', error);
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  console.log('Comparing passwords:', {
    candidatePassword: candidatePassword,
    storedPassword: this.password
  });

  // First check if the stored password is a valid bcrypt hash
  const isValidHash = bcrypt.compareSync(candidatePassword, this.password);
  console.log('Synchronous comparison result:', isValidHash);
  
  // If sync check fails, try async comparison
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  console.log('Asynchronous comparison result:', isMatch);

  // Try comparing with raw password (in case of encoding issues)
  const isMatchRaw = await bcrypt.compare(candidatePassword, this.password);
  console.log('Raw comparison result:', isMatchRaw);

  // Try comparing with trimmed password
  const isMatchTrimmed = await bcrypt.compare(candidatePassword.trim(), this.password);
  console.log('Trimmed comparison result:', isMatchTrimmed);

  // Return true if any comparison succeeds
  return isMatch || isValidHash || isMatchRaw || isMatchTrimmed;
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

export default mongoose.model('User', userSchema);