'use client';

import React, { memo } from 'react';
import { OpenLibraryBook } from '@/types';

interface InfoCardProps {
  icon: string;
  label: string;
  value?: string | number;
}

const InfoCard = memo(({ icon, label, value }: InfoCardProps) => (
  <div className="bg-cream-light rounded-lg p-3">
    <div className="text-2xl mb-1">{icon}</div>
    <div className="text-sm text-warm-brown opacity-75">{label}</div>
    <div className="font-semibold text-space-brown text-sm">{value || 'Unknown'}</div>
  </div>
));

InfoCard.displayName = 'InfoCard';

interface InfoRowProps {
  label: string;
  value?: string;
}

const InfoRow = memo(({ label, value }: InfoRowProps) => (
  <div className="flex justify-between items-start">
    <span className="font-medium">{label}:</span>
    <span className="text-right max-w-md break-words">{value || 'Unknown'}</span>
  </div>
));

InfoRow.displayName = 'InfoRow';

const generateStars = (rating?: number) => {
  return Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={`rating-star ${i < (rating ?? 0) ? 'filled' : ''}`}>
      ★
    </span>
  ));
};

interface BookInfoProps {
  book: OpenLibraryBook;
}

export const BookInfo = memo(({ book }: BookInfoProps) => (
  <div className="md:w-2/3 p-8">
    {/* Book Title & Author */}
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-space-brown mb-2">{book.title}</h1>
      <p className="text-xl text-warm-brown mb-2">
        by {book.author_name?.join(', ') || 'Unknown Author'}
      </p>
      <div className="flex items-center mb-4">
        {generateStars(book.rating)}
        <span className="ml-2 text-sm text-warm-brown">
          ({book.rating || 0} ratings)
        </span>
      </div>
    </div>

    {/* Quick Info Cards */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <InfoCard icon="📅" label="Published" value={book.first_publish_year} />
      <InfoCard icon="📄" label="Pages" value={book.number_of_pages_median} />
      <InfoCard icon="🌍" label="Language" value={book.language?.[0]?.toUpperCase()} />
      <InfoCard icon="⭐" label="Rating" value={book.rating ? book.rating.toFixed(1) : 'N/A'} />
    </div>

    {/* Detailed Information */}
    <div className="bg-cream-light rounded-lg p-6 space-y-4">
      <h3 className="text-xl font-semibold text-space-brown mb-4">Book Information</h3>
      <InfoRow label="Publisher" value={book.publisher?.join(', ')} />
      <InfoRow label="ISBN" value={book.isbn?.join(', ')} />
      <InfoRow label="Subjects" value={book.subject?.slice(0, 5).join(', ')} />
      {book.number_of_pages_median && (
        <InfoRow label="Number of Pages" value={book.number_of_pages_median.toString()} />
      )}
    </div>

    {/* Description */}
    {book.description && (
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-space-brown mb-3">Description</h3>
        <div className="bg-cream-light rounded-lg p-4">
          <p className="text-warm-brown leading-relaxed">
            {typeof book.description === 'string' 
              ? book.description 
              : book.description?.value || 'No description available.'
            }
          </p>
        </div>
      </div>
    )}
  </div>
));

BookInfo.displayName = 'BookInfo';