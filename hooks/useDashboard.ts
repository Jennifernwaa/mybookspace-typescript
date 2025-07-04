// src/hooks/useDashboard.ts
import { useState, useEffect, useCallback } from 'react';
import { UserData, Book, NameEntryData } from '@/types'; // Import Book and NameEntryData types

interface UseDashboardProps {
  uid: string | null; // The user's unique ID (MongoDB _id)
}

export const useDashboard = ({ uid }: UseDashboardProps) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [allBooks, setAllBooks] = useState<Book[]>([]); // State to hold all books
  const [booksRead, setBooksRead] = useState<Book[]>([]); // State for finished books
  const [currentlyReading, setCurrentlyReading] = useState<Book[]>([]); // State for reading books
  const [wantToRead, setWantToRead] = useState<Book[]>([]); // State for want to read books
  const [isLoading, setIsLoading] = useState(true);
  const [showNameEntry, setShowNameEntry] = useState(false);

  // Function to fetch all necessary dashboard data (user profile and books)
  const fetchDashboardData = useCallback(async () => {
    if (!uid) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // 1. Fetch User Profile Data
      const userRes = await fetch(`/api/users/${uid}`);
      if (!userRes.ok) {
        throw new Error('Failed to fetch user profile data');
      }
      const userData: UserData = await userRes.json();
      setUserData(userData);

      // Determine if NameEntryModal should be shown
      if (!userData.userName || userData.userName.trim() === '') {
        setShowNameEntry(true);
      } else {
        setShowNameEntry(false);
      }

      // 2. Fetch User's Books
      const booksRes = await fetch(`/api/books?userId=${uid}`);
      if (!booksRes.ok) {
        throw new Error('Failed to fetch user books');
      }
      const fetchedBooks: Book[] = await booksRes.json();
      setAllBooks(fetchedBooks); // Store all fetched books

      // 3. Categorize Books
      setBooksRead(fetchedBooks.filter(book => book.status === 'finished'));
      setCurrentlyReading(fetchedBooks.filter(book => book.status === 'reading'));
      setWantToRead(fetchedBooks.filter(book => book.status === 'wantToRead'));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Handle error gracefully, e.g., show a message to the user
    } finally {
      setIsLoading(false);
    }
  }, [uid]);

  // Effect hook to call fetchDashboardData when the component mounts or uid changes
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Function to handle the submission from the NameEntryModal
  const handleNameSubmission = async (data: NameEntryData) => {
    if (!uid) {
      console.error('User ID not available for name submission.');
      throw new Error('User not authenticated.');
    }

    try {
      const res = await fetch(`/api/users/${uid}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update user profile');
      }

      // After successful update, refetch all dashboard data
      await fetchDashboardData();
    } catch (error) {
      console.error('Error submitting name entry:', error);
      throw error;
    }
  };

  return {
    userData,
    allBooks, // Can be useful if you need all books for other purposes
    booksRead,
    currentlyReading,
    wantToRead,
    isLoading,
    showNameEntry,
    handleNameSubmission,
    refetchDashboardData: fetchDashboardData, // Expose for manual refresh
  };
};
