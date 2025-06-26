'use client';
import React, { useState } from "react";
import { db, auth } from "@/lib/firebase.browser";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";

interface BookResult {
  key: string;
  title: string;
  author_name?: string[];
  publisher?: string[];
  first_publish_year?: number;
  isbn?: string[];
  cover_i?: number;
  subject?: string[];
  number_of_pages_median?: number;
  language?: string[];
}

const getCoverUrl = (book: BookResult) => {
  if (book.isbn && book.isbn[0]) {
    return `https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-M.jpg?default=false`;
  }
  if (book.cover_i) {
    return `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg?default=false`;
  }
  return "https://via.placeholder.com/80x120?text=No+Cover";
};

const SearchBook: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<BookResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Listen for auth state
  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsub();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setNoResults(false);
    setResults([]);
    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(searchQuery.trim())}`
      );
      const data = await res.json();
      if (!data.docs || data.docs.length === 0) {
        setNoResults(true);
        setResults([]);
      } else {
        setResults(data.docs.slice(0, 10));
      }
    } catch (err) {
      setNoResults(true);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  // Save book to Firestore, checking for duplicates
  const saveBookToFirestore = async (book: BookResult) => {
    if (!currentUser) {
      setSuccessMsg("Please log in to save books.");
      return;
    }
    const isbn = book.isbn?.[0] || "Not available";
    const booksRef = collection(db, "users", currentUser.uid, "books");
    let exists = false;

    // Check for duplicate by ISBN or title
    const q = isbn !== "Not available"
      ? query(booksRef, where("isbn", "==", isbn))
      : query(booksRef, where("title", "==", book.title));
    const querySnapshot = await getDocs(q);
    exists = !querySnapshot.empty;

    if (exists) {
      setSuccessMsg("This book is already in your library.");
      return;
    }

    // Compose book data
    const cover_url = getCoverUrl(book);
    const bookData = {
      title: book.title,
      author: book.author_name?.[0] || "Unknown",
      first_publish_year: book.first_publish_year || "Unknown",
      isbn,
      cover_url,
      publisher: book.publisher?.[0] || "Unknown",
      pages: book.number_of_pages_median || "Unknown",
      language: book.language?.[0] || "Unknown",
      dateAdded: new Date().toISOString(),
      status: "wantToRead",
    };

    await addDoc(booksRef, bookData);
    setSuccessMsg("Book added successfully!");
  };

  // Success message timeout
  React.useEffect(() => {
    if (successMsg) {
      const timeout = setTimeout(() => setSuccessMsg(null), 3000);
      return () => clearTimeout(timeout);
    }
  }, [successMsg]);

  return (
    <div className="search-card rounded-3xl p-8 mb-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
      <h2 className="text-2xl font-semibold text-space-brown mb-6 font-serif flex items-center">
        <span className="text-3xl mr-3">🔍</span>
        Search for a Book
      </h2>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="Enter book title..."
          className="input-field flex-1 px-4 py-3 rounded-xl text-space-brown placeholder-warm-brown placeholder-opacity-60"
        />
        <button
          onClick={handleSearch}
          className="search-button text-white px-8 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 min-w-[120px]"
        >
          <span>Search</span>
        </button>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-warm-brown">Searching for books...</p>
        </div>
      )}

      {noResults && !loading && (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">😔</div>
          <p className="text-warm-brown">No books found. Try a different search or add manually below.</p>
        </div>
      )}

      {results.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-space-brown mb-4">Search Results:</h3>
          <div className="space-y-4">
            {results.map(book => (
              <div
                key={book.key}
                className="result-card rounded-2xl p-6 flex items-center space-x-4 cursor-pointer hover:shadow-lg transition-all"
              >
                <div className="w-16 h-20 bg-gradient-to-br from-peach to-salmon rounded-lg flex items-center justify-center text-white text-2xl shadow-lg overflow-hidden">
                  <img
                    src={getCoverUrl(book)}
                    alt={`Cover for ${book.title}`}
                    style={{ maxHeight: "100%", maxWidth: "100%" }}
                    onError={e => {
                      (e.target as HTMLImageElement).src = "https://via.placeholder.com/80x120?text=No+Cover";
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-space-brown text-lg">{book.title}</h4>
                  <p className="text-warm-brown opacity-75">
                    by {book.author_name?.[0] || "Unknown"}
                  </p>
                  <p className="text-sm text-warm-brown opacity-60 mt-1">
                    Publisher: {book.publisher?.[0] || "Unknown"}
                  </p>
                  <p className="text-sm text-warm-brown opacity-60 mt-1">
                    First published: {book.first_publish_year || "Unknown"}
                  </p>
                  <p className="text-sm text-warm-brown opacity-60 mt-1">
                    ISBN: {book.isbn?.[0] || "Not available"}
                  </p>
                </div>
                <button
                  className="save-button text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
                  onClick={async event => {
                    event.stopPropagation();
                    await saveBookToFirestore(book);
                  }}
                >
                  Save Book
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Success Message */}
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

export default SearchBook;