'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = localStorage.getItem('userId');
    if (!id) {
      router.push('/sign-in');
    } else {
      setUserId(id);
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center text-xl">
        Checking authentication...
      </div>
    );
  }

  if (!userId) {
    return null; // Return nothing while redirecting
  }

  return <>{children}</>;
}
