'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import HeroSection from '@/components/HeroSection';
import StatsSection from '@/components/StatsSection';
import QuickActionsSection from '@/components/QuickActionsSection';
import CurrentlyReadingSection from '@/components/CurrentlyReadingSection';
import ReadingGoalSection from '@/components/ReadingGoalSection';
import NameEntryModal from '@/components/NameEntryModal';
import BookEditModal from '@/components/BookEditModal';
import { useDashboard } from '@/hooks/useDashboard';
import { Book } from '@/types'; // Ensure Book type is imported

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [showReadingModal, setShowReadingModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null); // Type selectedBook as Book
  const [userId, setuserId] = useState<string | null>(null);

  const {
    userData,
    booksRead, // New: Get categorized books
    currentlyReading, // New: Get categorized books
    wantToRead, // New: Get categorized books
    isLoading,
    showNameEntry,
    handleNameSubmission,
    refetchDashboardData, // Updated name for refetch function
  } = useDashboard();

  const handleOpenReadingModal = (book: Book) => { // Type book as Book
    setSelectedBook(book);
    setShowReadingModal(true);
  };

  const handleCloseReadingModal = () => {
    setSelectedBook(null);
    setShowReadingModal(false);
  };

  // Save progress update for a book
  const handleSaveProgress = async (updated: Partial<Book>) => {
    if (!selectedBook ) {
      console.error('No book selected or user not authenticated for progress update.');
      return;
    }
    
    try {
      // API route for updating a single book by its _id
      const response = await fetch(`/api/books/${selectedBook._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });

      if (!response.ok) {
        throw new Error('Failed to update book');
      }

      // Refetch all dashboard data to update statistics and book lists
      await refetchDashboardData();
      handleCloseReadingModal();
    } catch (error) {
      console.error('Error updating book:', error);
      // Implement a user-friendly message (e.g., a toast notification)
    }
  };


  if (isLoading) {
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
            // Use currentlyReading from the hook
            if (currentlyReading.length > 0) {
              document.querySelector('.glass-card')?.scrollIntoView({ behavior: 'smooth' });
            } else {
              router.push('/my-books');
            }
          }}
          onAddNewBook={() => router.push('/add-books')}
        />

        {/* Pass categorized book arrays to StatsSection */}
        <StatsSection 
          booksRead={booksRead} 
          currentlyReading={currentlyReading} 
          wantToRead={wantToRead} 
        />
        
        <QuickActionsSection 
          onAddBook={() => router.push('/add-books')}
          onMyBooks={() => router.push('/my-books')}
          onRecommendations={() => router.push('/recommendations')}
        />

        {/* Pass currentlyReading books to CurrentlyReadingSection */}
        <CurrentlyReadingSection 
          books={currentlyReading} // Use currentlyReading from the hook
          onBookClick={handleOpenReadingModal}
        />

        <ReadingGoalSection 
        userData={userData} 
         booksRead={booksRead}
         />
      </main>

      {/* BookEditModal for editing reading progress */}
      {showReadingModal && selectedBook && (
        <BookEditModal
          isOpen={showReadingModal}
          onClose={handleCloseReadingModal}
          book={selectedBook}
          tab="reading" // This might need adjustment based on your BookEditModal logic
          onSave={handleSaveProgress}
        />
      )}
    </div>
  );
};

export default Dashboard;
