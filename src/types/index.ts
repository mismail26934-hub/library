export type Role = "USER" | "ADMIN";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  profilePhoto: string | null;
  role: Role;
  createdAt?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface Author {
  id: number;
  name: string;
  bio?: string | null;
}

export interface Category {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Book {
  id: number;
  title: string;
  description: string;
  isbn: string;
  publishedYear: number;
  coverImage: string | null;
  rating: number;
  reviewCount: number;
  totalCopies: number;
  availableCopies: number;
  borrowCount: number;
  authorId: number;
  categoryId: number;
  author: Author;
  category: Category;
}

export interface Review {
  id: number;
  star: number;
  comment: string;
  userId: number;
  bookId: number;
  createdAt: string;
  user: { id: number; name: string };
  book?: Book;
}

export interface MyReviewsResponse {
  reviews: Review[];
  pagination: Pagination;
}

export interface BookDetail extends Book {
  reviews: Review[];
}

export type LoanStatus = "BORROWED" | "RETURNED" | "LATE" | "OVERDUE";

export interface Loan {
  id: number;
  status: LoanStatus;
  displayStatus?: string;
  borrowedAt: string;
  dueAt: string;
  returnedAt: string | null;
  durationDays?: number;
  book: Book;
}

export interface LoanStats {
  borrowed: number;
  late: number;
  returned: number;
  total: number;
}

export interface Profile {
  profile: User;
  loanStats: LoanStats;
  reviewsCount: number;
}

export interface Paginated<T> {
  pagination: Pagination;
  data: T[];
}

export interface BooksResponse {
  books: Book[];
  pagination: Pagination;
}

export interface LoansResponse {
  loans: Loan[];
  pagination: Pagination;
}

export interface ReviewsResponse {
  bookId: number;
  reviews: Review[];
  pagination: Pagination;
}

export interface CategoriesResponse {
  categories: Category[];
}

export interface CartItem {
  id: number;
  bookId: number;
  book: Book;
}

export interface CartResponse {
  items: CartItem[];
}

/* -------------------------------- Admin ------------------------------- */
export interface UsersResponse {
  users: User[];
  pagination: Pagination;
}

/** A loan record as returned by the admin endpoints — includes the borrower. */
export interface AdminLoan extends Loan {
  user: Pick<User, "id" | "name" | "email">;
}

export interface AdminLoansResponse {
  loans: AdminLoan[];
  pagination: Pagination;
}

export interface AuthorsResponse {
  authors: Author[];
  pagination: Pagination;
}

/** Payload for creating/updating a book (admin only). */
export interface BookPayload {
  title: string;
  authorId: number;
  categoryId: number;
  isbn: string;
  publishedYear: number;
  totalCopies: number;
  description: string;
  coverImage?: string | null;
}
