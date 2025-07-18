'use client';
import { EditProfileModal } from '@/components/EditProfileModal';
import { useDashboard } from '@/hooks/useDashboard';
import { useProfile } from '@/hooks/useProfile';
import { Edit } from 'lucide-react';
import { set } from 'mongoose';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

export default function ProfilePage() {
  const [showEditModal, setShowEditModal] = useState(false);
  const { userData, readingStats, updateProfile, isLoading } = useProfile();


  const handleEditModal = () => {
    setShowEditModal(true);
  };

  const handleProfileUpdate = async (updates) => {
    await updateProfile(updates);
    await refetchProfile(); // Make sure this refetches user data
    setShowEditModal(false);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
  };

  return (
    <main className="container mx-auto px-6 py-8 max-w-4xl">
      {/* */}
      <div className="glass-card rounded-3xl p-8 md:p-12 mb-12 animate-fade-in-up">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* */}
          <div className="relative">
            <div className="profile-avatar w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center animate-pulse-gentle">
              <span className="text-white text-5xl md:text-6xl">👤</span>
            </div>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-space-red rounded-full flex items-center justify-center shadow-lg animate-bounce-gentle">
              <span className="text-white text-xl">📚</span>
            </div>
          </div>

          {/* */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-space-brown mb-4 font-serif" id="username"></h1>
            <p className="text-warm-brown text-lg mb-4 opacity-90 max-w-2xl" id="bio"></p>
            <div className="flex items-center justify-center md:justify-start mb-6">
              <span className="text-salmon font-semibold text-lg mr-2">Favorite Genre:</span>
              <span className="bg-gradient-to-r from-peach to-salmon text-white px-4 py-2 rounded-full font-medium shadow-lg" id="favoriteGenre"></span>
            </div>

            {/* */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button
                className="action-btn bg-space-red text-white px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 shadow-lg animate-glow"
                onClick={handleEditModal}
              >
                Edit Profile
              </button>
              <EditProfileModal 
              isVisible={showEditModal} 
              onClose={handleCloseModal} 
              onSubmit={handleProfileUpdate} />
              <button className="action-btn bg-white text-space-red px-8 py-3 rounded-full font-semibold border-2 border-space-red hover:bg-cream-light shadow-lg">
                Share Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* */}
      <div className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-3xl font-semibold text-space-brown mb-8 font-serif text-center">Reading Stats</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* */}
          <div className="stat-card rounded-3xl p-8 text-center group">
            <div className="text-5xl mb-4 animate-float">📚</div>
            <div id="booksRead" className="text-4xl font-bold text-space-brown mb-2"></div>
            <div className="text-warm-brown font-medium text-lg">Books Read</div>
            <div className="mt-4 text-xs text-warm-brown opacity-70">This year: 47 books</div>
          </div>

          {/* */}
          <div className="stat-card rounded-3xl p-8 text-center group">
            <div className="text-5xl mb-4 animate-float-delayed">👥</div>
            <div id="friendsCount" className="text-4xl font-bold text-space-brown mb-2"></div>
            <div className="text-warm-brown font-medium text-lg">Book Friends</div>
          </div>

          {/* */}
          <div className="stat-card rounded-3xl p-8 text-center group">
            <div className="text-5xl mb-4 animate-float-delayed-2">🏛️</div>
            <div className="text-4xl font-bold text-space-brown mb-2">3</div>
            <div className="text-warm-brown font-medium text-lg">Book Clubs</div>
            <div className="mt-4 text-xs text-warm-brown opacity-70">Active member</div>
          </div>
        </div>
      </div>

      {/* */}
      <div className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <div className="glass-card rounded-3xl p-8">
          <h3 className="text-2xl font-semibold text-space-brown mb-6 font-serif text-center">Recent Activity</h3>
          <div className="space-y-6">
            {/* */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-cream-light to-ivory">
              <div className="w-12 h-12 bg-gradient-to-br from-salmon to-rose-red rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">⭐</span>
              </div>
              <div className="flex-1">
                <p className="text-space-brown font-medium">Finished reading "The Seven Husbands of Evelyn Hugo"</p>
                <p className="text-warm-brown text-sm opacity-75">Rated 5 stars • 2 days ago</p>
              </div>
            </div>

            {/* */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-cream-light to-ivory">
              <div className="w-12 h-12 bg-gradient-to-br from-peach to-salmon rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">👥</span>
              </div>
              <div className="flex-1">
                <p className="text-space-brown font-medium">Joined "Fantasy Book Club"</p>
                <p className="text-warm-brown text-sm opacity-75">1 week ago</p>
              </div>
            </div>

            {/* */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-cream-light to-ivory">
              <div className="w-12 h-12 bg-gradient-to-br from-space-pink-dark to-space-red rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">📖</span>
              </div>
              <div className="flex-1">
                <p className="text-space-brown font-medium">Started reading "Project Hail Mary"</p>
                <p className="text-warm-brown text-sm opacity-75">1 week ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* */}
      <div id="favorite-books-section" className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
        <div className="glass-card rounded-3xl p-8">
          <h3 className="text-2xl font-semibold text-space-brown mb-6 font-serif text-center">Favorite Books</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6"></div>
        </div>
      </div>
    </main>
  );
}