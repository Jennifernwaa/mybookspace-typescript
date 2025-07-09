import React from "react";
import { Book } from "@/types";
import BookCard from "./BookCard";
import { TabType } from "@/constants";

interface MyBooksTabsProps {
  books: Book[];
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
  onToggleFavorite: (book: Book) => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}


const tabLabels: Array<{ key: TabType; label: string; icon: string }> = [
  { key: "wantToRead", label: "Want to Read", icon: "📖" },
  { key: "reading", label: "Currently Reading", icon: "📚" },
  { key: "finished", label: "Finished", icon: "✅" },
];


const MyBooksTabs: React.FC<MyBooksTabsProps> = ({
  books,
  onEdit,
  onDelete,
  onToggleFavorite,
  activeTab,
  setActiveTab,
}) => {
  const filteredBooks = books.filter((b) =>
    activeTab === "wantToRead"
      ? b.status === "wantToRead"
      : activeTab === "reading"
      ? b.status === "reading"
      : b.status === "finished"
  );

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
        {tabLabels.map((tab) => (
          <button
            key={tab.key}
            className={`tab-button px-8 py-4 rounded-2xl font-semibold text-lg transition-all ${
              activeTab === tab.key ? "active" : ""
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
            <span className={`ml-2 rounded-full px-2 py-1 text-sm ${
              activeTab === tab.key
                ? "bg-white bg-opacity-30 text-black"
                : "bg-white bg-opacity-30"
            }`}>
              {books.filter((b) =>
                tab.key === "wantToRead"
                  ? b.status === "wantToRead"
                  : tab.key === "reading"
                  ? b.status === "reading"
                  : b.status === "finished"
              ).length}
            </span>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredBooks.length ? (
          filteredBooks.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              tab={activeTab as any}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleFavorite={onToggleFavorite}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-warm-brown opacity-70">
            No books in this list.
          </div>
        )}
      </div>
    </>
  );
};

export default MyBooksTabs;