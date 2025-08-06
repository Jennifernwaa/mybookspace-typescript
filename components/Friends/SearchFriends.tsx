'use client';

import React, { useState } from 'react';
import { useUserSearch } from '@/hooks/useUserSearch';
import UserSearchResultCard from './UserSearchResultCard';
import { User } from '@/types';

export default function SearchFriends({ addFriend, friends }: { addFriend: (userId: string) => Promise<{ success: boolean; error?: string; message?: string; }>; friends: User[] }) {
  const [query, setQuery] = useState('');
  const { results, isSearching } = useUserSearch(query);

  const friendsIds = friends.map(friend => friend._id);
  const filteredResults = results.filter(user => !friendsIds.includes(user._id));

  return (
    <section className="bg-white/80 rounded-2xl shadow-lg p-4 md:p-8">
      <h2 className="text-2xl font-semibold text-space-brown mb-4 font-serif flex items-center">
        <span className="mr-3 text-3xl animate-wiggle">🔍</span>Find Your Next Reading Companion
      </h2>
      <div className="flex flex-col sm:flex-row gap-4 mb-5">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          type="text"
          placeholder="Search by username or email... ✨"
          className="flex-1 px-4 py-3 rounded-xl text-space-brown placeholder-warm-brown text-lg"
        />
      </div>
      <div className="space-y-4">
        {isSearching && <p className="text-warm-brown">Searching...</p>}
        {!isSearching && filteredResults.length === 0 && query && (
          <p className="text-warm-brown">No users found.</p>
        )}
        {!isSearching &&
          filteredResults.map(user => (
            // Pass the addFriend function down to the card
            <UserSearchResultCard 
              key={user._id} 
              user={user} 
              onAddFriend={addFriend} 
            />
          ))}
      </div>
    </section>
  );
}