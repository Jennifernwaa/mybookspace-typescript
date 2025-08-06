'use client';

import { useState } from 'react';
import { CreatePostData, useFeed } from '@/hooks/useFeed';
import { useUser } from '@/hooks/useUser';

interface CreatePostProps {
  createPost: (postData: CreatePostData) => Promise<any>;
}

export default function CreatePost({ createPost }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [charCount, setCharCount] = useState(0);
  const creating = false;
  const { userData } = useUser();

  const handlePost = async () => {
    if (!content.trim()) return;
    await createPost({ content });
    setContent('');
    setCharCount(0);
  };

  return (
    <div className="glass-card rounded-xl md:rounded-2xl p-4 md:p-6 mb-6 md:mb-8 animate-fade-in-up">
      <div className="flex items-start space-x-3 md:space-x-4">
        <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-peach to-salmon rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
          <span className="text-white font-semibold text-sm md:text-base">
            {userData?.userName?.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1">
          <textarea
            className="post-textarea w-full min-h-[50px] md:min-h-[60px] max-h-32 md:max-h-40 px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl text-space-brown placeholder-warm-brown placeholder-opacity-60 text-sm md:text-lg resize-none mb-2"
            placeholder="Share your latest book thoughts... 📚✨"
            maxLength={500}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setCharCount(e.target.value.length);
            }}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs md:text-sm text-warm-brown opacity-70">{charCount}/500 characters</span>
            <button
              onClick={handlePost}
              disabled={creating || !content.trim()}
              className="action-btn text-white px-4 md:px-6 py-1.5 md:py-2 rounded-lg md:rounded-xl font-semibold flex items-center space-x-1 md:space-x-2 text-sm md:text-base disabled:opacity-50"
            >
              <span>{creating ? 'Posting...' : 'Post'}</span>
              <span className="text-base md:text-lg">🚀</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
