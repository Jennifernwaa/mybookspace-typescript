import { useState, useEffect, useCallback } from 'react';
import { OpenLibraryBook, BookDetailState } from '@/types';
import { handleApiResponse } from '@/utils/api';
import { getCoverUrl } from '@/utils/bookUtils';

export const useBookDetails = (bookSlug: string) => {
  const [state, setState] = useState<BookDetailState>({
    book: null,
    isLoading: true,
    error: null,
  });

  const fetchBookDetails = useCallback(async (book: OpenLibraryBook) => {
    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null 
    }));

    try {
      // First try to get more details from work endpoint
      const searchResponse = await fetch(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(book.title)}&limit=1`
      );
      
      const searchData = await handleApiResponse<{ docs: OpenLibraryBook[] }>(searchResponse);
      const firstMatch = searchData.docs?.[0];

      if (firstMatch?.key) {
        try {
          const workKey = firstMatch.key;

          // Fetch all three endpoints in parallel for efficiency
          const [workResponse, editionsResponse, ratingsResponse] = await Promise.all([
            fetch(`https://openlibrary.org${workKey}.json`),
            fetch(`https://openlibrary.org${workKey}/editions.json`),
            fetch(`https://openlibrary.org${workKey}/ratings.json`), 
          ]);

          const workData = await handleApiResponse<any>(workResponse);
          const editionsData = await handleApiResponse<{ entries: any[] }>(editionsResponse);
          const ratingsData = await handleApiResponse<any>(ratingsResponse);

          let editionDetails = {};
          if (editionsData.entries?.length > 0 && editionsData.entries[0]?.key) {
            const firstEditionKey = editionsData.entries[0].key;
            const editionResponse = await fetch(`https://openlibrary.org${firstEditionKey}.json`);
            editionDetails = await handleApiResponse<any>(editionResponse);
          }

          // Helper function to extract author names from different API responses
          const getAuthorNames = (data: any): string[] | undefined => {
            // Prioritize the direct author_name array if it exists
            if (data?.author_name?.length > 0) {
              return data.author_name;
            }
            // Fallback to the 'authors' array which contains objects with a 'name' property
            if (data?.authors?.length > 0) {
              // The API sometimes returns a "name" property within the authors object
              const names = data.authors.map((author: any) => author.name).filter(Boolean);
              if (names.length > 0) {
                return names;
              }
            }
            return undefined;
          };

          const enhancedBook: OpenLibraryBook = {
            ...book,
            ...workData, // Merge work data (e.g., description)
            ...editionDetails, // Merge edition data (e.g., publish_date, publishers)
            description: typeof workData.description === 'string' 
              ? workData.description 
              : workData.description?.value || `Discover the captivating world of "${book.title}".`,
            subjects: workData.subjects || book.subjects || book.subject || [],
            publishers: workData.publishers?.map((p: any) => p.name) || (editionDetails as any).publishers?.map((p: any) => p.name) || book.publisher || [],
            first_publish_year: workData.first_publish_year || (editionDetails as any).publish_date || book.first_publish_year,
            number_of_pages: (editionDetails as any).number_of_pages || book.number_of_pages,
            rating: ratingsData?.summary?.average || workData?.rating?.average || 0,
            language: workData.languages?.[0]?.key?.split('/').pop() || undefined,
            author_name: getAuthorNames(workData) || getAuthorNames(editionDetails) || book.author_name,
            cover_url: getCoverUrl({ ...book, ...workData, ...editionDetails }),
          };

          setState({ 
            book: enhancedBook, 
            isLoading: false, 
            error: null 
          });
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