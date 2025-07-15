'use client';

import React, { memo } from 'react';

interface BookHeaderProps {
  onGoBack: () => void;
}

export const BookHeader = memo(({ onGoBack }: BookHeaderProps) => (
  <div className="flex items-center justify-between mb-8">
    <button
      onClick={onGoBack}
      className="back-button text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
    >
      <span>←</span>
      <span>Back</span>
    </button>
    <h1 className="text-2xl font-bold text-space-brown">Book Details</h1>
    <div className="w-16"></div> {/* Spacer for centering */}
  </div>
));

BookHeader.displayName = 'BookHeader';
