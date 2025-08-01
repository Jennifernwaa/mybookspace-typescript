import { useCallback, useMemo, useEffect, useState } from 'react';
import { useUser } from './useUser';
import { User, Book, ApiResponse } from '@/types';
import { useParams } from 'next/navigation';

export const useProfile = () => {
  const params = useParams();
  const urlUserId = params?.userId as string | undefined;
  const localUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') ?? undefined : undefined;
  const targetUserId = urlUserId || localUserId;

  const [stats, setStats] = useState<{ totalBooksRead: number, friendsCount: number } | null>(null);
  const [favoriteBooks, setFavoriteBooks] = useState<Book[]>([]);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  const isOwnProfile = targetUserId === localUserId;

  const {
    userData,
    isLoading: userLoading,
    error: userError,
    updateUser, // use this function to update the user
    refetchUser
  } = useUser(targetUserId);

  const fetchProfileData = useCallback(async () => {
    if (!targetUserId) {
      setIsStatsLoading(false);
      return;
    }

    setIsStatsLoading(true);
    setStatsError(null);
    
    try {
      const [statsRes, favoriteBooksRes] = await Promise.all([
        fetch(`/api/users/${targetUserId}/stats`),
        fetch(`/api/users/${targetUserId}/books/favorites`),
      ]);

      const statsData = await statsRes.json();
      const favoriteBooksData: ApiResponse<Book[]> = await favoriteBooksRes.json();

      if (statsData.totalBooksRead !== undefined && favoriteBooksData.success) {
        setStats({
          totalBooksRead: statsData.totalBooksRead,
          friendsCount: statsData.friendsCount,
        });
        setFavoriteBooks(favoriteBooksData.data || []);
      } else {
        throw new Error('Failed to fetch profile stats or favorite books');
      }
    } catch (err) {
      console.error('Error fetching profile data:', err);
      setStatsError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsStatsLoading(false);
    }
  }, [targetUserId]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);
  
  const readingStats = useMemo(() => ({
    booksRead: stats?.totalBooksRead || 0,
  }), [stats]);
  
  const friendsCount = useMemo(() => stats?.friendsCount || 0, [stats]);

  const isLoading = userLoading || isStatsLoading;
  const error = userError || statsError;

  const refetchProfile = useCallback(() => {
    refetchUser();
    fetchProfileData();
  }, [refetchUser, fetchProfileData]);


  return {
    userData,
    favoriteBooks,
    isLoading,
    error,
    isOwnProfile,
    readingStats,
    friendsCount,
    updateProfile: updateUser, // Use the updateUser from useUser directly
    refetchProfile,
  };
};