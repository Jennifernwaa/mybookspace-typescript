import { OpenLibraryBook, RecommendedBook } from '@/types';

export const reconstructBookFromParams = (searchParams: URLSearchParams): RecommendedBook | null => {
  const title = searchParams.get('title');
  const key = searchParams.get('key');
  
  if (!title || !key) return null;

  return {
    key,
    title,
    author_name: searchParams.get('author_name') || undefined,
    isbn: searchParams.get('isbn') ? [searchParams.get('isbn')!] : undefined,
    cover_i: searchParams.get('cover_i') ? Number(searchParams.get('cover_i')) : undefined,
    cover_url: searchParams.get('cover_url') || 'https://via.placeholder.com/150?text=No+Cover',
    first_publish_year: searchParams.get('year') ? String(searchParams.get('year')) : undefined,
    publisher: searchParams.get('publisher') ? [searchParams.get('publisher')!] : undefined,
    number_of_pages: searchParams.get('pages') ? Number(searchParams.get('pages')) : undefined,
  };
};