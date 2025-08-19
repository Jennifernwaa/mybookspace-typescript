'use client';

import React from 'react';
import { User } from '@/types';
import { useRouter } from 'next/navigation';

export default function FriendCard({ user }: { user: User }) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/profile/${user._id}`);
  };
  return (
    <div 
      className="bg-cream-light p-4 rounded-xl shadow-md flex items-center justify-between cursor-pointer hover:shadow-lg hover:bg-cream-light/90 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      aria-label={`Visit ${user.userName}'s profile`}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-warm-brown/20 rounded-full flex items-center justify-center">
          <span className="text-lg">👤</span>
        </div>
        <div>
          <h3 className="font-semibold text-lg text-space-brown group-hover:text-warm-brown transition-colors">
            {user.userName}
          </h3>
          <p className="text-warm-brown text-sm opacity-75">{user.email}</p>
        </div>
      </div>
      <div className="text-warm-brown/60 hover:text-warm-brown transition-colors">
        <svg 
          className="w-5 h-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 5l7 7-7 7" 
          />
        </svg>
      </div>
    </div>
  );
}