'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase.browser';
import HeroSection from '@/components/HeroSection';
import StatsSection from '@/components/StatsSection';
import QuickActionsSection from '@/components/QuickActionsSection';
import CurrentlyReadingSection from '@/components/CurrentlyReadingSection';
import ReadingGoalSection from '@/components/ReadingGoalSection';
import NameEntryModal from '@/components/NameEntryModal';
import { useDashboard } from '@/hooks/useDashboard';
import { Book } from '@/types';
import BookEditModal from '@/components/BookEditModal';
import { doc, updateDoc } from "firebase/firestore";

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        router.push('/sign-in');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const {
    userData,
    isLoading,
    showNameEntry,
    handleNameSubmission,
    refetchUserData,
  } = useDashboard(currentUser);

  // Modal state
  const [showReadingModal, setShowReadingModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Open modal when a book is clicked
  const handleOpenReadingModal = (book: Book) => {
    setSelectedBook(book);
    setShowReadingModal(true);
  };

  // Close modal
  const handleCloseReadingModal = () => {
    setSelectedBook(null);
    setShowReadingModal(false);
  };

  // Save progress update
  const handleSaveProgress = async (updated: Partial<Book>) => {
    if (!currentUser || !selectedBook) return;
    // Update Firestore
    await updateDoc(
      doc(db, "users", currentUser.uid, "books", selectedBook.id),
      updated
    );
    await refetchUserData();
    handleCloseReadingModal();
  };

  if (isLoading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-6xl animate-pulse">Loading...</div>
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

      {/* BookEditModal for editing reading progress */}
      {showReadingModal && selectedBook && (
        <BookEditModal
          isOpen={showReadingModal}
          onClose={handleCloseReadingModal}
          book={selectedBook}
          tab="reading"
          onSave={handleSaveProgress}
        />
      )}
    </div>
  );
};

export default Dashboard;