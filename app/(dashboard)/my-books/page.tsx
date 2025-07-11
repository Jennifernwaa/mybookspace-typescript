'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BookEditModal from '@/components/BookEditModal';
import MyBooksTabs from '@/components/MyBooksTabs';
import { Book } from '@/types';
import { TabType } from '@/constants';
import { useDashboard } from '@/hooks/useDashboard';

const MyBooksPage: React.FC = () => {
  const router = useRouter();
  const {
    userData,
    allBooks,
    refetchDashboardData,
    isLoading,
  } = useDashboard();

  const userId = userData?._id;
  const [activeTab, setActiveTab] = useState<TabType>('wantToRead');
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDelete = async (book: Book) => {
    if (!userId || !confirm(`Are you sure you want to delete "${book.title}"?`)) return;

    try {
      const res = await fetch(`/api/books/${book._id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      let data;
        try {
          data = await res.json();
        } catch {
          throw new Error('No response body received.');
        }
        if (!res.ok) throw new Error(data?.error || 'Update failed.');

      await refetchDashboardData();
      setSuccessMsg(data.message || 'Book deleted successfully!');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message);
    }
  };

  const handleToggleFavorite = async (book: Book) => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/books/${book._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ favorite: !book.favorite })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await refetchDashboardData();
      setSuccessMsg(data.message || 'Favorite status updated!');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message);
    }
  };

  const handleSaveEdit = async (updated: Partial<Book>) => {
    if (!userId || !editingBook) return;
    try {
      const res = await fetch(`/api/books/${editingBook._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...updated })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await refetchDashboardData(); // useDashboard hook method
      setEditingBook(null);
      setSuccessMsg(data.message || 'Book updated successfully!');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message);
    }
  };


  useEffect(() => {
    const timeout = setTimeout(() => {
      setSuccessMsg(null);
      setErrorMsg(null);
    }, successMsg ? 3000 : 5000);
    return () => clearTimeout(timeout);
  }, [successMsg, errorMsg]);

  if (!userId) {
    return <p className="text-center py-8 text-warm-brown">User not found. Please sign in again.</p>;
  }

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

      {isLoading && <p className="text-center py-8 text-warm-brown">Loading your books...</p>}

      {!isLoading && allBooks.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📚</div>
          <p className="text-warm-brown">You haven't added any books yet. Start by searching or adding manually!</p>
        </div>
      )}

      {!isLoading && allBooks.length > 0 && (
        <MyBooksTabs
          books={allBooks}
          onEdit={setEditingBook}
          onDelete={handleDelete}
          onToggleFavorite={handleToggleFavorite}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}

      <div className="text-center mt-16">
        <button
          className="bg-gradient-to-r from-peach to-salmon text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-salmon hover:to-rose-red transition-all transform hover:scale-105 shadow-lg"
          onClick={() => router.push('/add-books')}
        >
          <span className="mr-2">➕</span>Add New Book
        </button>
      </div>

      {successMsg && (
        <div className="fixed top-24 right-6 bg-gradient-to-r from-peach to-salmon text-white px-6 py-4 rounded-xl shadow-lg z-50 animate-fade-in-up">
          <div className="flex items-center space-x-2">
            <span className="text-xl">✅</span>
            <span className="font-medium">{successMsg}</span>
          </div>
        </div>
      )}

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
          tab={activeTab}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

export default MyBooksPage;
