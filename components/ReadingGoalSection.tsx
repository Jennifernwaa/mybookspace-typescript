import React from 'react';
import { Book, UserData } from '@/types';

interface ReadingGoalSectionProps {
  userData: UserData | null;
  booksRead: Book[];
}

const ReadingGoalSection: React.FC<ReadingGoalSectionProps> = ({ userData, booksRead }) => {
  const totalBooksRead = booksRead.length;
  const readingGoal = userData?.readingGoal || 60;
  const progress = readingGoal > 0 ? (totalBooksRead / readingGoal) * 100 : 0;
  const roundedProgress = Math.round(progress);

  const getProgressMessage = () => {
    if (roundedProgress >= 100) {
      return "🎉 Congratulations! You've reached your reading goal! 🎉";
    } else if (roundedProgress >= 75) {
      return `You're ${roundedProgress}% of the way to your goal! Almost there! 🌟`;
    } else if (roundedProgress >= 50) {
      return `You're ${roundedProgress}% of the way to your goal! Keep it up! 📚`;
    } else {
      return `You're ${roundedProgress}% of the way to your goal! Every book counts! 💪`;
    }
  };

  return (
    <div className="mt-12 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
      <div className="glass-card rounded-3xl p-8 text-center">
        <h3 className="text-2xl font-bold text-space-brown mb-4 font-serif">
          {new Date().getFullYear()} Reading Goal
        </h3>
        <div className="flex items-center justify-center mb-6">
          <div className="text-5xl font-bold text-space-red">{totalBooksRead}</div>
          <div className="mx-4 text-2xl text-warm-brown">/</div>
          <div className="text-3xl font-semibold text-warm-brown opacity-75">
            {readingGoal}
          </div>
        </div>
        <div className="max-w-md mx-auto mb-4">
          <div className="w-full bg-cream-medium rounded-full h-3">
            <div 
              className="progress-bar rounded-full h-3 transition-all duration-1000" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <p className="text-warm-brown text-sm">
          {getProgressMessage()}
        </p>
      </div>
    </div>
  );
};

export default ReadingGoalSection;