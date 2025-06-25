'use client';

import React from 'react';

interface HeroSectionProps {
  userName?: string;
  onContinueReading: () => void;
  onAddNewBook: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ 
  userName, 
  onContinueReading, 
  onAddNewBook 
}) => {
  return (
    <>
    <div className="hero-section-bg rounded-3xl p-8 md:p-12 mb-12 animate-fade-in-up">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4 font-serif animate-float">
          {userName ? `Welcome back, ${userName}! 🌸` : 'Welcome to myBookSpace! 🌸'}
        </h1>
        <p className="warm-brown-text text-lg md:text-xl opacity-90 mb-6 max-w-2xl mx-auto">
          Ready to dive into your next literary adventure? Your books are waiting for you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={onContinueReading}
            className="bg-space-red text-white px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-all transform hover:scale-105 shadow-lg animate-glow"
          >
            Continue Reading
          </button>
          <button 
            onClick={onAddNewBook}
            className="bg-white text-space-red px-8 py-3 rounded-full font-semibold border-2 border-space-red hover:bg-cream-light transition-all transform hover:scale-105 shadow-lg"
          >
            Add New Book
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default HeroSection;