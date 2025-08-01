'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Book } from '../types';

interface FavoriteBookSectionProps {
  books: Book[];
  onBookClick?: (book: Book) => void;
}

const FavoriteBookSection: React.FC<FavoriteBookSectionProps> = ({
  books,
  onBookClick,
}) => {
  const gradients = [
    'from-peach to-salmon',
    'from-salmon to-rose-red',
    'from-space-pink-dark to-space-red',
  ];

  if (books.length === 0) {
    return (
      <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
        <div className="glass-card rounded-3xl p-8">
          <h3 className="text-2xl font-semibold text-space-brown mb-6 font-serif text-center">Favorite Books</h3>
          <div className="text-center py-12">
            <div className="text-6xl mb-4 opacity-50">📚</div>
            <h3 className="text-2xl font-semibold text-space-brown mb-4">No favorite books yet</h3>
            <p className="text-warm-brown opacity-75 mb-6">Mark books as favorite to see them here!</p>
            <Link
              href="/my-books"
              className="bg-space-red text-white px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-all transform hover:scale-105 shadow-lg inline-block"
            >
              Browse Books
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
          <h3 className="text-2xl font-semibold text-space-brown font-serif">
            Favorite Books
          </h3>
          <Link
            href="/my-books"
            className="text-salmon hover:text-rose-red transition-colors font-medium text-lg flex items-center group"
          >
            View All Books
            <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayBooks.map((book, index) => (
            <div
              key={book._id}
              className="book-preview-card rounded-2xl p-6 group cursor-pointer"
              onClick={() => onBookClick && onBookClick(book)}
            >
              <div className={`bg-gradient-to-br ${gradients[index % 3]} rounded-xl mb-4 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                <Image
                  src={
                    book.cover_url && book.cover_url !== "https://via.placeholder.com/150?text=No+Cover"
                      ? book.cover_url
                      : "/images/hardcover.png"
                  }
                  alt={`Cover for ${book.title}`}
                  width={150}
                  height={300}
                  className="object-cover h-full w-full rounded-xl"
                  style={{ maxHeight: '100%', maxWidth: '100%' }}
                />
              </div>
              <h3 className="font-bold text-space-brown mb-2 text-lg truncate">
                {book.title}
              </h3>
              <p className="text-warm-brown text-sm opacity-75 mb-3 truncate">
                by {book.author}
              </p>
            </div>
          ))}
          {books.length > 3 && (
            <div className="book-preview-card rounded-2xl p-6 group cursor-pointer flex items-center justify-center text-center bg-opacity-50">
              <Link href="/my-books" className="block">
                <div className="text-4xl mb-2 opacity-60">📚</div>
                <p className="text-space-brown font-semibold">+{books.length - 3} more books</p>
                <p className="text-sm text-warm-brown opacity-75">View all favorites</p>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoriteBookSection;