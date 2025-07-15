import { OpenLibraryBook } from '@/types';

export const reconstructBookFromParams = (searchParams: URLSearchParams): OpenLibraryBook | null => {
  const title = searchParams.get('title');
  const key = searchParams.get('key');
  
  if (!title || !key) return null;

  return {
    key,
    title,
    author_name: searchParams.get('author') ? [searchParams.get('author')!] : undefined,
    isbn: searchParams.get('isbn') ? [searchParams.get('isbn')!] : undefined,
    cover_i: searchParams.get('cover_i') ? Number(searchParams.get('cover_i')) : undefined,
    first_publish_year: searchParams.get('year') ? Number(searchParams.get('year')) : undefined,
    publisher: searchParams.get('publisher') ? [searchParams.get('publisher')!] : undefined,
    number_of_pages_median: searchParams.get('pages') ? Number(searchParams.get('pages')) : undefined,
    language: searchParams.get('language') ? [searchParams.get('language')!] : undefined,
  };
};