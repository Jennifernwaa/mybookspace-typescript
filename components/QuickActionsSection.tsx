import React from 'react';

interface QuickActionsSectionProps {
  onAddBook: () => void;
  onMyBooks: () => void;
  onRecommendations: () => void;
}

const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({
  onAddBook,
  onMyBooks,
  onRecommendations,
}) => {
  return (
    <div className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
      <h2 className="text-3xl font-semibold text-space-brown mb-8 font-serif text-center">
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Add Book */}
        <button
          onClick={onAddBook}
          className="action-button rounded-3xl p-8 text-center group w-full"
        >
          <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
            ➕
          </div>
          <div className="text-space-brown font-semibold text-lg button-text transition-colors">
            Add Book
          </div>
        </button>
        {/* My Books */}
        <button
          onClick={onMyBooks}
          className="action-button rounded-3xl p-8 text-center group w-full"
        >
          <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
            📚
          </div>
          <div className="text-space-brown font-semibold text-lg button-text transition-colors">
            My Books
          </div>
        </button>
        {/* Recommendations */}
        <button
          onClick={onRecommendations}
          className="action-button rounded-3xl p-8 text-center group w-full"
        >
          <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
            🌟
          </div>
          <div className="text-space-brown font-semibold text-lg button-text transition-colors">
            Book Recs
          </div>
        </button>
      </div>
    </div>
  );
};

export default QuickActionsSection;