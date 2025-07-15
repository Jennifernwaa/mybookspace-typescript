'use client';

import { Suspense } from 'react';
import FriendsList from '@/components/Friends/FriendsList';
import SearchFriends from '@/components/Friends/SearchFriends';
import CreatePost from '@/components/Feed/CreatePost';
import FeedPost from '@/components/Feed/FeedPost';
import { useFeed } from '@/hooks/useFeed';

export default function FeedPage() {
  const { posts, loading } = useFeed();

  return (
    <main className="parent grid grid-cols-1 md:grid-cols-5 md:grid-rows-5 gap-4 max-w-7xl mx-auto py-4 md:py-12 px-4 md:px-8 mb-20 md:mb-0">
      
      {/* Friends List Section */}
      <section className="md:col-span-2 md:row-span-5 bg-white/80 rounded-2xl shadow-lg p-4 md:p-6 flex flex-col overflow-y-auto min-h-[300px] md:min-h-[400px]">
        <FriendsList />
      </section>

      {/* Search Friends Section */}
      <section className="md:col-span-3 md:row-span-1 bg-white/80 rounded-2xl shadow-lg p-4 md:p-8 flex flex-col justify-center">
        <SearchFriends />
      </section>

      {/* Feed Section */}
      <section className="md:col-span-3 md:row-span-4 md:col-start-3 md:row-start-2 bg-white/80 rounded-2xl shadow-lg p-4 md:p-8 flex flex-col">
        <CreatePost />

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-6 text-warm-brown opacity-70 animate-pulse">
            ⏳ Loading your feed...
          </div>
        ) : posts.length === 0 ? (
          // Empty State
          <div className="text-center py-6 md:py-8">
            <div className="text-4xl md:text-5xl mb-2">📭</div>
            <p className="text-warm-brown opacity-70 text-sm md:text-base">
              No posts yet. Share something to start your feed!
            </p>
          </div>
        ) : (
          // Feed Posts
          <div className="space-y-3 md:space-y-4 flex-1 overflow-y-auto min-h-64 md:min-h-72">
            {posts.map((post) => (
              <FeedPost key={post._id} post={post} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
