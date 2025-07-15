'use client';

import React, { memo, useState } from 'react';
import { OpenLibraryBook } from '@/types';
import { getCoverUrl } from '@/utils/bookUtils';

interface BookCoverProps {
  book: OpenLibraryBook;
}

export const BookCover = memo(({ book }: BookCoverProps) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="w-48 h-72 mx-auto mb-6 bg-gradient-to-br from-peach to-salmon rounded-2xl shadow-2xl overflow-hidden">
      {!imageError ? (
        <img
          src={getCoverUrl(book, 'L')}
          alt={`Cover for ${book.title}`}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white text-6xl">
          📚
        </div>
      )}
    </div>
  );
});

BookCover.displayName = 'BookCover';