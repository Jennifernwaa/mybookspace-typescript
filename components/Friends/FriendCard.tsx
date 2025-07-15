'use client';

import React from 'react';
import { User } from '@/types';

export default function FriendCard({ user }: { user: User }) {
  return (
    <div className="bg-cream-light p-4 rounded-xl shadow-md flex items-center justify-between">
      <div>
        <h3 className="font-semibold text-lg text-space-brown">{user.userName}</h3>
        <p className="text-warm-brown text-sm opacity-75">{user.email}</p>
      </div>
    </div>
  );
}