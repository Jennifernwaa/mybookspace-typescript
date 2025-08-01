import mongoose, { Schema, Document } from 'mongoose';

export interface User extends Document {
  email: string;
  password: string;
  userName: string;
  fullName: string;
  readingGoal: number;
  dateJoined: string;
  lastActive: string;
  friends: string[];
  createdAt: string;
  favoriteGenre: string,
  bio: string,
  favoriteAuthor: string,

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
  favoriteGenre: {
    type: String,
    required: false,
  },
  bio: {
    type: String,
    required: false,
  },
  favoriteAuthor: {
    type: String,
    required: false,
  },
  dateJoined: {
    type: String,
    required: false
  },
  lastActive: {
    type: String,
    required: false
  },
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  createdAt: {
    type: String,
    default: () => new Date().toISOString()
  }
}, {
  timestamps: true,
});

// Index for faster queries
UserSchema.index({ friends: 1 });

export default mongoose.models.User || mongoose.model<User>('User', UserSchema);