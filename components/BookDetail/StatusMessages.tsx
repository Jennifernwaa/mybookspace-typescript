'use client';

import React, { memo } from 'react';

interface StatusMessagesProps {
  successMessage?: string;
  saveError?: string;
}

export const StatusMessages = memo(({ successMessage, saveError }: StatusMessagesProps) => (
  <>
    {successMessage && (
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
        {successMessage}
      </div>
    )}
    {saveError && (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
        {saveError}
      </div>
    )}
  </>
));

StatusMessages.displayName = 'StatusMessages';