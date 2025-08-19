'use client';

import { FeedPost as PostType } from '@/hooks/useFeed';
import LikeButton from './LikeButton';
import DeletePostButton from './DeletePostButton';
import CommentSection from './CommentSection';
import { useUser } from '@/hooks/useUser';

interface FeedPostProps {
  post: PostType;
  deletePost: (postId: string) => void;
  likePost: (postId: string) => void;
  addComment: (postId: string, content: string) => void;
}

export default function FeedPost({ post, deletePost, likePost, addComment }: FeedPostProps) {
  const { userData } = useUser();
  const currentUserId = userData?._id;
  const isOwnPost = userData?._id === post.authorId;

  // Check if current user has liked the post
  const isLiked = currentUserId ? post.likes.includes(currentUserId) : false;

  return (
    <div className="glass-card p-4 rounded-xl md:rounded-2xl animate-fade-in-up">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-peach text-white flex items-center justify-center font-bold">
          {post.authorName.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="flex justify-between">
            <h3 className="text-space-brown font-semibold">{post.authorName}</h3>
            {isOwnPost && <DeletePostButton postId={post.postId} onDelete={deletePost} />}
          </div>
          <p className="text-space-brown text-sm mt-1 whitespace-pre-wrap">{post.content}</p>
          <div className="flex items-center justify-between mt-2">
            <LikeButton 
            postId={post.postId} 
            isLiked={isLiked} 
            likeCount={post.likes.length} 
            onLike={likePost} 
            />
            <span className="text-xs text-warm-brown opacity-60">
              {new Date(post.createdAt).toLocaleString()}
            </span>
          </div>
          <CommentSection post={post} onAddComment={addComment} postId={post.postId}/>
        </div>
      </div>
    </div>
  );
}