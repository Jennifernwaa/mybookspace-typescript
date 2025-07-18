
import { useCallback, useMemo } from 'react';
import { useUser } from './useUser';
import { useBooks } from './useBooks';
import { User, Book } from '@/types';


export const useProfile = (userId?: string) => {
  const currentUserId = localStorage.getItem('userId');
  const targetUserId = userId || currentUserId;
  const isOwnProfile = targetUserId === currentUserId;

  const { 
    userData, 
    isLoading: userLoading, 
    error: userError, 
    updateUser, 
    refetchUser 
  } = useUser(targetUserId);

  const { 
    books, 
    isLoading: booksLoading, 
    error: booksError, 
    fetchBooksByStatus, 
    fetchFavoriteBooks,
    refetchBooks
  } = useBooks(targetUserId);

  // Calculate reading stats
  const readingStats = useMemo(() => {
    const finishedBooks = books.filter(book => book.status === 'finished');
    const currentlyReading = books.filter(book => book.status === 'reading');
    const wantToRead = books.filter(book => book.status === 'wantToRead');
    const favoriteBooks = books.filter(book => book.favorite);

    return {
      booksRead: finishedBooks.length,
      currentlyReading: currentlyReading.length,
      wantToRead: wantToRead.length,
      favoriteBooks: favoriteBooks.length,
      totalBooks: books.length,
    };
  }, [books]);

  // Get friends count
  const friendsCount = useMemo(() => {
    return userData?.friends ? userData.friends.length : 0;
  }, [userData]);

  // Update profile with validation
  const updateProfile = useCallback(async (updates) => {
    if (!userData?._id) throw new Error('No user ID');
    const res = await fetch(`/api/users/${userData._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update profile');
    }
    // Optionally refetch user data here
  }, [userData]);

  // Get recent activity (mock implementation - you'll need to implement this)
  const getRecentActivity = useCallback(async () => {
    // This would typically fetch from an activity/timeline API
    // For now, we'll derive it from recent books
    const recentBooks = books
      .filter(book => book.dateCompleted || book.dateAdded)
      .sort((a, b) => {
        const dateA = new Date(book.dateCompleted || book.dateAdded).getTime();
        const dateB = new Date(b.dateCompleted || b.dateAdded).getTime();
        return dateB - dateA;
      })
      .slice(0, 5);

    return recentBooks.map(book => ({
      type: book.status === 'finished' ? 'completed' : 'started',
      book: book,
      date: book.dateCompleted || book.dateAdded,
    }));
  }, [books]);

  const isLoading = userLoading || booksLoading;
  const error = userError || booksError;

  const refetchProfile = useCallback(() => {
    refetchUser();
    refetchBooks();
  }, [refetchUser, refetchBooks]);

  return {
    userData,
    books,
    isLoading,
    error,
    isOwnProfile,
    readingStats,
    friendsCount,
    updateProfile,
    fetchBooksByStatus,
    fetchFavoriteBooks,
    getRecentActivity,
    refetchProfile,
  };
};