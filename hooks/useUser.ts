import { useEffect, useState } from 'react';
import { UserData } from '@/types';

export const useUser = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const uid = localStorage.getItem('userId');
    if (!uid) {
      setIsLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${uid}`);
        if (!res.ok) throw new Error('Failed to fetch user');
        const user = await res.json();
        setUserData(user);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { userData, isLoading };
};
