import { useDashboard } from '@/hooks/useDashboard';
import { useProfile } from '@/hooks/useProfile';
import React from 'react'

interface Props {
  params: { userId: string }; 
}
export const UserProfilePage = ({ params }: Props) => {
    const { userData, readingStats, isOwnProfile } = useProfile(userId);
    
  return (
    <div>page</div>
  )
}
