'use client';

import React, { KeyboardEvent, memo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDashboard } from '@/hooks/useDashboard';
import { useBookSearch } from '@/hooks/useBookSearch';
import { useBookSave } from '@/hooks/useBookSave';
import { useDebounce } from '@/utils/bookUtils';
import { OpenLibraryBook } from '@/types';
import { getCoverUrl, generateBookSlug } from '@/utils/bookUtils';

// Memoized components for better performance
const BookCover = memo(({ book, className }: { book: OpenLibraryBook; className?: string }) => (
  <div className={`bg-gradient-to-br from-peach to-salmon rounded-lg flex items-center justify-center text-white text-2xl shadow-lg overflow-hidden ${className}`}>
    <img
      src={getCoverUrl(book, 'M')}
      alt={`Cover for ${book.title}`}
      className="w-full h-full object-cover"
      onError={(e) => {
        (e.target as HTMLImageElement).src = getCoverUrl(book, 'M');
      }}
    />
  </div>
));

BookCover.displayName = 'BookCover';

const BookResultItem = memo(({ 
  book, 
  onBookClick, 
  onSaveBook, 
  isSaving 
}: { 
  book: OpenLibraryBook; 
  onBookClick: (book: OpenLibraryBook) => void;
  onSaveBook: (book: OpenLibraryBook) => void;
  isSaving: boolean;
}) => (
  <div
    className="result-card rounded-2xl p-6 flex items-center space-x-4 cursor-pointer hover:shadow-lg transition-all"
    onClick={() => onBookClick(book)}
  >
    <BookCover book={book} className="w-16 h-20" />
    
    <div className="flex-1 min-w-0">
      <h4 className="font-bold text-space-brown text-lg truncate">{book.title}</h4>
      <p className="text-warm-brown opacity-75 truncate">
        by {book.author_name?.[0] || "Unknown"}
      </p>
      <div className="text-sm text-warm-brown opacity-60 mt-1 space-y-1">
        <p>Publisher: {book.publisher?.[0] || "Unknown"}</p>
        <p>First published: {book.first_publish_year || "Unknown"}</p>
        <p>ISBN: {book.isbn?.[0] || "Not available"}</p>
      </div>
    </div>
    
    <button
      className="save-button text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
      disabled={isSaving}
      onClick={(event) => {
        event.stopPropagation();
        onSaveBook(book);
      }}
    >
      {isSaving ? 'Saving...' : 'Save Book'}
    </button>
  </div>
));

BookResultItem.displayName = 'BookResultItem';

const SearchResults = memo(({ 
  results, 
  onBookClick, 
  onSaveBook, 
  isSaving 
}: { 
  results: OpenLibraryBook[];
  onBookClick: (book: OpenLibraryBook) => void;
  onSaveBook: (book: OpenLibraryBook) => void;
  isSaving: boolean;
}) => (
  <div>
    <h3 className="text-lg font-semibold text-space-brown mb-4">
      Search Results ({results.length}):
    </h3>
    <div className="space-y-4">
      {results.map((book) => (
        <BookResultItem
          key={book.key}
          book={book}
          onBookClick={onBookClick}
          onSaveBook={onSaveBook}
          isSaving={isSaving}
        />
      ))}
    </div>
  </div>
));

SearchResults.displayName = 'SearchResults';

const NotificationToast = memo(({ message, type }: { message: string; type: 'success' | 'error' }) => (
  <div className={`fixed top-24 right-6 px-6 py-4 rounded-xl shadow-lg z-50 animate-fade-in-up ${
    type === 'success' 
      ? 'bg-gradient-to-r from-peach to-salmon text-white' 
      : 'bg-red-500 text-white'
  }`}>
    <div className="flex items-center space-x-2">
      <span className="text-xl">{type === 'success' ? '✅' : '❌'}</span>
      <span className="font-medium">{message}</span>
    </div>
  </div>
));

NotificationToast.displayName = 'NotificationToast';

const SearchBook: React.FC = () => {
  const router = useRouter();
  const { userData } = useDashboard();
  
  const {
    query,
    results,
    isLoading: isSearching,
    error: searchError,
    searchBooks,
    updateQuery,
    clearResults,
  } = useBookSearch();
  
  const {
    isLoading: isSaving,
    error: saveError,
    successMessage,
    saveBook,
    clearMessages,
  } = useBookSave(userData?._id || '');

  // Debounce search query for better UX
  const debouncedQuery = useDebounce(query, 300);

  const handleSearch = () => {
    if (query.trim()) {
      searchBooks(query);
    }
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleBookClick = (book: OpenLibraryBook) => {
    const slug = generateBookSlug(book);
    
    // Use URL params instead of sessionStorage
    const searchParams = new URLSearchParams({
      title: book.title,
      author: book.author_name?.[0] || 'Unknown',
      key: book.key,
      ...(book.isbn?.[0] && { isbn: book.isbn[0] }),
      ...(book.cover_i && { cover_i: book.cover_i.toString() }),
      ...(book.first_publish_year && { year: book.first_publish_year.toString() }),
      ...(book.publisher?.[0] && { publisher: book.publisher[0] }),
      ...(book.number_of_pages_median && { pages: book.number_of_pages_median.toString() }),
      ...(book.language?.[0] && { language: book.language[0] }),
    });

    router.push(`/books/${slug}?${searchParams.toString()}`);
  };

  const handleSaveBook = (book: OpenLibraryBook) => {
    clearMessages();
    saveBook(book);
  };

  return (
    <div className="search-card rounded-3xl p-8 mb-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
      <h2 className="text-2xl font-semibold text-space-brown mb-6 font-serif flex items-center">
        <span className="text-3xl mr-3">🔍</span>
        Search for a Book
      </h2>
      
      {/* Search Input */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => updateQuery(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="Enter book title..."
          className="input-field flex-1 px-4 py-3 rounded-xl text-space-brown placeholder-warm-brown placeholder-opacity-60"
          disabled={isSearching}
        />
        <button
          onClick={handleSearch}
          disabled={isSearching || !query.trim()}
          className="search-button text-white px-8 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 min-w-[120px] disabled:opacity-50"
        >
          <span>{isSearching ? 'Searching...' : 'Search'}</span>
        </button>
      </div>

      {/* Loading State */}
      {isSearching && (
        <div className="text-center py-8">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-warm-brown">Searching for books...</p>
        </div>
      )}

      {/* Error State */}
      {searchError && !isSearching && (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">😔</div>
          <p className="text-warm-brown">{searchError}</p>
          <button
            onClick={clearResults}
            className="mt-4 text-peach hover:text-salmon transition-colors"
          >
            Clear and try again
          </button>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <SearchResults
          results={results}
          onBookClick={handleBookClick}
          onSaveBook={handleSaveBook}
          isSaving={isSaving}
        />
      )}

      {/* Notifications */}
      {successMessage && (
        <NotificationToast message={successMessage} type="success" />
      )}
      {saveError && (
        <NotificationToast message={saveError} type="error" />
      )}
    </div>
  );
};

export default SearchBook;