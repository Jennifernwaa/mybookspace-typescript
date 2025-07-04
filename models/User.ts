import mongoose, { Schema, Document } from 'mongoose';

export interface User extends Document {
  email: string;
  password: string;
  userName: string;
  fullName: string;
  readingGoal: number;
  dateJoined: string;
  lastActive: string;
  friends: Record<string, any>;
  createdAt: string;
}

const UserSchema: Schema = new Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  userName: {
    type: String,
    required: false,
    unique: true,
    index: true
  },
  fullName: {
    type: String,
    required: false
  },
  readingGoal: {
    type: Number,
    required: false,
    default: 12
  },
  dateJoined: {
    type: String,
    required: false
  },
  lastActive: {
    type: String,
    required: false
  },
  friends: {
    type: Schema.Types.Mixed,
    default: {}
  },
  createdAt: {
    type: String,
    default: () => new Date().toISOString()
  }
}, {
  timestamps: true,
});

export default mongoose.models.User || mongoose.model<User>('User', UserSchema);