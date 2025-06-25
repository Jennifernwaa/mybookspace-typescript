// hooks/useDashboard.ts
import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, getDocs } from 'firebase/firestore';
import { app, db, auth } from "@/lib/firebase.browser";
import { UserData, Book } from '@/types';

export const useDashboard = (currentUser: User | null) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNameEntry, setShowNameEntry] = useState(false);

  // Fetch books by status
  const fetchBooksByStatus = async (userId: string, status: string): Promise<Book[]> => {
    try {
      const booksRef = collection(db, "users", userId, "books");
      const q = query(booksRef);
      const snapshot = await getDocs(q);
      const books: Book[] = [];
      
      snapshot.forEach(docSnap => {
        const bookData = docSnap.data() as Book;
        if (bookData.status === status) {
          books.push({ ...bookData, id: docSnap.id });
        }
      });
      
      return books;
    } catch (error) {
      console.error(`Error fetching ${status} books:`, error);
      return [];
    }
  };

  // Load user data from Firestore
  const loadUserData = async () => {
    if (!currentUser) return;

    try {
      setIsLoading(true);
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      
      if (userDoc.exists()) {
        const data = userDoc.data() as UserData;
        const userName = data.userName || data.userName;
        
        if (!userName) {
          setShowNameEntry(true);
        } else {
          // Fetch books by status
          const [reading, booksRead, wantToRead] = await Promise.all([
            fetchBooksByStatus(currentUser.uid, "reading"),
            fetchBooksByStatus(currentUser.uid, "finished"),
            fetchBooksByStatus(currentUser.uid, "wantToRead")
          ]);

          const updatedUserData: UserData = {
            ...data,
            reading,
            booksRead,
            wantToRead
          };

          setUserData(updatedUserData);
        }
      } else {
        setShowNameEntry(true);
      }

      // Fetch all books
      const q = query(collection(db, "users", currentUser.uid, "books"));
      const snapshot = await getDocs(q);
      const books: Book[] = [];
      snapshot.forEach(docSnap => {
        books.push({ id: docSnap.id, ...docSnap.data() } as Book);
      });
      setAllBooks(books);

    } catch (error) {
      console.error('Error loading user data:', error);
      setShowNameEntry(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle name submission
  const handleNameSubmission = async (data: { fullName: string; userName: string; readingGoal: number }) => {
    if (!currentUser) return;

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const newUserData: UserData = {
        fullName: data.fullName,
        userId: currentUser.uid,
        userName: data.userName,
        readingGoal: data.readingGoal,
        dateJoined: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        friends: {},
        reading: [],
        booksRead: [],
        wantToRead: []
      };

      await setDoc(userRef, newUserData, { merge: true });
      setUserData(newUserData);
      setShowNameEntry(false);
    } catch (error) {
      console.error('Error saving user data:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (currentUser) { // is email verified later
      loadUserData();
    }
  }, [currentUser]);

  return {
    userData,
    allBooks,
    isLoading,
    showNameEntry,
    handleNameSubmission,
    refetchUserData: loadUserData
  };
};