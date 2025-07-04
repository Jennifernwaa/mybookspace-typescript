'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, doc, getDocs, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase.browser";
import { Book } from "@/types";
import BookEditModal from "@/components/BookEditModal";
import MyBooksTabs from "@/components/MyBooksTabs";

const MyBooksPage: React.FC = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [activeTab, setActiveTab] = useState("wantToRead");
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setCurrentUser(user);
      else router.push("/sign-in");
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!currentUser) return;
    const fetchBooks = async () => {
      const q = collection(db, "users", currentUser.uid, "books");
      const snapshot = await getDocs(q);
      const booksArr: Book[] = [];
      snapshot.forEach((docSnap) => {
        booksArr.push({ id: docSnap.id, ...docSnap.data() } as Book);
      });
      setBooks(booksArr);
    };
    fetchBooks();
  }, [currentUser]);

  const handleEdit = (book: Book) => {
    setEditingBook(book);
  };

  const handleDelete = async (book: Book) => {
    if (!currentUser) return;
    if (!confirm(`Are you sure you want to delete "${book.title}"?`)) return;
    await deleteDoc(doc(db, "users", currentUser.uid, "books", book.id));
    setBooks((prev) => prev.filter((b) => b.id !== book.id));
  };

  const handleToggleFavorite = async (book: Book) => {
    if (!currentUser) return;
    const newFavorite = !book.favorite;
    await updateDoc(doc(db, "users", currentUser.uid, "books", book.id), {
      favorite: newFavorite,
    });
    setBooks((prev) =>
      prev.map((b) => (b.id === book.id ? { ...b, favorite: newFavorite } : b))
    );
  };

  const handleSaveEdit = async (updated: Partial<Book>) => {
    if (!currentUser || !editingBook) return;
    await updateDoc(doc(db, "users", currentUser.uid, "books", editingBook.id), updated);
    setBooks((prev) =>
      prev.map((b) =>
        b.id === editingBook.id ? { ...b, ...updated } : b
      )
    );
    setEditingBook(null);
  };

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
      <MyBooksTabs
        books={books}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleFavorite={handleToggleFavorite}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className="text-center mt-16">
        <button
          className="bg-gradient-to-r from-peach to-salmon text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-salmon hover:to-rose-red transition-all transform hover:scale-105 shadow-lg"
          onClick={() => router.push("/add-books")}
        >
          <span className="mr-2">➕</span>Add New Book
        </button>
      </div>
      {editingBook && (
        <BookEditModal
          isOpen={!!editingBook}
          onClose={() => setEditingBook(null)}
          book={editingBook}
          tab={activeTab as "wantToRead" | "reading" | "finished"}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

export default MyBooksPage;