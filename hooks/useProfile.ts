import { useCallback, useMemo, useEffect, useState } from 'react';
import { useUser } from './useUser';
import { User, Book, ApiResponse, OpenLibraryBook, RecommendedBook } from '@/types';
import { useParams } from 'next/navigation';

export const useProfile = () => {
  const params = useParams();
  const urlUserId = params?.userId as string | undefined;
  const localUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') ?? undefined : undefined;
  const targetUserId = urlUserId || localUserId;

  const [stats, setStats] = useState<{ totalBooksRead: number, friendsCount: number } | null>(null);
  const [favoriteBooks, setFavoriteBooks] = useState<RecommendedBook[]>([]);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const isOwnProfile = targetUserId === localUserId;

  const {
    userData,
    isLoading: userLoading,
    error: userError,
    updateUser,
    refetchUser
  } = useUser(targetUserId);

  useEffect(() => {
    // Only fetch if a valid user ID is available
    if (!targetUserId) {
      setIsStatsLoading(false);
      return;
    }
    
    const fetchProfileData = async () => {
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
          
          const transformedBooks: RecommendedBook[] = (favoriteBooksData.data || []).map(book => {
            return {
              key: book._id,
              title: book.title,
              author_name: book.author, 
              first_publish_year: book.first_publish_year,
              publisher: book.publisher ? [book.publisher] : [], 
              cover_url: book.cover_url || 'https://via.placeholder.com/150?text=No+Cover',
            };
          });
          setFavoriteBooks(transformedBooks);
        } else {
          throw new Error('Failed to fetch profile stats or favorite books');
        }
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setStatsError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsStatsLoading(false);
      }
    };
      fetchProfileData();
    }, [targetUserId, refreshKey]);  // Re-run effect only when targetUserId or refreshKey changes
    
    const readingStats = useMemo(() => ({
      booksRead: stats?.totalBooksRead || 0,
    }), [stats]);
    
    const friendsCount = useMemo(() => stats?.friendsCount || 0, [stats]);

    const isLoading = userLoading || isStatsLoading;
    const error = userError || statsError;

    // Update refetchProfile to increment the refreshKey
    const refetchProfile = useCallback(() => {
      refetchUser();
      setRefreshKey(prevKey => prevKey + 1);
    }, [refetchUser]);

    return {
      userData,
      favoriteBooks,
      isLoading,
      error,
      isOwnProfile,
      readingStats,
      friendsCount,
      updateProfile: updateUser,
      refetchProfile,
    };
  };