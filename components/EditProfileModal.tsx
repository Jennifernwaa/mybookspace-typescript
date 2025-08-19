'use client';
import React, { useState, useEffect } from 'react';

interface EditProfileModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (data: {
    userName: string;
    bio: string;
    favoriteGenre: string;
    readingGoal: number;
    favoriteAuthor: string;
    publicReadingList: boolean;
    showProgress: boolean;
    friendRecs: boolean;
  }) => Promise<void>;
  userData: any;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isVisible, onClose, onSubmit, userData }) => {
  const [userName, setuserName] = useState('');
  const [bio, setBio] = useState('');
  const [favoriteGenre, setFavoriteGenre] = useState('fantasy');
  const [readingGoal, setReadingGoal] = useState(60);
  const [favoriteAuthor, setFavoriteAuthor] = useState('');
  const [publicReadingList, setPublicReadingList] = useState(true);
  const [showProgress, setShowProgress] = useState(true);
  const [friendRecs, setFriendRecs] = useState(true);
  const [errors, setErrors] = useState<{ userName?: boolean }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Effect to update CSS classes when isVisible changes
  useEffect(() => {
    const modalElement = document.getElementById('editProfileModal');
    const modalContentElement = document.getElementById('modalContent');
    if (modalElement && modalContentElement) {
      if (isVisible) {
        modalElement.classList.remove('opacity-0', 'pointer-events-none');
        modalElement.classList.add('opacity-100', 'pointer-events-auto');
        modalContentElement.classList.remove('scale-95');
        modalContentElement.classList.add('scale-100');
      } else {
        modalElement.classList.remove('opacity-100', 'pointer-events-auto');
        modalElement.classList.add('opacity-0', 'pointer-events-none');
        modalContentElement.classList.remove('scale-100');
        modalContentElement.classList.add('scale-95');
      }
    }
  }, [isVisible]);

  useEffect(() => {
    if (isVisible && userData) {
      setuserName(userData.userName || '');
      setBio(userData.bio || '');
      setFavoriteGenre(userData.favoriteGenre || 'fantasy');
      setReadingGoal(userData.readingGoal || 60);
      setFavoriteAuthor(userData.favoriteAuthor || '');
      setPublicReadingList(userData.publicReadingList ?? true);
      setShowProgress(userData.showProgress ?? true);
      setFriendRecs(userData.friendRecs ?? true);
    }
  }, [isVisible, userData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSubmit({
        userName: userName,
        bio,
        favoriteGenre,
        readingGoal,
        favoriteAuthor,
        publicReadingList,
        showProgress,
        friendRecs,
      });
      onClose();
    } catch (error) {
      console.error('Error submitting profile data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="editProfileModal"
      className={`fixed inset-0 bg-black bg-opacity-30 backdrop-blur-md flex items-center justify-center z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        className={`bg-white rounded-3xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto transform transition-all duration-300 ${
          isVisible ? 'scale-100' : 'scale-95'
        }`}
        id="modalContent"
      >

       {/* Modal Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-space-brown font-serif">Edit Profile</h2>
          <button
            id="closeModal"
            className="text-warm-brown hover:text-space-red transition-colors p-2 rounded-full hover:bg-cream-light"
            onClick={onClose}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Profile Picture Section */}
        <div className="text-center mb-8">
            <div className="relative inline-block">
                <div className="profile-avatar w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-4xl">👤</span>
                </div>
                <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-space-red rounded-full flex items-center justify-center shadow-lg hover:bg-opacity-90 transition-colors">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                </button>
            </div>
            <p className="text-warm-brown text-sm">Click the camera icon to change your profile picture</p>
        </div>

        {/* */}
        <form id="editProfileForm" className="space-y-6" onSubmit={handleSubmit}>
          {/* */}
          <div>
            <label className="block text-space-brown font-semibold mb-2">userName</label>
            <input
              type="text"
              id="userNameModal"
              className="w-full px-4 py-3 rounded-2xl border-2 border-cream-medium focus:border-salmon focus:outline-none transition-colors bg-cream-light"
              value={userName}
              onChange={(e) => {
                setuserName(e.target.value);
                if (errors.userName) setErrors((prev) => ({ ...prev, userName: false }));
              }}
            />
          </div>

          {/* */}
          <div>
            <label className="block text-space-brown font-semibold mb-2">About Me</label>
            <textarea
              id="bioModal"
              rows={4}
              className="w-full px-4 py-3 rounded-2xl border-2 border-cream-medium focus:border-salmon focus:outline-none transition-colors bg-cream-light resize-none"
              placeholder="Tell us about yourself and your reading interests..."
              value={bio}
              onChange={(e) => {
                setBio(e.target.value);
                const charCount = e.target.value.length;
                document.getElementById('charCount')!.textContent = charCount.toString();
              }}
            ></textarea>
            <div className="text-right text-sm text-warm-brown opacity-75 mt-1">
              <span id="charCount">0</span>/300
            </div>
          </div>

          {/* */}
          <div>
            <label className="block text-space-brown font-semibold mb-2">Favorite Genre</label>
            <select
              id="favoriteGenreModal"
              className="w-full px-4 py-3 rounded-2xl border-2 border-cream-medium focus:border-salmon focus:outline-none transition-colors bg-cream-light"
              value={favoriteGenre}
              onChange={(e) => setFavoriteGenre(e.target.value)}
            >
              <option value="fantasy">✨ Fantasy & Sci-Fi</option>
              <option value="mystery">🔍 Mystery & Thriller</option>
              <option value="romance">💕 Romance</option>
              <option value="literary">📚 Literary Fiction</option>
              <option value="nonfiction">📖 Non-Fiction</option>
              <option value="biography">👤 Biography & Memoir</option>
              <option value="history">🏛️ History</option>
              <option value="young-adult">🌟 Young Adult</option>
              <option value="horror">👻 Horror</option>
              <option value="poetry">🎭 Poetry</option>
            </select>
          </div>

          {/* */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-space-brown font-semibold mb-2">2025 Reading Goal</label>
              <input
                type="number"
                id="readingGoalModal"
                min="1"
                max="365"
                className="w-full px-4 py-3 rounded-2xl border-2 border-cream-medium focus:border-salmon focus:outline-none transition-colors bg-cream-light"
                value={readingGoal}
                onChange={(e) => setReadingGoal(parseInt(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-space-brown font-semibold mb-2">Favorite Author</label>
              <input
                type="text"
                id="favoriteAuthorModal"
                className="w-full px-4 py-3 rounded-2xl border-2 border-cream-medium focus:border-salmon focus:outline-none transition-colors bg-cream-light"
                value={favoriteAuthor}
                onChange={(e) => setFavoriteAuthor(e.target.value)}
                placeholder="Enter your favorite author's name..."
              />
            </div>
          </div>

          {/* */}
          <div className="bg-gradient-to-r from-cream-light to-ivory rounded-2xl p-6">
            <h3 className="text-space-brown font-semibold mb-4 font-serif">Privacy Settings</h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <span className="text-warm-brown">Public Reading List</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    id="publicReadingList"
                    checked={publicReadingList} // Bind checked state
                    onChange={(e) => setPublicReadingList(e.target.checked)} // Add onChange
                    className="sr-only"
                  />
                  <div
                    className={`toggle-bg w-12 h-6 rounded-full cursor-pointer transition-colors ${
                      publicReadingList ? 'bg-salmon' : 'bg-cream-medium'
                    }`}
                  >
                    <div
                      className={`toggle-dot w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                        publicReadingList ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    ></div>
                  </div>
                </div>
              </label>
              <label className="flex items-center justify-between">
                <span className="text-warm-brown">Show Reading Progress</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    id="showProgress"
                    checked={showProgress} // Bind checked state
                    onChange={(e) => setShowProgress(e.target.checked)} // Add onChange
                    className="sr-only"
                  />
                  <div
                    className={`toggle-bg w-12 h-6 rounded-full cursor-pointer transition-colors ${
                      showProgress ? 'bg-salmon' : 'bg-cream-medium'
                    }`}
                  >
                    <div
                      className={`toggle-dot w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                        showProgress ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    ></div>
                  </div>
                </div>
              </label>
              <label className="flex items-center justify-between">
                <span className="text-warm-brown">Friend Recommendations</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    id="friendRecs"
                    checked={friendRecs} // Bind checked state
                    onChange={(e) => setFriendRecs(e.target.checked)} // Add onChange
                    className="sr-only"
                  />
                  <div
                    className={`toggle-bg w-12 h-6 rounded-full cursor-pointer transition-colors ${
                      friendRecs ? 'bg-salmon' : 'bg-cream-medium'
                    }`}
                  >
                    <div
                      className={`toggle-dot w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                        friendRecs ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    ></div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-space-red text-white px-8 py-4 rounded-full font-semibold hover:bg-opacity-90 transition-all transform hover:scale-105 shadow-lg animate-glow"
            >
              Save Changes
            </button>
            <button
              type="button"
              id="cancelEdit"
              className="flex-1 bg-white text-space-red px-8 py-4 rounded-full font-semibold border-2 border-space-red hover:bg-cream-light transition-all transform hover:scale-105 shadow-lg"
              onClick={onClose} // Add onClick handler
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};