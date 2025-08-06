'use client';

import { useEffect, useState } from 'react';
import { User } from '@/types';

export function useUserSearch(query: string) {
  const [results, setResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!query || query.trim().length === 0) {
      setResults([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        setIsSearching(true);
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.data || []);
      } catch (err) {
        console.error('User search error:', err);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300); // debounce

    return () => clearTimeout(delay);
  }, [query]);

  return { results, isSearching };
}
