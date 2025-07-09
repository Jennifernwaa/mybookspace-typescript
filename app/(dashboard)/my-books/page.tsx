'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import BookEditModal from "@/components/BookEditModal";
import MyBooksTabs from "@/components/MyBooksTabs";
import { Book } from "@/types"; 
import { TabType } from "@/constants"; // Correctly imported TabType

const MyBooksPage: React.FC = () => {
  const router = useRouter();
  // We'll get userId from localStorage. In a production app, consider a more secure
  // authentication method like JWTs stored in http-only cookies or NextAuth.js.
  const [userId, setUserId] = useState<string | null>(null); 
  const [books, setBooks] = useState<Book[]>([]);
  // FIX: Use the imported TabType for the activeTab state
  const [activeTab, setActiveTab] = useState<TabType>("wantToRead"); 
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Add loading state

  // Effect to get userId from localStorage and redirect if not found
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId'); // Assuming userId is stored here after login
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      // If no userId, redirect to sign-in. You might want a more robust auth check here.
      router.push("/sign-in");
    }
  }, [router]);

  // Effect to fetch books when userId is available
  useEffect(() => {
    if (!userId) return; // Only fetch if userId is set

    const fetchBooks = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        // Fetch books from your Next.js API route
        // The /api/books route should filter by userId based on the query parameter
        const res = await fetch(`/api/books?userId=${userId}`, { 
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // IMPORTANT: If your /api/books GET route requires authentication (e.g., checking a JWT token),
            // you should include an Authorization header here. Example:
            // 'Authorization': `Bearer ${localStorage.getItem('token')}` 
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to fetch books.');
        }

        const data = await res.json();
        // Assuming the API returns an object with a 'books' array, e.g., { books: [...] }
        setBooks(data.books || []); 
      } catch (err: any) {
        console.error('Error fetching books:', err);
        setErrorMsg(err.message || "Failed to load books. Please try again.");
        setBooks([]); // Clear books on error
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [userId]); // Re-fetch when userId changes

  // Handle edit button click
  const handleEdit = (book: Book) => {
    setEditingBook(book);
  };

  // Handle delete book
  const handleDelete = async (book: Book) => {
    if (!userId) {
      setErrorMsg("Please log in to delete books.");
      return;
    }
    // FIX: Consider replacing `confirm` with a custom modal for better UX and consistency
    if (!confirm(`Are you sure you want to delete "${book.title}"?`)) return; 

    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      // Call your DELETE API route for a specific book
      const res = await fetch(`/api/books/${book._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // IMPORTANT: Include Authorization header if your API requires it
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        // It's good practice to send userId in the body for server-side authorization checks
        body: JSON.stringify({ userId: userId }), 
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete book.');
      }

      setBooks((prev) => prev.filter((b) => b._id !== book._id));
      setSuccessMsg(data.message || "Book deleted successfully!");
    } catch (err: any) {
      console.error('Error deleting book:', err);
      setErrorMsg(err.message || "Failed to delete book. Please try again.");
    }
  };

  // Handle toggle favorite status
  const handleToggleFavorite = async (book: Book) => {
    if (!userId) {
      setErrorMsg("Please log in to update books.");
      return;
    }

    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const newFavorite = !book.favorite;
      // Call your PATCH API route for partial updates
      const res = await fetch(`/api/books/${book._id}`, {
        method: 'PATCH', 
        headers: {
          'Content-Type': 'application/json',
          // IMPORTANT: Include Authorization header if your API requires it
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ favorite: newFavorite, userId: userId }), // Send userId for authorization
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update favorite status.');
      }

      setBooks((prev) =>
        prev.map((b) => (b._id === book._id ? { ...b, favorite: newFavorite } : b))
      );
      setSuccessMsg(data.message || "Favorite status updated!");
    } catch (err: any) {
      console.error('Error toggling favorite:', err);
      setErrorMsg(err.message || "Failed to update favorite status. Please try again.");
    }
  };

  // Handle saving edited book details
  const handleSaveEdit = async (updated: Partial<Book>) => {
    if (!userId || !editingBook) {
      setErrorMsg("Authentication required or no book selected for editing.");
      return;
    }

    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      // Call your PATCH API route for partial updates
      const res = await fetch(`/api/books/${editingBook._id}`, {
        method: 'PATCH', 
        headers: {
          'Content-Type': 'application/json',
          // IMPORTANT: Include Authorization header if your API requires it
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ ...updated, userId: userId }), // Send userId for authorization
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save book edits.');
      }

      setBooks((prev) =>
        prev.map((b) =>
          b._id === editingBook._id ? { ...b, ...updated } : b
        )
      );
      setEditingBook(null); // Close modal
      setSuccessMsg(data.message || "Book updated successfully!");
    } catch (err: any) {
      console.error('Error saving edit:', err);
      setErrorMsg(err.message || "Failed to save book edits. Please try again.");
    }
  };

  // Success/Error message timeout
  useEffect(() => {
    if (successMsg) {
      const timeout = setTimeout(() => setSuccessMsg(null), 3000);
      return () => clearTimeout(timeout);
    }
    if (errorMsg) {
      const timeout = setTimeout(() => setErrorMsg(null), 5000); // Longer for errors
      return () => clearTimeout(timeout);
    }
  }, [successMsg, errorMsg]);

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="text-center mb-12 animate-fade-in-up">
        <h1 className="text-4xl md:text-5xl font-bold text-space-brown mb-4 font-serif">
          My Book Collection
        </h1>
        <p className="text-warm-brown text-lg opacity-90 max-w-2xl mx-auto">
          Organize and track your reading journey. From wishlist to finished reads.
        </p>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-warm-brown">Loading your books...</p>
        </div>
      )}

      {!loading && books.length === 0 && !errorMsg && (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📚</div>
          <p className="text-warm-brown">You haven't added any books yet. Start by searching or adding manually!</p>
        </div>
      )}

      {!loading && books.length > 0 && (
        <MyBooksTabs
          books={books}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleFavorite={handleToggleFavorite}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}
      
      <div className="text-center mt-16">
        <button
          className="bg-gradient-to-r from-peach to-salmon text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-salmon hover:to-rose-red transition-all transform hover:scale-105 shadow-lg"
          onClick={() => router.push("/add-books")}
        >
          <span className="mr-2">➕</span>Add New Book
        </button>
      </div>

      {/* Success Message */}
      {successMsg && (
        <div className="fixed top-24 right-6 bg-gradient-to-r from-peach to-salmon text-white px-6 py-4 rounded-xl shadow-lg z-50 animate-fade-in-up">
          <div className="flex items-center space-x-2">
            <span className="text-xl">✅</span>
            <span className="font-medium">{successMsg}</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMsg && (
        <div className="fixed top-24 right-6 bg-red-500 text-white px-6 py-4 rounded-xl shadow-lg z-50 animate-fade-in-up">
          <div className="flex items-center space-x-2">
            <span className="text-xl">❌</span>
            <span className="font-medium">{errorMsg}</span>
          </div>
        </div>
      )}

      {editingBook && (
        <BookEditModal
          isOpen={!!editingBook}
          onClose={() => setEditingBook(null)}
          book={editingBook}
          tab={activeTab} // Pass activeTab directly as it's already typed
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

export default MyBooksPage;
