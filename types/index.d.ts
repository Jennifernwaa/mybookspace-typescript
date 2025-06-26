export interface User {
  uid: string;
  email: string;
  emailVerified: boolean;
}

export interface Book {
  id: string;
  title: string;
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
  dateCompleted?: string;

}

export interface BookEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book | null;
  tab: TabType;
  onSave: (updated: Partial<Book>) => Promise<void>;
}

export interface UserData {
  userId: string;
  fullName: string;
  userName: string;
  readingGoal: number;
  dateJoined: string;
  lastActive: string;
  friends: Record<string, any>;
  reading?: Book[];
  booksRead?: Book[];
  wantToRead?: Book[];
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

