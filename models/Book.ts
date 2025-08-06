import mongoose, { Schema, Document } from 'mongoose';

export interface IBook extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  author: string;
  status: 'reading' | 'finished' | 'wantToRead';
  progress?: number;
  totalPages?: number;
  isbn?: string;
  description?: string;
  genre?: string[];
  first_publish_year?: number;
  cover_url?: string;
  publisher?: string;
  favorite?: boolean;
  notes?: string;
  rating?: number;
  review?: string;
  dateAdded: string;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

const BookSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['reading', 'finished', 'wantToRead'],
    required: true,
    index: true
  },
  progress: {
    type: Number,
    default: 0,
    min: 0
  },
  totalPages: {
    type: Number,
    default: 0,
    min: 0
  },
  isbn: {
    type: String,
    sparse: true,
    trim: true
  },
  cover_url: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  genre: {
    type: [String],
    default: []
  },
  first_publish_year: {
    type: String,
  },
  publisher: {
    type: String,
    trim: true
  },
  favorite: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    trim: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    trim: true
  },
  dateAdded: {
    type: String,
    default: () => new Date().toISOString()
  },
  startDate: {
    type: String
  },
  endDate: {
    type: String
  },
  createdAt: {
    type: String,
    default: () => new Date().toISOString()
  },
  updatedAt: {
    type: String,
    default: () => new Date().toISOString()
  }
}, {
  timestamps: true 
});

// Compound indexes for efficient queries
BookSchema.index({ userId: 1, status: 1 });
BookSchema.index({ userId: 1, updatedAt: -1 });
BookSchema.index({ userId: 1, favorite: 1 });

// Pre-save middleware to update the updatedAt field
BookSchema.pre('save', function(next) {
  this.updatedAt = new Date().toISOString();
  next();
});

// Pre-update middleware to update the updatedAt field
BookSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function(next) {
  this.set({ updatedAt: new Date().toISOString() });
  next();
});

const Book = mongoose.models.Book || mongoose.model<IBook>('Book', BookSchema);

export default Book;