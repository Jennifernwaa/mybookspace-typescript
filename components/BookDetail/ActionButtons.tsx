'use client';

import React, { memo } from 'react';
import { OpenLibraryBook } from '@/types';

interface ActionButtonsProps {
  book: OpenLibraryBook;
  onSaveBook: (book: OpenLibraryBook) => void;
  isSaving: boolean;
}

export const ActionButtons = memo(({ book, onSaveBook, isSaving }: ActionButtonsProps) => (
  <div className="space-y-4">
    <button 
      onClick={() => onSaveBook(book)}
      disabled={isSaving}
      className="action-button w-full text-space-brown px-6 py-3 rounded-xl font-semibold text-lg flex items-center justify-center space-x-2 disabled:opacity-50"
    >
      <span>➕</span>
      <span>{isSaving ? 'Saving...' : 'Add to Library'}</span>
    </button>
    
  </div>
));

ActionButtons.displayName = 'ActionButtons';