'use client';

import { useFeed } from '@/hooks/useFeed';

interface Props {
  postId: string;
  isLiked?: boolean;
  likeCount: number;
}

export default function LikeButton({ postId, isLiked, likeCount }: Props) {
  const { likePost } = useFeed();

  return (
    <button
      onClick={() => likePost(postId)}
      className={`text-sm flex items-center gap-1 font-medium transition-colors ${isLiked ? 'text-red-500' : 'text-space-brown'}`}
    >
      <span>{isLiked ? '♥' : '♡'}</span>
      <span>{likeCount}</span>
    </button>
  );
}