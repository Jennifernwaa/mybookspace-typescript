'use client';

import React, { useState } from 'react';
import { useUserSearch } from '@/hooks/useUserSearch';
import UserSearchResultCard from './UserSearchResultCard';
import { User } from '@/types';

export default function SearchFriends({ 
  addFriend, friends 
}: { addFriend: (userId: string) => 
    Promise<{ success: boolean; error?: string; message?: string; }>; 
    friends: User[] }) {
  const [query, setQuery] = useState('');
  const { results, isSearching } = useUserSearch(query);

  const friendsIds = friends.map(friend => friend._id);
  const filteredResults = results.filter(user => !friendsIds.includes(user._id));

  return (
    <section className="bg-white/80 rounded-2xl shadow-lg p-4 md:p-8">
      <h2 className="text-2xl font-semibold text-space-brown mb-4 font-serif flex items-center">
        <span className="mr-3 text-3xl animate-wiggle">🔍</span>
        Find Your Next Reading Companion
      </h2>
      
      <div className="relative mb-6">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          type="text"
          placeholder="Search by username or email... ✨"
          className="w-full px-4 py-3 pl-12 rounded-xl border-2 border-warm-brown/20 focus:border-warm-brown focus:outline-none text-space-brown placeholder-warm-brown/60 text-lg bg-white/50 backdrop-blur-sm transition-all duration-200"
        />
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-warm-brown/60">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="space-y-4">
        {isSearching && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-warm-brown"></div>
            <p className="text-warm-brown ml-3">Searching...</p>
          </div>
        )}
        
        {!isSearching && filteredResults.length === 0 && query && (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🤷‍♂️</div>
            <p className="text-warm-brown">No users found for "{query}"</p>
            <p className="text-warm-brown/60 text-sm mt-1">Try searching with a different username or email</p>
          </div>
        )}

        {!isSearching && query === '' && (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">✨</div>
            <p className="text-warm-brown/70">Start typing to search for new friends!</p>
          </div>
        )}

        {!isSearching && filteredResults.length > 0 && (
          <div className="space-y-3">
            <p className="text-warm-brown/80 text-sm mb-4">
              Found {filteredResults.length} user{filteredResults.length !== 1 ? 's' : ''}
            </p>
            {filteredResults.map(user => (
              <UserSearchResultCard
                key={user._id}
                user={user}
                onAddFriend={addFriend}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}