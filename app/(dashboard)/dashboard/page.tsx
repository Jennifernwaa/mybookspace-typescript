'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import HeroSection from '@/components/HeroSection';
import StatsSection from '@/components/StatsSection';
import QuickActionsSection from '@/components/QuickActionsSection';
import CurrentlyReadingSection from '@/components/CurrentlyReadingSection';
import ReadingGoalSection from '@/components/ReadingGoalSection';
import NameEntryModal from '@/components/NameEntryModal';
import BookEditModal from '@/components/BookEditModal';
import { Book } from '@/types';

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showReadingModal, setShowReadingModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<any>(null);

  // Replace with your auth logic to get userId
  const userId = typeof window !== "undefined" ? localStorage.getItem('userId') : null;
    
  useEffect(() => {
    if (!userId) {
      router.push('/sign-in');
      return;
    }
    const fetchUserData = async () => {
      setIsLoading(true);
      const res = await fetch(`/api/dashboard/user/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setUserData(data.user);
      }
      setIsLoading(false);
    };
    fetchUserData();
  }, [userId, router]);


  const handleOpenReadingModal = (book: any) => {
    setSelectedBook(book);
    setShowReadingModal(true);
  };

  const handleCloseReadingModal = () => {
    setSelectedBook(null);
    setShowReadingModal(false);
  };

  // Save progress update
  const handleSaveProgress = async (updated: Partial<Book>) => {
    if (!selectedBook) return;
    await fetch(`/api/dashboard/book/${selectedBook._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
    // Refetch user data
    const res = await fetch(`/api/dashboard/user/${userId}`);
    if (res.ok) {
      const data = await res.json();
      setUserData(data.user);
    }
    handleCloseReadingModal();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-6xl animate-pulse">Loading...</div>
      </div>
    );
  }

  // Uncomment and implement the following if you want to use the NameEntryModal:
  // const [showNameEntry, setShowNameEntry] = useState(false);
  // const handleNameSubmission = (name: string) => {
  //   // handle name submission logic here
  //   setShowNameEntry(false);
  // };

  // if (showNameEntry) {
  //   return <NameEntryModal isVisible={showNameEntry} onSubmit={handleNameSubmission} />;
  // }

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