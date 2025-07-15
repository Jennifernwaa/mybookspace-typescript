'use client';

import React from 'react';
import { User } from '@/types';
import { useFriends } from '@/hooks/useFriends';

export default function UserSearchResultCard({ user }: { user: User }) {
  const { addFriend } = useFriends();

  const handleAdd = async () => {
    await addFriend(user._id!);
  };

  return (
    <div className="bg-white rounded-xl p-4 flex items-center justify-between shadow-md">
      <div>
        <p className="text-space-brown font-medium">{user.userName}</p>
        <p className="text-sm text-warm-brown opacity-70">{user.email}</p>
      </div>
      <button
        onClick={handleAdd}
        className="bg-peach text-white px-4 py-2 rounded-lg hover:bg-salmon transition"
      >
        Add Friend
      </button>
    </div>
  );
}