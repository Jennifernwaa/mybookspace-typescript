'use client';

import React from 'react';
import { User } from '@/types';

// Update the component to accept onAddFriend as a prop
export default function UserSearchResultCard({
  user,
  onAddFriend,
}: {
  user: User;
  onAddFriend: (userId: string) => Promise<any>; // Add the onAddFriend prop type
}) {

  const handleAdd = async () => {
    await onAddFriend(user._id!);
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