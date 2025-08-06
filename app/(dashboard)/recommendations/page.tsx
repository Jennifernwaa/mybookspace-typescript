'use client';
import BookCards from '@/components/BookCards';
import { useBooks } from '@/hooks/useBooks';
import { useUser } from '@/hooks/useUser';
import { Book, OpenLibraryBook, RecommendedBook } from '@/types';
import React, { useState } from 'react';

export default function RecommendationPage () {
  const [userInput, setUserInput] = useState('');
  const [recommendations, setRecommendations] = useState<RecommendedBook[]>([]);
  const [loading, setLoading] = useState(false);

  // Assuming useUser and useBooks fetch data from your MongoDB
  const { userData, isLoading: userLoading } = useUser();
  const { books, favoriteBooks, isLoading: booksLoading } = useBooks();

  // The backend API doesn't use this, this is for future features
  const favoriteGenre = userData?.favoriteGenre || '';

  const handleRecommend = async () => {
    if (!userInput.trim()) return;
    setLoading(true);
    
    // Construct the payload to match the backend's expected structure
    const payload = {
      userInput: userInput,
      userBooks: favoriteBooks.map(b => b.title),
    };

    try {
      // 1. Fetch recommendations from the Groq API
      const groqRes = await fetch(`/api/groq`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (!groqRes.ok) {
        throw new Error(`API error: ${groqRes.status}`);
      }

      // Clean Data from Groq
      const groqData = await groqRes.json();
      const recommendationFromGroq = groqData.choices[0].message.content.trim();
      const parsedResponseRecommendation = JSON.parse(recommendationFromGroq);
      const booksFromGroq: OpenLibraryBook[] = parsedResponseRecommendation.books;
      
      // 2. Fetch cover images for each recommended book from Open Library
      const booksWithCovers = await Promise.all(
        booksFromGroq.map(async (book: OpenLibraryBook) => {
          try {
            const openLibraryRes = await fetch(
              `https://openlibrary.org/search.json?title=${encodeURIComponent(book.title)}&limit=1`
            );
            const openLibraryData = await openLibraryRes.json();
            
            const firstResult = openLibraryData.docs?.[0];
            const coverId = firstResult?.cover_i;
            
            // Construct the cover URL if a cover ID is found, otherwise use a placeholder
            const coverUrl = coverId
              ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
              : 'https://via.placeholder.com/150?text=No+Cover';
              
            return {
              ...book,
              cover_i: coverId,
              cover_url: coverUrl,
            };
          } catch (err) {
            console.error(`Error fetching cover for "${book.title}":`, err);
            // Return the original book with a placeholder cover on error
            return {
              ...book,
              cover_url: 'https://via.placeholder.com/150?text=No+Cover',
            }as RecommendedBook;
          }
        })
      );

      setRecommendations(booksWithCovers || []);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };
  
  const isDataLoading = userLoading || booksLoading;

  return (
          <main className="container mx-auto px-6 py-12">
          {/* <!-- Hero Section --> */}
          <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-5xl md:text-6xl font-bold text-space-brown leading-tight mb-4">
                  Discover Your Next 
                  <span className="text-space-red"> Great Read</span> 📖
              </h1>
              <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
                  Tell our AI about your favorite genres, authors, or books you've loved, and we'll find perfect recommendations just for you.
              </p>
          </div>

          {/* <!-- Input Section --> */}
          <div className="max-w-4xl mx-auto mb-12">
              <div className="bg-white rounded-2xl shadow-lg p-8 animate-slide-up">
                  <div className="mb-6">
                      <label htmlFor="userInput" className="block text-lg font-semibold text-space-brown mb-3">
                          What genres, authors, or books do you love? ✨
                      </label>
                      <textarea 
                          id="userInput" 
                          value={userInput}
                          onChange={(e) => setUserInput(e.target.value)}
                          className="w-full border-2 border-space-pink-dark rounded-xl p-4 text-space-brown placeholder-gray-500 focus:outline-none input-focus transition-all resize-none" 
                          rows={4}
                          placeholder="Example: I love fantasy novels like Harry Potter and Lord of the Rings, or I enjoy mystery thrillers by Agatha Christie..."
                          disabled={isDataLoading || loading} // Disable while data is loading or submitting
                      ></textarea>
                  </div>
                  
                  <div className="text-center">
                      <button 
                          id="recommendBtn" 
                          className="bg-space-red text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-opacity-90 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-space-red focus:ring-opacity-30 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={handleRecommend}
                          disabled={loading || isDataLoading || !userInput.trim()} // Disable the button when loading or input is empty
                      >
                          {loading ? (
                            <span>Getting recommendations<span className="loading-dots"></span></span>
                          ) : (
                            <span>Get My Recommendations</span>
                          )}
                      </button>
                  </div>
              </div>
          </div>

          {/* <!-- Results Section --> */}
          <div id="results" className="max-w-6xl mx-auto">
            {isDataLoading ? (
              <div className="text-center text-lg text-gray-500">Loading user data and books...</div>
            ) : (
              <BookCards books={recommendations} pageType="recommendation" />
            )}
          </div>
      </main>
  );
}
