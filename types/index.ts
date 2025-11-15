// TypeScript types for Bookster application

export interface Listing {
  id: string;
  created_at: string;
  user_id?: string;
  course_code: string;
  book_title: string;
  price: number;
  contact_info: string;
  condition?: string | null;
  notes?: string | null;
  status: 'active' | 'sold' | 'inactive';
}

export interface FormData {
  course_code: string;
  book_title: string;
  price: number;
  contact_info: string;
  condition?: string;
  notes?: string;
}

export type SortOption = 'date' | 'price-low' | 'price-high' | 'course';

export interface FilterState {
  courseCode: string;
  sortBy: SortOption;
}

