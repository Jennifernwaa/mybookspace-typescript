'use client';

import React, { memo } from 'react';

export const LoadingState = memo(() => (
  <div className="text-center py-20">
    <div className="loading-spinner mx-auto mb-4"></div>
    <p className="text-warm-brown">Loading details...</p>
  </div>
));

LoadingState.displayName = 'LoadingState';