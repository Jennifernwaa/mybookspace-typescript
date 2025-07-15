import { useState, useCallback } from 'react';
import { OpenLibraryBook, BookData } from '@/types';
import { transformToBookData } from '@/utils/bookUtils'
import { handleApiResponse, ApiError } from '@/utils/api';

interface SaveBookState {
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

export const useBookSave = (userId: string) => {
  const [state, setState] = useState<SaveBookState>({
    isLoading: false,
    error: null,
    successMessage: null,
  });

  const saveBook = useCallback(async (book: OpenLibraryBook) => {
    if (!userId) {
      setState(prev => ({ ...prev, error: 'User not authenticated' }));
      return;
    }

    setState({ isLoading: true, error: null, successMessage: null });

    try {
      const bookData = transformToBookData(book, userId);
      
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData),
      });

      await handleApiResponse(response);

      setState({
        isLoading: false,
        error: null,
        successMessage: 'Book saved successfully!',
      });

      // Auto-clear success message after 3 seconds
      setTimeout(() => {
        setState(prev => ({ ...prev, successMessage: null }));
      }, 3000);

    } catch (error) {
      let errorMessage = 'Failed to save book';
      
      if (error instanceof ApiError) {
        errorMessage = error.status === 409 
          ? 'Book already exists in your library' 
          : error.message;
      }

      setState({
        isLoading: false,
        error: errorMessage,
        successMessage: null,
      });
    }
  }, [userId]);

  const clearMessages = useCallback(() => {
    setState(prev => ({ ...prev, error: null, successMessage: null }));
  }, []);

  return {
    ...state,
    saveBook,
    clearMessages,
  };
};
