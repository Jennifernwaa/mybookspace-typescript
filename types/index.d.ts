export interface User {
  uid: string;
  email: string;
  emailVerified: boolean;
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
