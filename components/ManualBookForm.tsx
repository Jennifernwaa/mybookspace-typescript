import React, { useState } from 'react';
import { db, auth } from "@/lib/firebase.browser";
import { collection, addDoc } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";

const genres = [
  "Fiction", "Non-Fiction", "Mystery", "Romance", "Science Fiction", "Fantasy",
  "Biography", "History", "Self-Help", "Business", "Poetry", "Other"
];

const ManualBookForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [status, setStatus] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    return () => unsub();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setSuccessMsg("Please log in to save books.");
      return;
    }
    await addDoc(
      collection(db, "users", currentUser.uid, "books"),
      {
        title,
        author,
        genre,
        cover_url: "https://via.placeholder.com/150?text=No+Cover",
        dateAdded: new Date().toISOString(),
        status,
      }
    );
    setSuccessMsg("Book added successfully!");
    setTitle('');
    setAuthor('');
    setGenre('');
    setStatus('');
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