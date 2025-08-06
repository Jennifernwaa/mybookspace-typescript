'use client';

import { useFeed } from '@/hooks/useFeed';

export default function DeletePostButton({ postId, onDelete }: { postId: string, onDelete: (postId: string) => void }) {
  return (
    <button
      onClick={() => onDelete(postId)}
      className="text-sm text-red-500 hover:text-red-700"
    >
      Delete
    </button>
  );
}