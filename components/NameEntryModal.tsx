import React, { useState } from 'react';

interface NameEntryModalProps {
  isVisible: boolean;
  onSubmit: (data: { fullName: string; userName: string; readingGoal: number }) => Promise<void>;
}

const NameEntryModal: React.FC<NameEntryModalProps> = ({ isVisible, onSubmit }) => {
  const [fullName, setFullName] = useState('');
  const [userName, setUserName] = useState('');
  const [readingGoal, setReadingGoal] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ fullName?: boolean; userName?: boolean }>({});

  if (!isVisible) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    const newErrors: { fullName?: boolean; userName?: boolean } = {};
    if (!fullName.trim()) newErrors.fullName = true;
    if (!userName.trim()) newErrors.userName = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit({
        fullName: fullName.trim(),
        userName: userName.trim(),
        readingGoal
      });
      // Optionally clear form or show success
    } catch (error) {
      console.error('Error submitting name entry:', error);
      alert('Sorry, there was an error setting up your profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-cream-light via-space-pink-light to-peach opacity-95"></div>

      {/* Floating background elements */}
      <div className="absolute top-10 left-10 text-6xl opacity-20 animate-float">📚</div>
      <div className="absolute bottom-20 right-16 text-5xl opacity-15 animate-float-delayed">📖</div>
      <div className="absolute top-1/3 right-8 text-4xl opacity-10 animate-float-delayed-2">✨</div>
      <div className="absolute bottom-1/3 left-12 text-5xl opacity-15 animate-float">🌸</div>

      {/* Modal content */}
      <div className="relative z-10 bg-white bg-opacity-95 backdrop-blur-lg rounded-3xl p-8 md:p-12 max-w-md w-full mx-4 shadow-2xl border border-space-pink-dark border-opacity-30">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-pulse-gentle">🌟</div>
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-4 font-serif">Welcome to</h1>
          <h2 className="text-2xl md:text-3xl font-bold text-space-red mb-2 font-serif">myBookSpace!</h2>
          <p className="text-warm-brown opacity-80 text-lg">Let's personalize your reading journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="fullName" className="block text-space-brown font-semibold mb-3 text-lg">
              What's your Full Name?
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Enter your full name..."
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors text-space-brown bg-white bg-opacity-80 backdrop-blur-sm text-lg ${
                errors.fullName ? 'border-red-500' : 'border-cream-medium focus:border-space-red'
              }`}
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errors.fullName) setErrors(prev => ({ ...prev, fullName: false }));
              }}
              required
              autoComplete="name"
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="userName" className="block text-space-brown font-semibold mb-3 text-lg">
              What should we call you? (Public)
            </label>
            <input
              type="text"
              id="userName"
              name="userName"
              placeholder="Enter your username..."
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors text-space-brown bg-white bg-opacity-80 backdrop-blur-sm text-lg ${
                errors.userName ? 'border-red-500' : 'border-cream-medium focus:border-space-red'
              }`}
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
                if (errors.userName) setErrors(prev => ({ ...prev, userName: false }));
              }}
              required
              autoComplete="username"
            />
          </div>

          <div>
            <label htmlFor="readingGoal" className="block text-space-brown font-semibold mb-3 text-lg">
              Books you'd like to read this year?
            </label>
            <select
              id="readingGoal"
              name="readingGoal"
              className="w-full px-4 py-3 border-2 border-cream-medium rounded-xl focus:border-space-red focus:outline-none transition-colors text-space-brown bg-white bg-opacity-80 backdrop-blur-sm text-lg"
              value={readingGoal}
              onChange={(e) => setReadingGoal(parseInt(e.target.value))}
            >
              <option value={12}>12 books (1 per month)</option>
              <option value={24}>24 books (2 per month)</option>
              <option value={36}>36 books (3 per month)</option>
              <option value={50}>50 books (Challenge yourself!)</option>
              <option value={60}>60 books (Power reader!)</option>
              <option value={100}>100 books (Bookworm extraordinaire!)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-(--space-red) to-(--rose-red) text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-(--rose-red) hover:to-(--space-red) transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span>Setting up your space... ✨</span>
            ) : (
              <span>Start My Reading Journey 🚀</span>
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-warm-brown opacity-70">
            Don't worry, you can change these settings later!
          </p>
        </div>
      </div>
    </div>
  );
};

export default NameEntryModal;