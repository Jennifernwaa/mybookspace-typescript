import { BookData, OpenLibraryBook } from "@/types";
import { useEffect, useState } from "react";

export const getCoverUrl = (book: OpenLibraryBook, size: 'S' | 'M' | 'L' = 'M'): string => {
  if (book.isbn?.[0]) {
    return `https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-${size}.jpg`;
  }
  if (book.cover_i) {
    return `https://covers.openlibrary.org/b/id/${book.cover_i}-${size}.jpg`;
  }
  return `https://via.placeholder.com/300x450/EAB996/FFFFFF?text=${encodeURIComponent(book.title)}`;
};

export const generateBookSlug = (book: OpenLibraryBook): string => {
  const encodedTitle = book.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const encodedAuthor = (book.author_name?.[0] || 'unknown').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return `${encodedTitle}-${encodedAuthor}`;
};

export const transformToBookData = (book: OpenLibraryBook, userId: string): Omit<BookData, '_id'> => ({
  userId,
  title: book.title,
  author: book.author_name?.[0] || "Unknown",
  first_publish_year: book.first_publish_year || "Unknown",
  isbn: book.isbn?.[0] || "Not available",
  cover_url: getCoverUrl(book),
  publisher: book.publisher?.[0] || "Unknown",
  pages: book.number_of_pages_median || "Unknown",
  language: book.language?.[0] || "Unknown",
  status: "wantToRead",
  subjects: book.subjects || book.subject,
  description: typeof book.description === 'string' ? book.description : book.description?.value,
});


export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};
