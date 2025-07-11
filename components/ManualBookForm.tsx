import React, { useState } from 'react';
import { useDashboard } from '@/hooks/useDashboard';

const genres = [
  "Fiction", "Non-Fiction", "Mystery", "Romance", "Science Fiction", "Fantasy",
  "Biography", "History", "Self-Help", "Business", "Poetry", "Other"
];

const ManualBookForm: React.FC = () => {
  const { userData, refetchDashboardData, isLoading } = useDashboard();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [status, setStatus] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userData?._id) {
      setSuccessMsg("User not found. Please sign in again.");
      return;
    }
    // Prepare book data for the API
    const bookData = {
      userId: userData._id, // Pass the user's MongoDB _id
      title,
      author,
      genre, // Genre is now directly passed
      cover_url: "https://via.placeholder.com/150?text=No+Cover", // Placeholder for manual entries
      status,
    };

    try {
      const res = await fetch('/api/books', { // Call your new API route
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData),
      });

      const data = await res.json();

      if (!res.ok) {
        // Handle specific error messages from the API
        if (res.status === 409) { // Conflict for duplicates
          setSuccessMsg(data.message || "This book is already in your library.");
        } else {
          throw new Error(data.error || 'Failed to save book.');
        }
      } else {
        setSuccessMsg("Book added successfully!");
        // Clear form fields on success
        setTitle('');
        setAuthor('');
        setGenre('');
        setStatus('');
      }
    } catch (err: any) {
      console.error('Error saving book:', err);
      setSuccessMsg(err.message || "Failed to save book. Please try again.");
    }
  };

  React.useEffect(() => {
    if (successMsg) {
      const timeout = setTimeout(() => setSuccessMsg(null), 3000);
      return () => clearTimeout(timeout);
    }
  }, [successMsg]);

  return (
    <div className="glass-card rounded-3xl p-8 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
      <h2 className="text-2xl font-semibold text-space-brown mb-6 font-serif flex items-center">
        <span className="text-3xl mr-3">✍️</span>
        Add Book Manually
      </h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="bookTitle" className="block text-space-brown font-medium mb-2">Book Title *</label>
          <input
            type="text"
            id="bookTitle"
            name="title"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Enter the book title..."
            className="input-field w-full px-4 py-3 rounded-xl text-space-brown placeholder-warm-brown placeholder-opacity-60"
          />
        </div>
        <div>
          <label htmlFor="bookAuthor" className="block text-space-brown font-medium mb-2">Author *</label>
          <input
            type="text"
            id="bookAuthor"
            name="author"
            required
            value={author}
            onChange={e => setAuthor(e.target.value)}
            placeholder="Enter the author's name..."
            className="input-field w-full px-4 py-3 rounded-xl text-space-brown placeholder-warm-brown placeholder-opacity-60"
          />
        </div>
        <div>
          <label htmlFor="bookGenre" className="block text-space-brown font-medium mb-2">Genre</label>
          <select
            id="bookGenre"
            name="genre"
            value={genre}
            onChange={e => setGenre(e.target.value)}
            className="input-field w-full px-4 py-3 rounded-xl text-space-brown bg-white"
          >
            <option value="">Select a genre...</option>
            {genres.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="bookStatus" className="block text-space-brown font-medium mb-2">Reading Status *</label>
          <select
            id="bookStatus"
            name="status"
            required
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="input-field w-full px-4 py-3 rounded-xl text-space-brown bg-white"
          >
            <option value="">Select status...</option>
            <option value="wantToRead">Want to Read</option>
            <option value="reading">Currently Reading</option>
            <option value="finished">Finished</option>
          </select>
        </div>
        <div className="pt-4">
          <button
            type="submit"
            className="save-button w-full text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center space-x-2"
          >
            <span>📚</span>
            <span>Save to Library</span>
          </button>
        </div>
      </form>
      {successMsg && (
        <div className="fixed top-24 right-6 bg-gradient-to-r from-peach to-salmon text-white px-6 py-4 rounded-xl shadow-lg z-50 animate-fade-in-up">
          <div className="flex items-center space-x-2">
            <span className="text-xl">✅</span>
            <span className="font-medium">{successMsg}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManualBookForm;
