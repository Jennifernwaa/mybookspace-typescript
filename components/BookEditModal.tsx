import React, { useState, useEffect } from "react";
import { Book, BookEditModalProps } from "@/types"
import { TabType } from "@/constants/index"

const statusOptions = [
    { value: "wantToRead", label: "Want to Read" },
    { value: "reading", label: "Currently Reading" },
    { value: "finished", label: "Finished" },
];



const BookEditModal: React.FC<BookEditModalProps> = ({
  isOpen,
  onClose,
  book,
  tab,
  onSave,
}) => {
    const [title, setTitle] = React.useState(book?.title || "");
    const [author, setAuthor] = React.useState(book?.author || "");
    const [status, setStatus] = useState<TabType>("wantToRead");
    const [progress, setProgress] = useState(0);
    const [rating, setRating] = useState(0);
    const [notes, setNotes] = useState("");
    const [dateCompleted, setDateCompleted] = useState("");
    const [isSaving, setIsSaving] = useState(false);


    useEffect(() => {
        if (book) {
            setTitle(book.title || "");
            setAuthor(book.author || "");
            setStatus(book.status as TabType || "wantToRead");
            setProgress(book.progress || 0);
            setRating(book.rating || 0);
            setNotes(book.notes || "");
            setDateCompleted(book.dateCompleted || "");
        }
    }, [book, isOpen]);

    if (!isOpen || !book) return null;

    // Star rating for finished tab 
    const renderStars = () =>
    Array.from({ length: 5 }).map((_, i) => (
        <button
        key={i}
        type="button"
        className={`star-button text-3xl ${i < rating ? "text-salmon" : "text-salmon/30"} transition-colors`}
        onClick={() => setRating(i + 1)}
        aria-label={`Set rating to ${i + 1}`}
        >
        ★
        </button>
    ));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
        const updated: Partial<Book> = {
            title,
            author,
            status,
        };
        if (tab === "reading") updated.progress = progress;
        if (tab === "finished") {
            updated.rating = rating;
            updated.notes = notes;
            updated.dateCompleted = new Date().toISOString();
        }
        await onSave(updated);
        onClose();
        } catch (err) {
        alert("Error saving book changes.");
        } finally {
        setIsSaving(false);
        }
    };


    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
                background: "rgba(255,255,255,0.2)", // light overlay
                backdropFilter: "blur(6px)",         // strong blur
                WebkitBackdropFilter: "blur(6px)",   // Safari support
            }}
            aria-modal="true"
            role="dialog"
            onClick={e => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
      <div className="bg-gradient-to-br from-cream-light to-ivory rounded-3xl p-8 max-w-md w-full shadow-2xl border border-salmon/20 relative z-10">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-space-brown font-serif mb-2">
            {tab === "wantToRead"
              ? "Edit Book"
              : tab === "reading"
              ? "Update Reading Progress"
              : "Edit Finished Book"}
          </h3>
          <p className="text-warm-brown opacity-75">
            {tab === "wantToRead"
              ? "Update your book's reading status"
              : tab === "reading"
              ? "Track your current reading progress"
              : "Update your rating and review"}
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Title */}
          <div>
            <label className="block text-warm-brown font-medium mb-2">
              Book Title
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-salmon/20 bg-white/70 focus:border-salmon focus:outline-none transition-colors"
              value={title}
              readOnly
            />
          </div>
          {/* Author */}
          <div>
            <label className="block text-warm-brown font-medium mb-2">
              Author
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-salmon/20 bg-white/70 focus:border-salmon focus:outline-none transition-colors"
              value={author}
              readOnly
            />
          </div>
          {/* Progress (for reading) */}
          {tab === "reading" && (
            <div>
              <label className="block text-warm-brown font-medium mb-2">
                Reading Progress
              </label>
              <div className="space-y-3">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={progress}
                  onChange={e => setProgress(Number(e.target.value))}
                  className="w-full h-2 bg-cream-medium rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #CB7666 ${progress}%, #E8E2D5 ${progress}%)`,
                  }}
                />
                <div className="flex justify-between text-sm text-warm-brown">
                  <span>0%</span>
                  <span className="font-semibold text-salmon">{progress}%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          )}
          {/* Rating (for finished) */}
          {tab === "finished" && (
            <div>
              <label className="block text-warm-brown font-medium mb-2">
                Your Rating
              </label>
              <div className="flex justify-center space-x-2 mb-2">{renderStars()}</div>
              <p className="text-center text-sm text-warm-brown opacity-75">
                Click to rate this book
              </p>
            </div>
          )}
          {/* Notes (for finished) */}
          {tab === "finished" && (
            <div>
              <label className="block text-warm-brown font-medium mb-2">
                Personal Notes (Optional)
              </label>
              <textarea
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-salmon/20 bg-white/70 focus:border-salmon focus:outline-none transition-colors resize-none"
                placeholder="What did you think of this book?"
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>
          )}
          {/* Status select */}
          <div>
            <label className="block text-warm-brown font-medium mb-2">
              Reading Status
            </label>
            <select
              className="w-full px-4 py-3 rounded-xl border border-salmon/20 bg-white/70 focus:border-salmon focus:outline-none transition-colors"
              value={status}
              onChange={e => setStatus(e.target.value as TabType)}
            >
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              type="button"
              className="flex-1 py-3 px-4 rounded-xl border border-warm-brown/20 text-warm-brown hover:bg-cream-medium transition-colors"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-peach to-salmon text-white font-semibold hover:from-salmon hover:to-rose-red transition-all"
              disabled={isSaving}
            >
              {isSaving
                ? "Saving..."
                : tab === "reading"
                ? "Update Progress"
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookEditModal;