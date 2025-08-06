'use client';

import { useState } from 'react';
import { FeedPost } from '@/hooks/useFeed';
import { useUser } from '@/hooks/useUser';

export default function CommentSection({ post, onAddComment, postId }: { post: FeedPost; onAddComment: (postId: string, content: string) => void; postId: string }) {
  const [comment, setComment] = useState('');

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    await onAddComment(postId, comment);
    setComment('');
  };

return (
  <div className="mt-3 space-y-2">
    {post.comments.map(c => (
      <div key={c._id} className="text-sm text-warm-brown">
        <span className="font-medium">{c.authorName}</span>: {c.content}
      </div>
    ))}
    <div className="flex gap-2 items-center mt-2">
      <input
        type="text"
        className="border border-warm-brown rounded-md px-3 py-1 text-sm w-full"
        placeholder="Add a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button
        onClick={handleAddComment}
        className="text-sm px-2 py-1 rounded bg-warm-brown text-white"
      >
        Post
      </button>
    </div>
  </div>
  );
}
