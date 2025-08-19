'use client';

import { Suspense } from 'react';
import FriendsList from '@/components/Friends/FriendsList';
import SearchFriends from '@/components/Friends/SearchFriends';
import CreatePost from '@/components/Feed/CreatePost';
import FeedPost from '@/components/Feed/FeedPost';
import { useFeed } from '@/hooks/useFeed';
import { useFriends } from '@/hooks/useFriends';
import PostCard from '@/components/Feed/PostCard';

export default function FeedPage() {
  const { posts, loading: feedLoading, createPost, deletePost, likePost, addComment } = useFeed();
  const { friends, loading: friendsLoading, addFriend } = useFriends();

  return (
    <main className="parent grid grid-cols-1 md:grid-cols-5 md:grid-rows-5 gap-4 max-w-7xl mx-auto py-4 md:py-12 px-4 md:px-8 mb-20 md:mb-0">
      
      {/* Friends List Section */}
      <section className="md:col-span-2 md:row-span-5 bg-white/80 rounded-2xl shadow-lg p-4 md:p-6 flex flex-col overflow-y-auto min-h-[300px] md:min-h-[400px]">
        <FriendsList friends={friends} loading={friendsLoading}/>
      </section>

      {/* Search Friends Section */}
      <section className="md:col-span-3 md:row-span-1 bg-white/80 rounded-2xl shadow-lg p-4 md:p-8 flex flex-col justify-center">
        <SearchFriends addFriend={addFriend} friends={friends}/>
      </section>

      {/* Feed Section */}
      <section className="md:col-span-3 md:row-span-4 md:col-start-3 md:row-start-2 bg-white/80 rounded-2xl shadow-lg p-4 md:p-8 flex flex-col">
        <CreatePost createPost={createPost}/>

        <PostCard 
          posts={posts} 
          loading={feedLoading} 
          deletePost={deletePost}
          likePost={likePost}
          addComment={addComment}
        />

      </section>
    </main>
  );
}
