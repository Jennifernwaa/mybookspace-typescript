
import { useEffect, useState, useCallback } from 'react';
import { Book, ApiResponse } from '@/types';

export const useBooks = (userId?: string) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [favoriteBooks, setFavoriteBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const targetUserId = userId || localStorage.getItem('userId');

  const fetchUserBooks = useCallback(async () => {
    if (!targetUserId) {
      setIsLoading(false);
      return;
    }
      setIsLoading(true);
      setError(null);
    try {
      // Use Promise.all to fetch both lists concurrently
      const [userBooksRes, favoriteBooksRes] = await Promise.all([
        fetch(`/api/users/${targetUserId}/books`),
        fetch(`/api/users/${targetUserId}/books/favorites`),
      ]);

      if (!userBooksRes.ok) {
        throw new Error(`Failed to fetch user books: ${userBooksRes.status}`);
      }
      if (!favoriteBooksRes.ok) {
        throw new Error(`Failed to fetch favorite books: ${favoriteBooksRes.status}`);
      }
      
      const userBooksResponse: ApiResponse<Book[]> = await userBooksRes.json();
      const favoriteBooksResponse: ApiResponse<Book[]> = await favoriteBooksRes.json();

      if (userBooksResponse.success && userBooksResponse.data) {
        setBooks(userBooksResponse.data);
      } else {
        throw new Error(userBooksResponse.error || 'Failed to fetch user books');
      }

      if (favoriteBooksResponse.success && favoriteBooksResponse.data) {
        setFavoriteBooks(favoriteBooksResponse.data);
      } else {
        throw new Error(favoriteBooksResponse.error || 'Failed to fetch favorite books');
      }

    } catch (err) {
      console.error('Error fetching all books:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setBooks([]);
      setFavoriteBooks([]);
    } finally {
      setIsLoading(false);
    }
  }, [targetUserId]);

  const fetchBooksByStatus = useCallback(async (status: string) => {
    if (!targetUserId) return [];

    try {
      const res = await fetch(`/api/users/${targetUserId}/books?status=${status}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch ${status} books`);
      }
      
      const response: ApiResponse<Book[]> = await res.json();
      return response.success && response.data ? response.data : [];
    } catch (err) {
      console.error(`Error fetching ${status} books:`, err);
      return [];
    }
  }, [targetUserId]);

  const fetchFavoriteBooks = useCallback(async () => {
    if (!targetUserId) return [];

    try {
      const res = await fetch(`/api/users/${targetUserId}/books/favorites`);
      if (!res.ok) {
        throw new Error('Failed to fetch favorite books');
      }
      
      const response: ApiResponse<Book[]> = await res.json();
      if (response.success && response.data) {
        setFavoriteBooks(response.data);
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to fetch favorite books');
      }
    } catch (err) {
      console.error('Error fetching favorite books:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [targetUserId]);

  const updateBook = useCallback(async (bookId: string, updates: Partial<Book>) => {
    if (!targetUserId) return;

    try {
      const res = await fetch(`/api/users/${targetUserId}/books/${bookId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        throw new Error(`Failed to update book: ${res.status}`);
      }

      const response: ApiResponse<Book> = await res.json();
      if (response.success && response.data) {
        // Update local state
        setBooks(prevBooks => 
          prevBooks.map(book => 
            book._id === bookId ? { ...book, ...response.data } : book
          )
        );
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to update book');
      }
    } catch (err) {
      console.error('Error updating book:', err);
      throw err;
    }
  }, [targetUserId]);

  const addBook = useCallback(async (bookData: Omit<Book, '_id'>) => {
    if (!targetUserId) return;

    try {
      const res = await fetch(`/api/users/${targetUserId}/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });

      if (!res.ok) {
        throw new Error(`Failed to add book: ${res.status}`);
      }

      const response: ApiResponse<Book> = await res.json();
      if (response.success && response.data) {
        setBooks(prevBooks => [...prevBooks, response.data!]);
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to add book');
      }
    } catch (err) {
      console.error('Error adding book:', err);
      throw err;
    }
  }, [targetUserId]);

  const deleteBook = useCallback(async (bookId: string) => {
    if (!targetUserId) return;

    try {
      const res = await fetch(`/api/users/${targetUserId}/books/${bookId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error(`Failed to delete book: ${res.status}`);
      }

      const response: ApiResponse<void> = await res.json();
      if (response.success) {
        setBooks(prevBooks => prevBooks.filter(book => book._id !== bookId));
      } else {
        throw new Error(response.error || 'Failed to delete book');
      }
    } catch (err) {
      console.error('Error deleting book:', err);
      throw err;
    }
  }, [targetUserId]);

  const refetchBooks = useCallback(() => {
    fetchUserBooks();
    fetchFavoriteBooks();
  }, [fetchUserBooks, fetchFavoriteBooks]);

  useEffect(() => {
    fetchUserBooks();
    fetchFavoriteBooks();
  }, [fetchUserBooks, fetchFavoriteBooks]);

  return {
    books,
    favoriteBooks,
    isLoading,
    error,
    fetchBooksByStatus,
    fetchFavoriteBooks,
    updateBook,
    addBook,
    deleteBook,
    refetchBooks,
  };
};

