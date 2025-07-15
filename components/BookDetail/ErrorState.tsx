'use client';

import React, { memo } from 'react';

interface ErrorStateProps {
  onGoBack: () => void;
}

export const ErrorState = memo(({ onGoBack }: ErrorStateProps) => (
  <div className="text-center py-20">
    <div className="text-6xl mb-4">😔</div>
    <h2 className="text-2xl font-bold text-space-brown mb-2">Book Not Found</h2>
    <p className="text-warm-brown mb-6">Sorry, we couldn't load the book details.</p>
    <button
      onClick={onGoBack}
      className="back-button text-white px-6 py-3 rounded-lg font-medium"
    >
      Go Back
    </button>
  </div>
));

ErrorState.displayName = 'ErrorState';