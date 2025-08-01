import React from 'react';

export const RecentActivity: React.FC = () => {
  return (
    <div className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
      <div className="glass-card rounded-3xl p-8">
        <h3 className="text-2xl font-semibold text-space-brown mb-6 font-serif text-center">Recent Activity</h3>
        <div className="space-y-6">
          {/* Placeholder Activities */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-cream-light to-ivory">
            <div className="w-12 h-12 bg-gradient-to-br from-salmon to-rose-red rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">⭐</span>
            </div>
            <div className="flex-1">
              <p className="text-space-brown font-medium">Finished reading "The Seven Husbands of Evelyn Hugo"</p>
              <p className="text-warm-brown text-sm opacity-75">Rated 5 stars • 2 days ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-cream-light to-ivory">
            <div className="w-12 h-12 bg-gradient-to-br from-peach to-salmon rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">👥</span>
            </div>
            <div className="flex-1">
              <p className="text-space-brown font-medium">Joined "Fantasy Book Club"</p>
              <p className="text-warm-brown text-sm opacity-75">1 week ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-cream-light to-ivory">
            <div className="w-12 h-12 bg-gradient-to-br from-space-pink-dark to-space-red rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">📖</span>
            </div>
            <div className="flex-1">
              <p className="text-space-brown font-medium">Started reading "Project Hail Mary"</p>
              <p className="text-warm-brown text-sm opacity-75">1 week ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
