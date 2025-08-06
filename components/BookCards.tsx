'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { OpenLibraryBook, RecommendedBook } from '@/types';
import { generateBookSlug } from '@/utils/bookUtils';

interface BookCardsProps {
  books: RecommendedBook[];
  pageType: 'recommendation' | 'profile';
  onBookClick?: (book: OpenLibraryBook) => void;
}

const BookCards: React.FC<BookCardsProps> = ({
  books,
  pageType,
  onBookClick,
}) => {
  const gradients = [
    'from-peach to-salmon',
    'from-salmon to-rose-red',
    'from-space-pink-dark to-space-red',
  ];

  const renderEmptyState = () => {
    switch (pageType) {
      case 'recommendation':
        return (
          <div className="glass-card rounded-3xl p-8 text-center">
            <div className="text-6xl mb-4 opacity-50">🔍</div>
            <h3 className="text-2xl font-semibold text-space-brown mb-2">No recommendations yet</h3>
            <p className="text-warm-brown opacity-75">Try describing your favorite genres or books above!</p>
          </div>
        );
      case 'profile':
        return (
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
        );
      default:
        return null;
    }
  };

  if (books.length === 0) {
    return (
      <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
        {renderEmptyState()}
      </div>
    );
  }
  
  const displayBooks = pageType === 'profile' ? books.slice(0, 3) : books;

  return (
    <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
      <div className="glass-card rounded-3xl p-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-semibold text-space-brown font-serif">
            {pageType === 'recommendation' ? 'Recommended for You' : 'Favorite Books'}
          </h3>
          {pageType === 'profile' && (
            <Link
              href="/my-books"
              className="text-salmon hover:text-rose-red transition-colors font-medium text-lg flex items-center group"
            >
              View All Books
              <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayBooks.map((book, index) => {
            const slug = generateBookSlug(book);
            const searchParams = new URLSearchParams({
              title: book.title,
              author: book.author_name || 'Unknown',
              key: book.key,
              ...(book.cover_url && { cover_url: book.cover_url }),
              ...(book.isbn?.[0] && { isbn: book.isbn[0] }),
              ...(book.cover_i && { cover_i: book.cover_i.toString() }),
              ...(book.first_publish_year && { year: book.first_publish_year.toString() }),
              ...(book.publisher?.[0] && { publisher: book.publisher[0] }),
              ...(book.number_of_pages && { pages: book.number_of_pages.toString() }),
              ...(book.description && typeof book.description === 'string' && { description: book.description }),
            }).toString();

            return (
              <Link
                key={book.key || index}
                href={`/books/${slug}?${searchParams.toString()}`}
                className="book-preview-card rounded-2xl p-6 group cursor-pointer"
                onClick={() => onBookClick?.(book)}
              >
                <div
                  className={`bg-gradient-to-br ${gradients[index % gradients.length]} rounded-xl mb-4 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300`}
                >
                  <Image
                    src={book.cover_url}
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
                  by {book.author_name}
                </p>
              </Link>
            );
          })}
          {pageType === 'profile' && books.length > 3 && (
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

export default BookCards;