'use client';

import React from 'react';
import { useFriends } from '@/hooks/useFriends';
import FriendCard from './FriendCard';
import { User } from '@/types';

export default function FriendsList({ 
  friends, 
  loading 
}: { 
  friends: User[], 
  loading: boolean }) {
  const { error } = useFriends();

  return (
    <section className="bg-white/80 rounded-2xl shadow-lg p-4 md:p-6 flex flex-col overflow-hidden min-h-[300px] md:min-h-[400px]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-space-brown font-serif flex items-center">
          <span className="mr-2 text-3xl animate-warm-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="32" height="32">
              <path fill="#390d09" d="M96 192C96 130.1 146.1 80 208 80C269.9 80 320 130.1 320 192C320 253.9 269.9 304 208 304C146.1 304 96 253.9 96 192zM32 528C32 430.8 110.8 352 208 352C305.2 352 384 430.8 384 528L384 534C384 557.2 365.2 576 342 576L74 576C50.8 576 32 557.2 32 534L32 528zM464 128C517 128 560 171 560 224C560 277 517 320 464 320C411 320 368 277 368 224C368 171 411 128 464 128zM464 368C543.5 368 608 432.5 608 512L608 534.4C608 557.4 589.4 576 566.4 576L421.6 576C428.2 563.5 432 549.2 432 534L432 528C432 476.5 414.6 429.1 385.5 391.3C408.1 376.6 435.1 368 464 368z"/>
            </svg>
          </span>
          Friends
        </h2>
        <div className="text-warm-brown/70 bg-cream-light px-3 py-1 rounded-full text-sm font-medium">
          {friends.length} {friends.length === 1 ? 'friend' : 'friends'}
        </div>
      </div>

      {loading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-warm-brown"></div>
          <p className="text-warm-brown ml-3">Loading friends...</p>
        </div>
      )}

      {error && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">❌</div>
            <p className="text-red-500 font-medium">Error loading friends</p>
            <p className="text-red-400 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {friends.length > 0 ? (
            <div className="space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-warm-brown/20 scrollbar-track-transparent pr-2">
              {friends.map(friend => (
                <FriendCard key={friend._id} user={friend} />
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-warm-brown/70">
                <div className="text-6xl mb-4">            
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="32" height="32">
                    <path fill="#390d09" d="M96 192C96 130.1 146.1 80 208 80C269.9 80 320 130.1 320 192C320 253.9 269.9 304 208 304C146.1 304 96 253.9 96 192zM32 528C32 430.8 110.8 352 208 352C305.2 352 384 430.8 384 528L384 534C384 557.2 365.2 576 342 576L74 576C50.8 576 32 557.2 32 534L32 528zM464 128C517 128 560 171 560 224C560 277 517 320 464 320C411 320 368 277 368 224C368 171 411 128 464 128zM464 368C543.5 368 608 432.5 608 512L608 534.4C608 557.4 589.4 576 566.4 576L421.6 576C428.2 563.5 432 549.2 432 534L432 528C432 476.5 414.6 429.1 385.5 391.3C408.1 376.6 435.1 368 464 368z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">No friends yet</h3>
                <p className="text-sm opacity-75">
                  Use the search feature to find and add friends!
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}