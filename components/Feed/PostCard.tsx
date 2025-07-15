'use client';

import FeedPost from './FeedPost';
import { useFeed } from '@/hooks/useFeed';

export default function PostCard() {
  const { posts, loading, error } = useFeed();

  if (loading) {
    return (
      <div className="text-center py-6 md:py-8">
        <div className="text-3xl md:text-4xl mb-2 animate-pulse">⏳</div>
        <p className="text-warm-brown opacity-70 text-sm md:text-base">Loading your feed...</p>
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className="text-center py-6 md:py-8">
        <div className="text-4xl md:text-5xl mb-2">📭</div>
        <p className="text-warm-brown opacity-70 text-sm md:text-base">No posts yet. Share something to start your feed!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 md:space-y-4 flex-1 overflow-y-auto min-h-64 md:min-h-72">
      {posts.map(post => (
        <FeedPost key={post._id} post={post} />
      ))}
    </div>
  );
}