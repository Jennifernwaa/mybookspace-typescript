import { useState, useEffect, useCallback } from 'react';
import { useNotification } from './useNotification';


export interface FeedPost {
  _id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: Date; // to match the schema and fetched data
  likes: string[];
  comments: Array<{
    _id: string;
    content: string;
    authorId: string;
    authorName: string;
    createdAt: Date; // to match the schema and fetched data
  }>;
  isLiked?: boolean;
}

export interface CreatePostData {
  content: string;
}

export function useFeed() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const { showNotification } = useNotification();

  const fetchFeed = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/feed', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch feed');
      }

      const data = await response.json();
      setPosts(data.data || []);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load feed';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const createPost = useCallback(async (postData: CreatePostData) => {
    try {
      setCreating(true);
      setError(null);

      const response = await fetch('/api/feed/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const data = await response.json();
      
      // Add the new post to the beginning of the posts array
      setPosts(prev => [data.post, ...prev]);
      
      showNotification('Post shared with your reading circle! 🚀', 'success');
      return data.post;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create post';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
      throw err;
    } finally {
      setCreating(false);
    }
  }, [showNotification]);

  const deletePost = useCallback(async (postId: string) => {
    try {
      const response = await fetch(`/api/feed/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      // Remove the post from the posts array
      setPosts(prev => prev.filter(post => post._id !== postId));
      
      showNotification('Post deleted successfully! 🗑️', 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete post';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
      throw err;
    }
  }, [showNotification]);

  const likePost = useCallback(async (postId: string) => {
    try {
      const response = await fetch(`/api/feed/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId }),
      });

      if (!response.ok) {
        throw new Error('Failed to like post');
      }

      const data = await response.json();
      
      // Update the post in the posts array
      setPosts(prev => prev.map(post => 
        post._id === postId 
          ? { ...post, likes: data.likes, isLiked: data.isLiked }
          : post
      ));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to like post';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
    }
  }, [showNotification]);

  const addComment = useCallback(async (postId: string, content: string) => {
    try {
      const response = await fetch(`/api/feed/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId, content }),
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      const data = await response.json();
      
      // Update the post's comments in the posts array
      setPosts(prev => prev.map(post => 
        post._id === postId 
          ? { ...post, comments: data.comments }
          : post
      ));
      
      showNotification('Comment added! 💬', 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add comment';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
    }
  }, [showNotification]);

  // Initial fetch
  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  // Auto-refresh feed every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchFeed, 30000);
    return () => clearInterval(interval);
  }, [fetchFeed]);

  return {
    posts,
    loading,
    error,
    creating,
    createPost,
    deletePost,
    likePost,
    addComment,
    refreshFeed: fetchFeed,
  };
}