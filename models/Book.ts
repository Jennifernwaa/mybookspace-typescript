import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
  title: String,
  author: String,
  status: String,
  progress: Number,
  rating: Number,
  notes: String,
  dateAdded: Date,
  dateCompleted: Date,
  genre: String,
  cover_url: String,
  favorite: Boolean,
});

export const Book = mongoose.models.Book || mongoose.model("Book", BookSchema);