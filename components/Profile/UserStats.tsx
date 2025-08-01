import React from 'react';

// Define the props for this component
interface UserStatsProps {
  booksRead: number;
  friendsCount: number;
}

export const UserStats: React.FC<UserStatsProps> = ({ booksRead, friendsCount }) => {
  return (
    <div className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
      <h2 className="text-3xl font-semibold text-space-brown mb-8 font-serif text-center">Reading Stats</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {/* Books Read Card */}
        <div className="stat-card rounded-3xl p-8 text-center group">
          <div className="text-5xl mb-4 animate-float">📚</div>
          <div className="text-4xl font-bold text-space-brown mb-2">{booksRead}</div>
          <div className="text-warm-brown font-medium text-lg">Books Read</div>
          <div className="mt-4 text-xs text-warm-brown opacity-70">
            This year: {booksRead} books
          </div>
        </div>
        {/* Friends Count Card */}
        <div className="stat-card rounded-3xl p-8 text-center group">
          <div className="text-5xl mb-4 animate-float-delayed">👥</div>
          <div className="text-4xl font-bold text-space-brown mb-2">{friendsCount}</div>
          <div className="text-warm-brown font-medium text-lg">Book Friends</div>
        </div>
        {/* Book Clubs Card (Placeholder) */}
        <div className="stat-card rounded-3xl p-8 text-center group">
          <div className="text-5xl mb-4 animate-float-delayed-2">🏛️</div>
          <div className="text-4xl font-bold text-space-brown mb-2">3</div>
          <div className="text-warm-brown font-medium text-lg">Book Clubs</div>
          <div className="mt-4 text-xs text-warm-brown opacity-70">Active member</div>
        </div>
      </div>
    </div>
  );
};

export default UserStats;
