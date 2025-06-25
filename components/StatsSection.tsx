'use client';

import React from 'react';
import { UserData } from '../types';

interface StatsSectionProps {
  userData?: UserData;
}

const StatsSection: React.FC<StatsSectionProps> = ({ userData }) => {
  const booksRead = userData?.booksRead?.length || 0;
  const currentlyReading = userData?.reading?.length || 0;
  const wantToRead = userData?.wantToRead?.length || 0;

  // Calculate books read this month
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const booksThisMonth = userData?.booksRead?.filter(book => {
    if (book.dateCompleted) {
      const bookDate = new Date(book.dateCompleted);
      return bookDate.getMonth() === thisMonth && bookDate.getFullYear() === thisYear;
    }
    return false;
  }).length || 0;

  return (
    <>
    <div className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
      <h2 className="text-3xl font-semibold text-space-brown mb-8 font-serif text-center">
        Your Reading Journey
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Books Read */}
        <div className="stat-card rounded-3xl p-8 text-center group">
          <div className="text-5xl mb-4 animate-float">📚</div>
          <div className="text-4xl font-bold text-space-brown mb-2">{booksRead}</div>
          <div className="text-warm-brown font-medium text-lg">Books Read</div>
          {booksThisMonth > 0 && (
            <div className="mt-2 text-xs text-warm-brown opacity-70">
              +{booksThisMonth} this month
            </div>
          )}
        </div>
        
        {/* Currently Reading */}
        <div className="stat-card rounded-3xl p-8 text-center group">
          <div className="text-5xl mb-4 animate-float-delayed">📖</div>
          <div className="text-4xl font-bold text-space-brown mb-2">{currentlyReading}</div>
          <div className="text-warm-brown font-medium text-lg">Currently Reading</div>
          <div className="mt-4 text-xs text-warm-brown opacity-70">Making great progress!</div>
        </div>
        
        {/* Want to Read */}
        <div className="stat-card rounded-3xl p-8 text-center group sm:col-span-2 lg:col-span-1">
          <div className="text-5xl mb-4 animate-float-delayed-2">⭐</div>
          <div className="text-4xl font-bold text-space-brown mb-2">{wantToRead}</div>
          <div className="text-warm-brown font-medium text-lg">Want to Read</div>
          <div className="mt-4 text-xs text-warm-brown opacity-70">So many adventures await</div>
        </div>
      </div>
    </div>
    </>
  );
};

export default StatsSection;