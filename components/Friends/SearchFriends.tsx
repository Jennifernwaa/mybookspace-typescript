'use client';

import React, { useState } from 'react';
import { useUserSearch } from '@/hooks/useUserSearch';
import UserSearchResultCard from './UserSearchResultCard';

export default function SearchFriends() {
  const [query, setQuery] = useState('');
  const { results, isSearching } = useUserSearch(query);

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
        {!isSearching && results.length === 0 && query && (
          <p className="text-warm-brown">No users found.</p>
        )}
        {!isSearching &&
          results.map(user => (
            <UserSearchResultCard key={user._id} user={user} />
          ))}
      </div>
    </section>
  );
}