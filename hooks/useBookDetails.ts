import { useState, useEffect, useCallback } from 'react';
import { OpenLibraryBook, BookDetailState } from '@/types';
import { handleApiResponse } from '@/utils/api';

export const useBookDetails = (bookSlug: string) => {
  const [state, setState] = useState<BookDetailState>({
    book: null,
    isLoading: true,
    error: null,
  });

  const fetchBookDetails = useCallback(async (book: OpenLibraryBook) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // First try to get more details from work endpoint
      const searchResponse = await fetch(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(book.title)}&limit=1`
      );
      
      const searchData = await handleApiResponse<{ docs: OpenLibraryBook[] }>(searchResponse);
      const firstMatch = searchData.docs?.[0];

      if (firstMatch?.key) {
        try {
          const workResponse = await fetch(`https://openlibrary.org${firstMatch.key}.json`);
          const workData = await handleApiResponse<any>(workResponse);

          const enhancedBook: OpenLibraryBook = {
            ...book,
            description: typeof workData.description === 'string' 
              ? workData.description 
              : workData.description?.value || `Discover the captivating world of "${book.title}".`,
            subjects: workData.subjects || book.subjects || book.subject || [],
            rating: workData.rating || 0,
          };

          setState({ book: enhancedBook, isLoading: false, error: null });
        } catch (workError) {
          // Fallback to basic book data if work fetch fails
          setState({ 
            book: { 
              ...book, 
              description: `Discover the captivating world of "${book.title}".`,
              subjects: book.subjects || book.subject || [],
            }, 
            isLoading: false, 
            error: null 
          });
        }
      } else {
        setState({ 
          book: { 
            ...book, 
            description: `Discover the captivating world of "${book.title}".`,
            subjects: book.subjects || book.subject || [],
          }, 
          isLoading: false, 
          error: null 
        });
      }
    } catch (error) {
      setState({ book: null, isLoading: false, error: 'Failed to load book details' });
    }
  }, []);

  return {
    ...state,
    fetchBookDetails,
  };
};