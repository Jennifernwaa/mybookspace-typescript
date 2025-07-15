import mongoose from 'mongoose';

const feedSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  authorName: {
    type: String,
    required: true,
  },
  originalAuthorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  likes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  comments: [{
    content: String,
    authorId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' },
    authorName: String,
    timestamp: { 
      type: Date, 
      default: Date.now },
  }],
  authorAvatar: String
}, {
  timestamps: true,
});

// Index for faster queries
feedSchema.index({ userId: 1, createdAt: -1 });
feedSchema.index({ postId: 1 });

export const Feed = mongoose.models.Feed || mongoose.model('Feed', feedSchema);