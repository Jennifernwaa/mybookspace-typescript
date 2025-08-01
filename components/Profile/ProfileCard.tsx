import React from 'react';
import { User } from '@/types';
import { EditProfileModal } from '../EditProfileModal';
import Link from 'next/link';


interface ProfileCardProps {
  userData: User;
  onEdit: () => void;
  showEditModal: boolean;
  onModalClose: () => void;
  onModalSubmit: (updates: any) => Promise<void>;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  userData,
  onEdit,
  showEditModal,
  onModalClose,
  onModalSubmit,
}) => {
  return (
    <div className="glass-card rounded-3xl p-8 md:p-12 mb-12 animate-fade-in-up">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* Avatar */}
        <div className="relative">
          <div className="profile-avatar w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center animate-pulse-gentle">
            <span className="text-white text-5xl md:text-6xl">👤</span>
          </div>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-space-red rounded-full flex items-center justify-center shadow-lg animate-bounce-gentle">
            <span className="text-white text-xl">📚</span>
          </div>
        </div>
        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-space-brown mb-4 font-serif">
            {userData.userName || 'No username'}
          </h1>
          <p className="text-warm-brown text-lg mb-4 opacity-90 max-w-2xl">
            {userData.bio || 'No bio yet.'}
          </p>
          <div className="flex items-center justify-center md:justify-start mb-6">
            <span className="text-salmon font-semibold text-lg mr-2">Favorite Genre:</span>
            <span className="bg-gradient-to-r from-peach to-salmon text-white px-4 py-2 rounded-full font-medium shadow-lg">
              {userData.favoriteGenre || 'Not set'}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button
              className="action-btn bg-space-red text-white px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 shadow-lg animate-glow"
              onClick={onEdit}
            >
              Edit Profile
            </button>
            <EditProfileModal
              isVisible={showEditModal}
              onClose={onModalClose}
              onSubmit={onModalSubmit}
              userData={userData}
            />
            <button className="action-btn bg-white text-space-red px-8 py-3 rounded-full font-semibold border-2 border-space-red hover:bg-cream-light shadow-lg">
              Share Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
