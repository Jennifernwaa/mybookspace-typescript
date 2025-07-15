'use client';

import { useFeed } from '@/hooks/useFeed';

export default function DeletePostButton({ postId }: { postId: string }) {
  const { deletePost } = useFeed();

  return (
    <button
      onClick={() => deletePost(postId)}
      className="text-sm text-red-500 hover:text-red-700"
    >
      Delete
    </button>
  );
}
