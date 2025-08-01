'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserData, Book, NameEntryData } from '@/types';

export const useDashboard = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNameEntry, setShowNameEntry] = useState(false);

  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  const fetchDashboardData = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const userRes = await fetch(`/api/users/${userId}`);
      if (!userRes.ok) throw new Error('Failed to fetch user profile data');

      const userData = await userRes.json();
      const userInfo = userData.data; // extract the user object
      setUserData(userInfo);

      setShowNameEntry(!userInfo.userName || userInfo.userName.trim() === '');

      const booksRes = await fetch(`/api/books?userId=${userId}`);
      if (!booksRes.ok) throw new Error('Failed to fetch user books');

      const fetchedBooksResponse = await booksRes.json();
      if (!Array.isArray(fetchedBooksResponse.books)) throw new Error('Books API did not return an array.');

      setAllBooks(fetchedBooksResponse.books);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleNameSubmission = async (data: NameEntryData) => {
    if (!userId) throw new Error('User not authenticated.');

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update user profile');
      }

      await fetchDashboardData();
    } catch (error) {
      console.error('Error submitting name entry:', error);
      throw error;
    }
  };

  const booksRead = allBooks.filter(book => book.status === 'finished');
  const currentlyReading = allBooks.filter(book => book.status === 'reading');
  const wantToRead = allBooks.filter(book => book.status === 'wantToRead');
  const favoriteBooks = allBooks.filter(book => book.favorite);

  return {
    userData,
    allBooks,
    booksRead,
    currentlyReading,
    wantToRead,
    favoriteBooks,
    isLoading,
    showNameEntry,
    handleNameSubmission,
    refetchDashboardData: fetchDashboardData,
  };
};
