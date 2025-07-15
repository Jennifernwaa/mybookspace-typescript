'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useBookDetails } from '@/hooks/useBookDetails';
import { useBookSave } from '@/hooks/useBookSave';
import { useDashboard } from '@/hooks/useDashboard';
import { OpenLibraryBook } from '@/types';
import { reconstructBookFromParams } from '@/utils/bookDetailUtils';
import { BookCover } from '@/components/BookDetail/BookCover';
import { ActionButtons } from '@/components/BookDetail/ActionButtons';
import { BookInfo } from '@/components/BookDetail/BookInfo';
import { BookHeader } from '@/components/BookDetail/BookHeader';
import { StatusMessages } from '@/components/BookDetail/StatusMessages';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/BookDetail/ErrorState';
import { useUser } from '@/hooks/useUser';

const BookDetailPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userData } = useUser();
  
  const { book, isLoading, error, fetchBookDetails } = useBookDetails('');
  const { 
    isLoading: isSaving, 
    error: saveError, 
    successMessage, 
    saveBook, 
    clearMessages 
  } = useBookSave(userData?._id || '');

  useEffect(() => {
    const reconstructedBook = reconstructBookFromParams(searchParams);
    if (reconstructedBook) {
      fetchBookDetails(reconstructedBook);
    }
  }, [searchParams, fetchBookDetails]);

  const handleGoBack = () => router.back();

  const handleSaveBook = async (bookToSave: OpenLibraryBook) => {
    try {
      await saveBook(bookToSave);
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  // Clear messages after delay
  useEffect(() => {
    if (successMessage || saveError) {
      const timer = setTimeout(clearMessages, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, saveError, clearMessages]);

  if (isLoading) return <LoadingState />;
  if (error || !book) return <ErrorState onGoBack={handleGoBack} />;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <BookHeader onGoBack={handleGoBack} />
        <StatusMessages 
          successMessage={successMessage || undefined} 
          saveError={saveError || undefined} 
        />
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3 p-8 bg-gradient-to-br from-cream-light to-peach-light">
                <BookCover book={book} />
                <ActionButtons 
                  book={book}
                  onSaveBook={handleSaveBook}
                  isSaving={isSaving}
                />
              </div>
              <BookInfo book={book} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;