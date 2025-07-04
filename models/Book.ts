// models/Book.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface Book extends Document {
  userId: mongoose.Types.ObjectId; // Reference to the User who owns this book
  title: string;
  author: string;
  status: 'reading' | 'finished' | 'wantToRead';
  progress?: number;
  isbn?: string;
  description?: string;
  genre?: string[];
  first_publish_year?: number;
  cover_url?: string;
  publisher?: string;

  favorite?: boolean;
  notes?: string;
  rating?: number;

  dateAdded: string; // ISO string format
  startDate?: string;
  endDate?: string;
}

const BookSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId, // This links the book to a specific user
    ref: 'User', // References the 'User' model
    required: true,
  },
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['reading', 'finished', 'wantToRead'],
    required: true,
    index: true
  },
  progress: {
    type: Number,
    default: 0
  },
  totalPages: { // Added from your provided schema
    type: Number,
    default: 0
  },
  isbn: {
    type: String,
    sparse: true // Added sparse index
  },
  cover_url: {
    type: String
  },
  description: { // Added from your provided interface/schema
    type: String
  },
  genre: { // Added from your provided interface/schema
    type: [String],
    default: []
  },
  first_publish_year: { // Updated to match your provided schema
    type: Number,
    required: false,
  },
  publisher: { // Updated to match your provided schema
    type: String,
    required: false,
  },
  favorite: { // Added from your provided interface
    type: Boolean,
    default: false
  },
  notes: { // Added from your provided interface
    type: String
  },
  rating: { // Added from your provided interface/schema
    type: Number,
    min: 1,
    max: 5
  },
  review: { // Added from your provided schema
    type: String
  },
  dateAdded: { // Updated to match your provided schema
    type: String,
    default: () => new Date().toISOString()
  },
  startDate: { // Added from your provided interface/schema
    type: String
  },
  endDate: { // Added from your provided interface/schema
    type: String
  },
  createdAt: { // Manually handled timestamps as per your provided schema
    type: String,
    default: () => new Date().toISOString()
  },
  updatedAt: { // Manually handled timestamps as per your provided schema
    type: String,
    default: () => new Date().toISOString()
  }
}, {
  timestamps: false, // Set to false as you're handling timestamps manually
});

// Index for efficient queries
BookSchema.index({ userId: 1, status: 1 });
BookSchema.index({ userId: 1, updatedAt: -1 });

export default mongoose.models.Book || mongoose.model<Book>('Book', BookSchema);
