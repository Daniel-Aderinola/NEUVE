import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  avatar?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { 
      type: String, 
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: { 
      type: String, 
      required: [true, 'Email is required'],
      unique: true, 
      lowercase: true, 
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format'],
    },
    password: { 
      type: String, 
      required: [true, 'Password is required'],
      minlength: [12, 'Password must be at least 12 characters'],
      select: false, // Don't return password by default
    },
    role: { 
      type: String, 
      enum: ['user', 'admin'], 
      default: 'user',
      immutable: true, // Cannot change role after creation
    },
    avatar: { type: String },
    phone: { 
      type: String,
      match: [/^\+?[0-9]{10,15}$/, 'Invalid phone number'],
    },
    address: {
      street: { type: String, maxlength: 255 },
      city: { type: String, maxlength: 100 },
      state: { type: String, maxlength: 100 },
      zipCode: { type: String, match: [/^[0-9]{5,10}$/, 'Invalid zip code'] },
      country: { type: String, maxlength: 100 },
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema);
