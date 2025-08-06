'use client';

import { useFeed } from '@/hooks/useFeed';

interface Props {
  postId: string;
  isLiked?: boolean;
  likeCount: number;
  onLike: (postId: string) => void;
}


export default function LikeButton({ postId, isLiked, likeCount, onLike }: Props) {
  return (
    <button
      onClick={() => onLike(postId)}
      className={`text-sm flex items-center gap-1 font-medium transition-colors ${isLiked ? 'text-red-500' : 'text-space-brown'}`}
    >
      <span>{isLiked ? '♥' : '♡'}</span>
      <span>{likeCount}</span>
    </button>
  );
}