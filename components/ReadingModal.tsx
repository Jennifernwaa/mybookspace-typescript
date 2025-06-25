'use client';

import React, { useState, useEffect } from 'react';
import { Book, ReadingProgress } from '../types';

interface ReadingModalProps {
  book: Book;
  onClose: () => void;
  onUpdate: (progressData: ReadingProgress) => Promise<void>;
}

const ReadingModal: React.FC<ReadingModalProps> = ({ book, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: book.title || '',
    author: book.author || '',
    status: book.status || 'reading',
    progress: book.progress || 0
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const progress = parseInt(e.target.value);
    setFormData(prev => ({ ...prev, progress }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      await onUpdate({
        title: formData.title,
        author: formData.author,
        status: formData.status,
        progress: formData.progress
      });
    } catch (error) {
      console.error('Error updating book:', error);
      alert('Error updating book. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-gradient-to-br from-cream-light to-ivory rounded-3xl p-8 max-w-md w-full shadow-2xl border border-salmon/20">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-space-brown font-serif mb-2">
            Update Reading Progress
          </h3>
          <p className="text-warm-brown opacity-75">Track your current reading progress</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-warm-brown font-medium mb-2">Book Title</label>
            <input 
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-salmon/20 bg-white/70 focus:border-salmon focus:outline-none transition-colors" 
              placeholder="Enter book title"
              readOnly
            />
          </div>
          
          <div>
            <label className="block text-warm-brown font-medium mb-2">Author</label>
            <input 
              type="text" 
              value={formData.author}
              onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-salmon/20 bg-white/70 focus:border-salmon focus:outline-none transition-colors" 
              placeholder="Enter author name"
              readOnly
            />
          </div>
          
          <div>
            <label className="block text-warm-brown font-medium mb-2">Reading Progress</label>
            <div className="space-y-3">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={formData.progress}
                onChange={handleProgressChange}
                className="w-full h-2 bg-cream-medium rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-warm-brown">
                <span>0%</span>
                <span className="font-semibold text-salmon">{formData.progress}%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-warm-brown font-medium mb-2">Reading Status</label>
            <select 
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as "reading" | "finished" | "wantToRead" }))}
              className="w-full px-4 py-3 rounded-xl border border-salmon/20 bg-white/70 focus:border-salmon focus:outline-none transition-colors"
            >
              <option value="wantToRead">Want to Read</option>
              <option value="reading">Currently Reading</option>
              <option value="finished">Finished</option>
            </select>
          </div>
          
          <div className="flex gap-4 mt-8">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-warm-brown/20 text-warm-brown hover:bg-cream-medium transition-colors"
              disabled={isUpdating}
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isUpdating}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-peach to-salmon text-white font-semibold hover:from-salmon hover:to-rose-red transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? 'Updating...' : 'Update Progress'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReadingModal;