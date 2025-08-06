'use client';

import React from 'react';
import { useFriends } from '@/hooks/useFriends';
import FriendCard from './FriendCard';
import { User } from '@/types';

export default function FriendsList({ friends, loading }: { friends: User[], loading: boolean }) {
  const { error } = useFriends();

  return (
    <section className="bg-white/80 rounded-2xl shadow-lg p-4 md:p-6 flex flex-col overflow-y-auto min-h-[300px] md:min-h-[400px]">
      <h2 className="text-2xl font-bold text-space-brown mb-4 font-serif flex items-center">
        <span className="mr-2 text-3xl animate-warm-pulse">🤗</span>Friends
      </h2>
      <div className="mb-4 text-warm-brown opacity-75 bg-cream-light px-4 py-2 rounded-full text-center">
        <span className="font-medium text-lg">{friends.length} wonderful friends</span>
      </div>
      {loading && <p className="text-center text-warm-brown">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
        {friends.length > 0 ? (
          friends.map(friend => (
            <FriendCard key={friend._id} user={friend} />
          ))
        ) : (
          <div className="text-center text-warm-brown opacity-70 mt-8">
            <div className="text-5xl mb-2">🫂</div>
            <p>No friends yet. Search to add some!</p>
          </div>
        )}
      </div>
    </section>
  );
}