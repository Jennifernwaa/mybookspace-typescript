import React from "react";
import { Book } from "@/types";

interface BookCardProps {
  book: Book;
  tab: "wantToRead" | "reading" | "finished";
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
  onToggleFavorite?: (book: Book) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, tab, onEdit, onDelete, onToggleFavorite }) => (
  <div className="book-card rounded-3xl p-6 shadow-lg">
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-space-brown text-xl font-serif">{book.title}</h3>
          {tab === "finished" && onToggleFavorite && (
            <button
              className={`heart-button${book.favorite ? " favorited" : ""}`}
              onClick={() => onToggleFavorite(book)}
              aria-label="Toggle favorite"
            >
              ♥︎
            </button>
          )}
        </div>
        <p className="text-warm-brown opacity-75 mb-3">by {book.author}</p>
        <span className={`status-badge ${tab === "reading" ? "reading" : tab === "finished" ? "finished" : ""} px-3 py-1 rounded-full text-sm font-medium`}>
          {tab === "reading" ? "Currently Reading" : tab === "finished" ? "Finished" : "Want to Read"}
        </span>
      </div>
      <div className="text-4xl opacity-20">
        {tab === "wantToRead" ? "📖" : tab === "reading" ? "📚" : "✅"}
      </div>
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
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={`star-rating text-lg${book.rating && i < book.rating ? " filled text-salmon" : ""}`}>★</span>
        ))}
      </div>
      <span className="text-warm-brown text-sm ml-2 opacity-75">
        {tab === "finished"
          ? book.rating
            ? book.rating.toFixed(1)
            : "Not rated"
          : tab === "reading"
          ? "In progress"
          : "Not rated"}
      </span>
    </div>
    <div className="flex gap-3">
      <button
        className="edit-button flex-1 py-2 px-4 rounded-xl font-medium text-sm"
        onClick={() => onEdit(book)}
      >
        {tab === "finished" ? "Edit Rating" : "Edit Status"}
      </button>
      <button
        className="delete-button py-2 px-4 rounded-xl font-medium text-sm"
        onClick={() => onDelete(book)}
      >
        Delete
      </button>
    </div>
  </div>
);

export default BookCard;