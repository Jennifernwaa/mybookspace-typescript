import { useState, useCallback } from 'react';
import { OpenLibraryBook, SearchState } from '@/types';
import { handleApiResponse } from '@/utils/api';

export const useBookSearch = () => {
  const [state, setState] = useState<SearchState>({
    query: '',
    results: [],
    isLoading: false,
    error: null,
  });

  const searchBooks = useCallback(async (query: string) => {
    if (!query.trim()) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(query.trim())}&limit=10`
      );
      
      const data = await handleApiResponse<{ docs: OpenLibraryBook[] }>(response);
      
      setState(prev => ({
        ...prev,
        results: data.docs || [],
        isLoading: false,
        error: data.docs?.length === 0 ? 'No books found' : null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        results: [],
        isLoading: false,
        error: 'Failed to search books. Please try again.',
      }));
    }
  }, []);

  const updateQuery = useCallback((query: string) => {
    setState(prev => ({ ...prev, query }));
  }, []);

  const clearResults = useCallback(() => {
    setState(prev => ({ ...prev, results: [], error: null }));
  }, []);

  return {
    ...state,
    searchBooks,
    updateQuery,
    clearResults,
  };
};