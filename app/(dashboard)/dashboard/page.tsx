'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase.browser';
import HeroSection from '@/components/HeroSection';
import StatsSection from '@/components/StatsSection';
import QuickActionsSection from '@/components/QuickActionsSection';
import CurrentlyReadingSection from '@/components/CurrentlyReadingSection';
import ReadingGoalSection from '@/components/ReadingGoalSection';
import ReadingModal from '@/components/ReadingModal';
import NameEntryModal from '@/components/NameEntryModal';
import Footer from '@/components/Footer';
import { useDashboard } from '@/hooks/useDashboard';
import { Book } from '@/types';
import { Navigation } from 'lucide-react';

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Listen for auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) { // Later add && user.emailVerified
        setCurrentUser(user);
      // } else if (user) { // Later add && user.emailVerified
      //   router.push('/verify-email');
      } else {
        router.push('/sign-in');
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Dashboard data and handlers
  const {
    userData,
    allBooks,
    isLoading,
    showNameEntry,
    handleNameSubmission,
    refetchUserData,
  } = useDashboard(currentUser);

  // Modal state
  const [showReadingModal, setShowReadingModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const handleOpenReadingModal = (book: Book) => {
    setSelectedBook(book);
    setShowReadingModal(true);
  };

  const handleCloseReadingModal = () => {
    setSelectedBook(null);
    setShowReadingModal(false);
  };

  const handleUpdateProgress = async (bookId: string, progressData: {
    title: string;
    author: string;
    status: string;
    progress: number;
  }) => {
    try {
      // You should implement updateBookProgress in your useDashboard hook
      await refetchUserData();
      setShowReadingModal(false);
    } catch (error) {
      console.error('Error updating book progress:', error);
      throw error;
    }
  };

  if (isLoading || !currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-light via-space-pink-light to-peach flex items-center justify-center">
        <div className="text-6xl animate-pulse">📚</div>
      </div>
    );
  }

  if (showNameEntry) {
    return <NameEntryModal isVisible={showNameEntry} onSubmit={handleNameSubmission} />;
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-6 py-8 max-w-7xl">
        <HeroSection 
          userName={userData?.userName} 
          onContinueReading={() => {
            const currentBooks = userData?.reading || [];
            if (currentBooks.length > 0) {
              document.querySelector('.glass-card')?.scrollIntoView({ behavior: 'smooth' });
            } else {
              router.push('/my-books');
            }
          }}
          onAddNewBook={() => router.push('/add-books')}
        />

        <StatsSection userData={userData ?? undefined} />
        
        <QuickActionsSection 
          onAddBook={() => router.push('/add-books')}
          onMyBooks={() => router.push('/my-books')}
          onRecommendations={() => router.push('/recommendations')}
        />

        <CurrentlyReadingSection 
          books={userData?.reading || []}
          onBookClick={handleOpenReadingModal}
        />

        <ReadingGoalSection userData={userData} />
      </main>

      {showReadingModal && selectedBook && (
        <ReadingModal
          book={selectedBook}
          onClose={handleCloseReadingModal}
          onUpdate={(progressData) => handleUpdateProgress(selectedBook.id, progressData)}
        />
      )}
    </div>
  );
};

export default Dashboard;