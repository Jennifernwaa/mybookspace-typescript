import { useState, useEffect } from 'react';
import { User, SearchResult, ApiResponse } from '@/types';

export const useFriends = () => {
  const [friends, setFriends] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFriends = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/friends`);
      const data: ApiResponse<User[]> = await response.json();
      
      if (data.success) {
        setFriends(data.data || []);
      } else {
        setError(data.error || 'Failed to fetch friends');
      }
    } catch (err) {
      setError('Failed to fetch friends');
    } finally {
      setLoading(false);
    }
  };

  const addFriend = async (targetUserId: string) => {
    try {
      const response = await fetch(`/api/friends/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId })
      });

      const data: ApiResponse<null> = await response.json();
      
      if (data.success) {
        await fetchFriends(); // Refresh friends list
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: 'Failed to add friend' };
    }
  };

  const removeFriend = async (targetUserId: string) => {
    try {
      const response = await fetch(`/api/friends/remove`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId })
      });

      const data: ApiResponse<null> = await response.json();
      
      if (data.success) {
        await fetchFriends(); // Refresh friends list
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: 'Failed to remove friend' };
    }
  };

  const searchUsers = async (query: string): Promise<SearchResult[]> => {
    try {
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
      const data: ApiResponse<SearchResult[]> = await response.json();
      
      if (data.success) {
        return data.data || [];
      } else {
        throw new Error(data.error || 'Failed to search users');
      }
    } catch (err) {
      throw new Error('Failed to search users');
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  return {
    friends,
    loading,
    error,
    addFriend,
    removeFriend,
    searchUsers,
    refetch: fetchFriends
  };
};