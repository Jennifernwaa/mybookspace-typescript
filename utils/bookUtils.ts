import { BookData, OpenLibraryBook } from "@/types";
import { useEffect, useState } from "react";

/**
 * Generates the correct cover URL for a book from OpenLibrary data.
 * It prioritizes ISBN, then OpenLibrary cover ID (cover_i), and falls back to a placeholder.
 * @param book The OpenLibraryBook object.
 * @param size The desired size of the cover ('S', 'M', or 'L').
 * @returns The URL string for the book cover.
 */
export const getCoverUrl = (book: OpenLibraryBook, size: 'S' | 'M' | 'L' = 'M'): string => {
  if (book.isbn?.[0]) {
    return `https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-${size}.jpg`;
  }
  if (book.cover_i) {
    return `https://covers.openlibrary.org/b/id/${book.cover_i}-${size}.jpg`;
  }
    if (book.cover_url) {
    return book.cover_url;
  }
   // Provide a default title to prevent a malformed URL if book.title is missing.
  const sanitizedTitle = book.title || 'Untitled';
  return `https://via.placeholder.com/300x450/EAB996/FFFFFF?text=${encodeURIComponent(sanitizedTitle)}`;
};



/**
 * Generates a URL-friendly slug for a book.
 * @param book The OpenLibraryBook object.
 * @returns A string slug.
 */
export const generateBookSlug = (book: OpenLibraryBook): string => {
  const encodedTitle = book.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const authorName = book.author_name?.[0] || 'unknown'; 
  const encodedAuthor = authorName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return `${encodedTitle}-${encodedAuthor}`;
};


/**
 * Transforms an OpenLibraryBook object into a BookData object suitable for your API.
 * This function sanitizes and handles missing data to prevent backend validation errors.
 *
 * @param book The OpenLibraryBook object from OpenLibrary API.
 * @param userId The ID of the user adding the book.
 * @returns A new BookData object ready for API submission.
 */
export const transformToBookData = (book: OpenLibraryBook, userId: string): Omit<BookData, '_id'> => ({
  userId,
  title: book.title,
  author: book.author_name || "Unknown",
  first_publish_year: book.first_publish_year || 'Unknown',
  isbn: book.isbn?.[0] || "Not available",
  cover_url: getCoverUrl(book),
  publisher: book.publisher?.[0] || "Unknown",
  pages: book.number_of_pages || "Unknown",
  language: book.languages?.[0]?.key?.split('/').pop() || "Unknown",
  status: "wantToRead",
  subjects: book.subjects || book.subject,
  description: typeof book.description === 'string' ? book.description : book.description?.value,
});

/**
 * A custom hook to debounce a value.
 * This is useful for delaying state updates, like search inputs.
 *
 * @param value The value to be debounced.
 * @param delay The delay in milliseconds.
 * @returns The debounced value.
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

