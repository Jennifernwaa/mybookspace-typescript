export interface User {
  _id?: string;
  email: string;
  password?: string; // Add this
  userName?: string;
  fullName?: string;
  readingGoal?: number;
  dateJoined?: string;
  lastActive?: string;
  friends: string[]; // Okay for frontend; backend uses ObjectId[]
  createdAt?: string;
  updatedAt?: string;
}


export interface Post {
  _id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FeedPost {
  _id: string;
  postId: string;
  content: string;
  authorId: string;
  authorName: string;
  originalAuthorId: string;
  userId: string; // The user whose feed this post appears in
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchResult {
  _id: string;
  userName: string;
  email: string;
  isFriend: boolean;
}


export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface CreatePostData {
  content: string;
}

export interface FriendAction {
  targetUserId: string;
  action: 'add' | 'remove';
}


export interface Book {
  _id: string; // MongoDB's default ID
  userId: string; // Stored as a string on the frontend, but ObjectId in backend
  title: string;
  description: string,
  author: string;
  status: 'wantToRead' | 'reading' | 'finished';
  progress?: number;
  rating?: number;
  notes?: string;
  favorite?: boolean;
  dateCompleted?: string;
  first_publish_year: number;
  cover_url?: string;
  dateAdded: string;
  // Add these if they are part of your Book model
  totalPages?: number;
  genre?: string[];
  publisher?: string;
  startDate?: string;
  endDate?: string;
  createdAt?: string; // Added as per your Book model
  updatedAt?: string; // Added as per your Book model
}

export interface BookEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book | null;
  tab: TabType; // Assuming TabType is imported/defined elsewhere
  onSave: (updated: Partial<Book>) => Promise<void>;
}

export interface UserData {
  _id: string;
  email: string;
  fullName?: string;
  userName?: string;
  readingGoal?: number;
  dateJoined?: string;
  lastActive?: string;
  friends?: Record<string, any>;
  booksRead?: string[]; // Assuming this is an array of book IDs that have been read
}

export interface ReadingProgress {
  title: string;
  author: string;
  status: string;
  progress: number;
}

export interface NameEntryData {
  fullName: string;
  userName: string;
  readingGoal: number;
}

export interface DashboardData {
  userData?: UserData;
  allBooks?: Book[];
  isLoading: boolean;
  showNameEntry: boolean;
  handleNameSubmission: (data: NameEntryData) => Promise<void>;
  refetchUserData: () => Promise<void>;
}

export interface OpenLibraryBook {
  key: string;
  title: string;
  author_name?: string[];
  publisher?: string[];
  first_publish_year?: number;
  isbn?: string[];
  cover_i?: number;
  subject?: string[];
  subjects?: string[];
  number_of_pages_median?: number;
  language?: string[];
  description?: string | { value: string };
  rating?: number;
}

export interface BookData {
  _id?: string;
  userId: string;
  title: string;
  author: string;
  first_publish_year: number | string;
  isbn: string;
  cover_url: string;
  publisher: string;
  pages: number | string;
  language: string;
  status: 'wantToRead' | 'currentlyReading' | 'read';
  rating?: number;
  subjects?: string[];
  description?: string;
}

export interface SearchState {
  query: string;
  results: OpenLibraryBook[];
  isLoading: boolean;
  error: string | null;
}

export interface BookDetailState {
  book: OpenLibraryBook | null;
  isLoading: boolean;
  error: string | null;
}
