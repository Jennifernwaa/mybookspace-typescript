'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Book } from '../types';

interface CurrentlyReadingSectionProps {
  books: Book[];
  onBookClick: (book: Book) => void;
}

const CurrentlyReadingSection: React.FC<CurrentlyReadingSectionProps> = ({ 
  books, 
  onBookClick 
}) => {
  const gradients = [
    'from-peach to-salmon',
    'from-salmon to-rose-red',
    'from-space-pink-dark to-space-red'
  ];

  if (books.length === 0) {
    return (
      <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
        <div className="glass-card rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-semibold text-space-brown font-serif">
              Continue Your Journey
            </h2>
            <Link 
              href="/my-books" 
              className="text-salmon hover:text-rose-red transition-colors font-medium text-lg flex items-center group"
            >
              View All Books 
              <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
          
          <div className="text-center py-12">
            <div className="text-6xl mb-4 opacity-50">📚</div>
            <h3 className="text-2xl font-semibold text-space-brown mb-4">No books in progress</h3>
            <p className="text-warm-brown opacity-75 mb-6">Ready to start your next reading adventure?</p>
            <Link 
              href="/add-books"
              className="bg-space-red text-white px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-all transform hover:scale-105 shadow-lg inline-block"
            >
              Add Your First Book
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const displayBooks = books.slice(0, 3);

  return (
    <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
      <div className="glass-card rounded-3xl p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-semibold text-space-brown font-serif">
            Continue Your Journey
          </h2>
          <Link 
            href="/my-books" 
            className="text-salmon hover:text-rose-red transition-colors font-medium text-lg flex items-center group"
          >
            View All Books 
            <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayBooks.map((book, index) => {
            const progress = book.progress || 0;
            const coverUrl = book.cover_url || "/images/placeholder-book.png";
            
            return (
              <div 
                key={book.id}
                className="book-preview-card rounded-2xl p-6 group cursor-pointer" 
                onClick={() => onBookClick(book)}
              >
                <div className={`h-40 bg-gradient-to-br ${gradients[index % 3]} rounded-xl mb-4 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                  <Image
                    src={coverUrl}
                    alt={`Cover for ${book.title}`}
                    width={150}
                    height={200}
                    className="object-cover h-full w-full rounded-xl"
                    style={{ maxHeight: '100%', maxWidth: '100%' }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/placeholder-book.png';
                    }}
                  />
                </div>
                <h3 className="font-bold text-space-brown mb-2 text-lg truncate">
                  {book.title}
                </h3>
                <p className="text-warm-brown text-sm opacity-75 mb-3 truncate">
                  by {book.author}
                </p>
                <div className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-warm-brown">Progress</span>
                    <span className="text-space-red font-semibold">{progress}%</span>
                  </div>
                  <div className="w-full bg-cream-medium rounded-full h-2">
                    <div 
                      className="progress-bar rounded-full transition-all duration-500" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-xs text-warm-brown opacity-60 mt-2">
                  {book.progress || 0} %
                </p>
              </div>
            );
          })}

          {/* If there are more than 3 books, add a "View All" card */}
          {books.length > 3 && (
            <div className="book-preview-card rounded-2xl p-6 group cursor-pointer flex items-center justify-center text-center bg-opacity-50">
              <Link href="/my-books" className="block">
                <div className="text-4xl mb-2 opacity-60">📚</div>
                <p className="text-space-brown font-semibold">+{books.length - 3} more books</p>
                <p className="text-sm text-warm-brown opacity-75">View all reading</p>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrentlyReadingSection;