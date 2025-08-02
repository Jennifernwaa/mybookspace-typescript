'use client';
import BookCards from '@/components/BookCards';
import ProfileCard from '@/components/Profile/ProfileCard';
import RecentActivity from '@/components/Profile/RecentActivity';
import UserStats from '@/components/Profile/UserStats';
import { useProfile } from '@/hooks/useProfile';
import React, { useState } from 'react';

export default function ProfilePage() {
  const [showEditModal, setShowEditModal] = useState(false);
  const {
    userData,
    readingStats,
    updateProfile,
    isLoading,
    friendsCount,
    refetchProfile,
    favoriteBooks,
  } = useProfile();

  const handleEditModal = () => setShowEditModal(true);

  const handleProfileUpdate = async (updates: any) => {
    await updateProfile(updates);
    await refetchProfile();
    setShowEditModal(false);
  };

  const handleCloseModal = () => setShowEditModal(false);

  if (isLoading) {
    return (
      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="text-center py-20 text-xl text-warm-brown">Loading profile...</div>
      </main>
    );
  }

  if (!userData) {
    return (
      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="text-center py-20 text-xl text-red-500">Profile not found.</div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-6 py-8 max-w-4xl">
      {/* User Profile Card */}
      <ProfileCard
        userData={userData}
        onEdit={handleEditModal}
        showEditModal={showEditModal}
        onModalClose={handleCloseModal}
        onModalSubmit={handleProfileUpdate}
      />

      {/* User Reading Stats */}
      <UserStats
        booksRead={readingStats.booksRead}
        friendsCount={friendsCount}
      />

      {/* User Recent Activity*/}
      <RecentActivity/>

      {/* User Favorite Books*/}
      <div id="favorite-books-section" className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
        <BookCards books={favoriteBooks} pageType="profile" />
      </div>
    </main>
  );
}