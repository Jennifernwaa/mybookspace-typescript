// pages/mybooks.tsx or app/mybooks/page.tsx (depending on your Next.js version)
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, query, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDn04LCckI_-sxQvHe4frnheCcvQSa6gCc",
  authDomain: "mybookspace-jennifer.firebaseapp.com",
  projectId: "mybookspace-jennifer",
  storageBucket: "mybookspace-jennifer.firebasestorage.app",
  messagingSenderId: "842011822044",
  appId: "1:842011822044:web:d801617e044c86be98f119",
  measurementId: "G-S48BPR0TDX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Types
interface Book {
  id: string;
  title: string;
  author: string;
  status: 'wantToRead' | 'reading' | 'currentlyReading' | 'finished';
  progress?: number;
  rating?: number;
  notes?: string;
  favorite?: boolean;
  dateCompleted?: string;
}

interface UserData {
  userName?: string;
}

type TabType = 'wantToRead' | 'reading' | 'finished';
type ModalType = 'wantToRead-modal' | 'reading-modal' | 'finished-modal';

// Star Rating Component
const StarRating: React.FC<{ rating: number; filled?: boolean }> = ({ rating, filled = false }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={`star-rating text-lg ${i <= rating && filled ? 'filled text-salmon' : ''}`}>
        ★
      </span>
    );
  }
  return <>{stars}</>;
};

// Status Badge Component
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  if (status === "reading" || status === "currentlyReading") {
    return <span className="status-badge reading px-3 py-1 rounded-full text-sm font-medium">Currently Reading</span>;
  }
  if (status === "finished") {
    return <span className="status-badge finished px-3 py-1 rounded-full text-sm font-medium">Finished</span>;
  }
  return <span className="status-badge px-3 py-1 rounded-full text-sm font-medium">Want to Read</span>;
};

// Book Card Component
const BookCard: React.FC<{
  book: Book;
  tab: TabType;
  onEdit: (book: Book, tab: TabType) => void;
  onDelete: (bookId: string, title: string) => void;
  onToggleFavorite: (bookId: string) => void;
}> = ({ book, tab, onEdit, onDelete, onToggleFavorite }) => {
  const getTabIcon = () => {
    switch (tab) {
      case 'wantToRead': return '📖';
      case 'reading': return '📚';
      case 'finished': return '✅';
      default: return '📖';
    }
  };

  return (
    <div className="book-card rounded-3xl p-6 shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-space-brown text-xl font-serif">{book.title}</h3>
            {tab === "finished" && (
              <button 
                className={`heart-button${book.favorite ? ' favorited' : ''}`}
                onClick={() => onToggleFavorite(book.id)}
              >
                ♥︎
              </button>
            )}
          </div>
          <p className="text-warm-brown opacity-75 mb-3">by {book.author}</p>
          <StatusBadge status={book.status} />
        </div>
        <div className="text-4xl opacity-20">{getTabIcon()}</div>
      </div>
      
      {tab === "reading" && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-warm-brown">Progress</span>
            <span className="text-salmon font-semibold">{book.progress || 0}%</span>
          </div>
          <div className="w-full bg-cream-medium rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-salmon to-rose-red h-2 rounded-full transition-all" 
              style={{ width: `${book.progress || 0}%` }}
            ></div>
          </div>
        </div>
      )}
      
      <div className="flex items-center mb-4">
        <span className="text-warm-brown text-sm mr-2">Rating:</span>
        <div className="flex">
          <StarRating rating={book.rating || 0} filled={tab === "finished"} />
        </div>
        <span className="text-warm-brown text-sm ml-2 opacity-75">
          {tab === "finished" 
            ? (book.rating ? book.rating.toFixed(1) : "Not rated")
            : tab === "reading" 
            ? "In progress" 
            : "Not rated"
          }
        </span>
      </div>
      
      <div className="flex gap-3">
        <button 
          className="edit-button flex-1 py-2 px-4 rounded-xl font-medium text-sm"
          onClick={() => onEdit(book, tab)}
        >
          {tab === "finished" ? "Edit Rating" : "Edit Status"}
        </button>
        <button 
          className="delete-button py-2 px-4 rounded-xl font-medium text-sm"
          onClick={() => onDelete(book.id, book.title)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

// Modal Components
const WantToReadModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  book: Book | null;
  onSave: (bookData: Partial<Book>) => void;
}> = ({ isOpen, onClose, book, onSave }) => {
  const [formData, setFormData] = useState({ title: '', author: '', status: 'wantToRead' as Book['status'] });

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        status: book.status || 'wantToRead'
      });
    }
  }, [book]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-cream-light to-ivory rounded-3xl p-8 max-w-md w-full shadow-2xl border border-salmon/20">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-space-brown font-serif mb-2">Edit Book</h3>
          <p className="text-warm-brown opacity-75">Update your book's reading status</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-warm-brown font-medium mb-2">Book Title</label>
            <input 
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-salmon/20 bg-white/70 focus:border-salmon focus:outline-none transition-colors" 
              placeholder="Enter book title" 
              readOnly
            />
          </div>
          
          <div>
            <label className="block text-warm-brown font-medium mb-2">Author</label>
            <input 
              type="text" 
              value={formData.author}
              onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-salmon/20 bg-white/70 focus:border-salmon focus:outline-none transition-colors" 
              placeholder="Enter author name" 
              readOnly
            />
          </div>
          
          <div>
            <label className="block text-warm-brown font-medium mb-2">Reading Status</label>
            <select 
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Book['status'] }))}
              className="w-full px-4 py-3 rounded-xl border border-salmon/20 bg-white/70 focus:border-salmon focus:outline-none transition-colors"
            >
              <option value="wantToRead">Want to Read</option>
              <option value="reading">Currently Reading</option>
              <option value="finished">Finished</option>
            </select>
          </div>
          
          <div className="flex gap-4 mt-8">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-warm-brown/20 text-warm-brown hover:bg-cream-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-peach to-salmon text-white font-semibold hover:from-salmon hover:to-rose-red transition-all"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ReadingModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  book: Book | null;
  onSave: (bookData: Partial<Book>) => void;
}> = ({ isOpen, onClose, book, onSave }) => {
  const [formData, setFormData] = useState({ 
    title: '', 
    author: '', 
    status: 'reading' as Book['status'], 
    progress: 0 
  });

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        status: book.status || 'reading',
        progress: book.progress || 0
      });
    }
  }, [book]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-cream-light to-ivory rounded-3xl p-8 max-w-md w-full shadow-2xl border border-salmon/20">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-space-brown font-serif mb-2">Update Reading Progress</h3>
          <p className="text-warm-brown opacity-75">Track your current reading progress</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-warm-brown font-medium mb-2">Book Title</label>
            <input 
              type="text" 
              value={formData.title}
              className="w-full px-4 py-3 rounded-xl border border-salmon/20 bg-white/70 focus:border-salmon focus:outline-none transition-colors" 
              readOnly
            />
          </div>
          
          <div>
            <label className="block text-warm-brown font-medium mb-2">Author</label>
            <input 
              type="text" 
              value={formData.author}
              className="w-full px-4 py-3 rounded-xl border border-salmon/20 bg-white/70 focus:border-salmon focus:outline-none transition-colors" 
              readOnly
            />
          </div>
          
          <div>
            <label className="block text-warm-brown font-medium mb-2">Reading Progress</label>
            <div className="space-y-3">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={formData.progress}
                onChange={(e) => setFormData(prev => ({ ...prev, progress: parseInt(e.target.value) }))}
                className="w-full h-2 bg-cream-medium rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #CB7666 ${formData.progress}%, #E8E2D5 ${formData.progress}%)`
                }}
              />
              <div className="flex justify-between text-sm text-warm-brown">
                <span>0%</span>
                <span className="font-semibold text-salmon">{formData.progress}%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-warm-brown font-medium mb-2">Reading Status</label>
            <select 
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Book['status'] }))}
              className="w-full px-4 py-3 rounded-xl border border-salmon/20 bg-white/70 focus:border-salmon focus:outline-none transition-colors"
            >
              <option value="wantToRead">Want to Read</option>
              <option value="reading">Currently Reading</option>
              <option value="finished">Finished</option>
            </select>
          </div>
          
          <div className="flex gap-4 mt-8">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-warm-brown/20 text-warm-brown hover:bg-cream-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-peach to-salmon text-white font-semibold hover:from-salmon hover:to-rose-red transition-all"
            >
              Update Progress
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const FinishedModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  book: Book | null;
  onSave: (bookData: Partial<Book>) => void;
}> = ({ isOpen, onClose, book, onSave }) => {
  const [formData, setFormData] = useState({ 
    title: '', 
    author: '', 
    status: 'finished' as Book['status'], 
    rating: 0,
    notes: ''
  });

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        status: book.status || 'finished',
        rating: book.rating || 0,
        notes: book.notes || ''
      });
    }
  }, [book]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      dateCompleted: new Date().toISOString()
    });
  };

  const setRating = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-cream-light to-ivory rounded-3xl p-8 max-w-md w-full shadow-2xl border border-salmon/20">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-space-brown font-serif mb-2">Edit Finished Book</h3>
          <p className="text-warm-brown opacity-75">Update your rating and review</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-warm-brown font-medium mb-2">Book Title</label>
            <input 
              type="text" 
              value={formData.title}
              className="w-full px-4 py-3 rounded-xl border border-salmon/20 bg-white/70 focus:border-salmon focus:outline-none transition-colors" 
              readOnly
            />
          </div>
          
          <div>
            <label className="block text-warm-brown font-medium mb-2">Author</label>
            <input 
              type="text" 
              value={formData.author}
              className="w-full px-4 py-3 rounded-xl border border-salmon/20 bg-white/70 focus:border-salmon focus:outline-none transition-colors" 
              readOnly
            />
          </div>
          
          <div>
            <label className="block text-warm-brown font-medium mb-2">Your Rating</label>
            <div className="flex justify-center space-x-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button 
                  key={star}
                  type="button" 
                  className={`text-3xl transition-colors ${
                    star <= formData.rating ? 'text-salmon' : 'text-salmon/30'
                  } hover:text-salmon`}
                  onClick={() => setRating(star)}
                >
                  ★
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-warm-brown opacity-75">Click to rate this book</p>
          </div>
          
          <div>
            <label className="block text-warm-brown font-medium mb-2">Reading Status</label>
            <select 
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Book['status'] }))}
              className="w-full px-4 py-3 rounded-xl border border-salmon/20 bg-white/70 focus:border-salmon focus:outline-none transition-colors"
            >
              <option value="wantToRead">Want to Read</option>
              <option value="reading">Currently Reading</option>
              <option value="finished">Finished</option>
            </select>
          </div>
          
          <div>
            <label className="block text-warm-brown font-medium mb-2">Personal Notes (Optional)</label>
            <textarea 
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-salmon/20 bg-white/70 focus:border-salmon focus:outline-none transition-colors resize-none" 
              placeholder="What did you think of this book?"
            />
          </div>
          
          <div className="flex gap-4 mt-8">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-warm-brown/20 text-warm-brown hover:bg-cream-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-peach to-salmon text-white font-semibold hover:from-salmon hover:to-rose-red transition-all"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Component
const MyBooks: React.FC = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string>('Reader');
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('wantToRead');
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [wantToReadModal, setWantToReadModal] = useState({ isOpen: false, book: null as Book | null });
  const [readingModal, setReadingModal] = useState({ isOpen: false, book: null as Book | null });
  const [finishedModal, setFinishedModal] = useState({ isOpen: false, book: null as Book | null });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/');
        return;
      }
      
      setCurrentUser(user);
      
      // Fetch user data
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data() as UserData;
      setUserName(userData?.userName || 'Reader');

      // Fetch books
      const booksQuery = query(collection(db, "users", user.uid, "books"));
      const booksSnapshot = await getDocs(booksQuery);
      const books: Book[] = [];
      booksSnapshot.forEach(docSnap => {
        books.push({ id: docSnap.id, ...docSnap.data() } as Book);
      });
      setAllBooks(books);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleEditBook = (book: Book, tab: TabType) => {
    switch (tab) {
      case 'wantToRead':
        setWantToReadModal({ isOpen: true, book });
        break;
      case 'reading':
        setReadingModal({ isOpen: true, book });
        break;
      case 'finished':
        setFinishedModal({ isOpen: true, book });
        break;
    }
  };

  const handleDeleteBook = async (bookId: string, title: string) => {
    if (!currentUser) return;
    
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteDoc(doc(db, "users", currentUser.uid, "books", bookId));
        setAllBooks(prev => prev.filter(book => book.id !== bookId));
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };

  const handleToggleFavorite = async (bookId: string) => {
    if (!currentUser) return;
    
    const bookIndex = allBooks.findIndex(b => b.id === bookId);
    if (bookIndex === -1) return;

    const newFavorite = !allBooks[bookIndex].favorite;
    
    try {
      const bookRef = doc(db, "users", currentUser.uid, "books", bookId);
      await updateDoc(bookRef, { favorite: newFavorite });
      
      setAllBooks(prev => {
        const updated = [...prev];
        updated[bookIndex] = { ...updated[bookIndex], favorite: newFavorite };
        return updated;
      });
    } catch (error) {
      console.error('Error updating favorite:', error);
    }
  };

  const handleSaveBook = async (bookData: Partial<Book>, modalType: 'wantToRead' | 'reading' | 'finished') => {
    if (!currentUser) return;

    const currentBook = modalType === 'wantToRead' ? wantToReadModal.book :
                      modalType === 'reading' ? readingModal.book :
                      finishedModal.book;
    
    if (!currentBook) return;

    try {
      const bookRef = doc(db, "users", currentUser.uid, "books", currentBook.id);
      await updateDoc(bookRef, bookData);
      
      setAllBooks(prev => {
        const updated = [...prev];
        const index = updated.findIndex(b => b.id === currentBook.id);
        if (index !== -1) {
          updated[index] = { ...updated[index], ...bookData };
        }
        return updated;
      });

      // Close modal
      switch (modalType) {
        case 'wantToRead':
          setWantToReadModal({ isOpen: false, book: null });
          break;
        case 'reading':
          setReadingModal({ isOpen: false, book: null });
          break;
        case 'finished':
          setFinishedModal({ isOpen: false, book: null });
          break;
      }
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  // Filter books by status
  const wantToReadBooks = allBooks.filter(b => b.status === "wantToRead");
  const readingBooks = allBooks.filter(b => b.status === "reading" || b.status === "currentlyReading");
  const finishedBooks = allBooks.filter(b => b.status === "finished");

  const getTabCounts = () => ({
    wantToRead: wantToReadBooks.length,
    reading: readingBooks.length,
    finished: finishedBooks.length
  });

  const tabCounts = getTabCounts();

  const renderBooksGrid = (books: Book[], tab: TabType) => {
    if (books.length === 0) {
      return (
        <div className="col-span-full text-center py-12 text-warm-brown opacity-70">
          {tab === 'wantToRead' ? 'No books in your Want to Read list.' :
           tab === 'reading' ? 'No books currently being read.' :
           'No finished books yet.'}
        </div>
      );
    }

    return books.map(book => (
      <BookCard
        key={book.id}
        book={book}
        tab={tab}
        onEdit={handleEditBook}
        onDelete={handleDeleteBook}
        onToggleFavorite={handleToggleFavorite}
      />
    ));
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>My Books - My Book Space</title>
        <meta name="description" content="Manage your book collection - My Book Space" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="min-h-screen" style={{
        fontFamily: 'Poppins, sans-serif',
        background: 'linear-gradient(135deg, #F7F5F0 0%, #F1ECE4 25%, #E8E2D5 60%, #c8a287 100%)'
      }}>
        {/* Floating Background Books */}
        <div className="floating-book floating-book-1 text-6xl">📚</div>
        <div className="floating-book floating-book-2 text-5xl">📖</div>
        <div className="floating-book floating-book-3 text-4xl">📝</div>