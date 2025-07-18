
import { useEffect, useState, useCallback } from 'react';
import { User, ApiResponse } from '@/types';

export const useUser = (userId?: string) => {
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get the target user ID (from param or localStorage)
  const targetUserId = userId || localStorage.getItem('userId');

  const fetchUser = useCallback(async () => {
    if (!targetUserId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const res = await fetch(`/api/users/${targetUserId}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch user: ${res.status}`);
      }
      
      const response: ApiResponse<User> = await res.json();
      if (response.success && response.data) {
        setUserData(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch user data');
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [targetUserId]);

  const updateUser = useCallback(async (updates: Partial<User>) => {
    if (!targetUserId) return;

    try {
      const res = await fetch(`/api/users/${targetUserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        throw new Error(`Failed to update user: ${res.status}`);
      }

      const response: ApiResponse<User> = await res.json();
      if (response.success && response.data) {
        setUserData(response.data);
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to update user');
      }
    } catch (err) {
      console.error('Error updating user:', err);
      throw err;
    }
  }, [targetUserId]);

  const refetchUser = useCallback(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { 
    userData, 
    isLoading, 
    error, 
    updateUser, 
    refetchUser 
  };
};