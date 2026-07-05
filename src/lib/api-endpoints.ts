import { api } from "./axios";
import type {
  AdminLoansResponse,
  ApiResponse,
  AuthorsResponse,
  Book,
  BookDetail,
  BookPayload,
  BooksResponse,
  CartResponse,
  CategoriesResponse,
  LoansResponse,
  LoginResponse,
  Loan,
  Profile,
  Review,
  ReviewsResponse,
  MyReviewsResponse,
  User,
  UsersResponse,
} from "@/types";

/* -------------------------------- Auth -------------------------------- */
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
}
export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  register: (payload: RegisterPayload) =>
    api.post<ApiResponse<User>>("/auth/register", payload).then((r) => r.data.data),
  login: (payload: LoginPayload) =>
    api.post<ApiResponse<LoginResponse>>("/auth/login", payload).then((r) => r.data.data),
};

/* -------------------------------- Books ------------------------------- */
export interface BooksQuery {
  page?: number;
  limit?: number;
  q?: string;
  category?: number | string;
  rating?: number;
}

export const booksApi = {
  list: (params: BooksQuery) =>
    api.get<ApiResponse<BooksResponse>>("/books", { params }).then((r) => r.data.data),
  detail: (id: number | string) =>
    api.get<ApiResponse<BookDetail>>(`/books/${id}`).then((r) => r.data.data),
  recommend: (page = 1) =>
    api
      .get<ApiResponse<BooksResponse>>("/books/recommend", { params: { page } })
      .then((r) => r.data.data),
};

/* ----------------------------- Categories ----------------------------- */
export const categoriesApi = {
  list: () =>
    api
      .get<ApiResponse<CategoriesResponse>>("/categories")
      .then((r) => r.data.data.categories),
};

/* ------------------------------- Authors ------------------------------ */
export const authorsApi = {
  list: (limit = 100) =>
    api
      .get<ApiResponse<AuthorsResponse>>("/authors", { params: { limit } })
      .then((r) => r.data.data.authors),
};

/* -------------------------------- Loans ------------------------------- */
export interface BorrowPayload {
  bookId: number;
  days: number;
}
export interface MyLoansQuery {
  status?: "all" | "active" | "returned" | "overdue";
  q?: string;
  page?: number;
  limit?: number;
}

export const loansApi = {
  borrow: (payload: BorrowPayload) =>
    api.post<ApiResponse<{ loan: Loan }>>("/loans", payload).then((r) => r.data.data.loan),
  return: (id: number) =>
    api.patch<ApiResponse<{ loan: Loan }>>(`/loans/${id}/return`).then((r) => r.data.data),
  my: (params: MyLoansQuery) =>
    api.get<ApiResponse<LoansResponse>>("/loans/my", { params }).then((r) => r.data.data),
  fromCart: (payload: { itemIds: number[]; borrowDate: string; duration: number }) =>
    api.post<ApiResponse<unknown>>("/loans/from-cart", payload).then((r) => r.data.data),
};

/* ------------------------------- Reviews ------------------------------ */
export interface ReviewPayload {
  bookId: number;
  star: number;
  comment: string;
}

export interface MyReviewsQuery {
  q?: string;
  page?: number;
  limit?: number;
}

export const reviewsApi = {
  create: (payload: ReviewPayload) =>
    api.post<ApiResponse<Review>>("/reviews", payload).then((r) => r.data.data),
  byBook: (bookId: number | string, page = 1) =>
    api
      .get<ApiResponse<ReviewsResponse>>(`/reviews/book/${bookId}`, { params: { page } })
      .then((r) => r.data.data),
  remove: (id: number) =>
    api.delete<ApiResponse<unknown>>(`/reviews/${id}`).then((r) => r.data.data),
  mine: (params?: MyReviewsQuery) =>
    api
      .get<ApiResponse<MyReviewsResponse>>("/me/reviews", { params })
      .then((r) => r.data.data),
};

/* --------------------------------- Me --------------------------------- */
export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  profilePhoto?: string;
}

export const meApi = {
  get: () => api.get<ApiResponse<Profile>>("/me").then((r) => r.data.data),
  update: (payload: UpdateProfilePayload) =>
    api.patch<ApiResponse<User>>("/me", payload).then((r) => r.data.data),
};

/* -------------------------------- Admin ------------------------------- */
export interface AdminListQuery {
  page?: number;
  limit?: number;
  q?: string;
  status?: string;
}

export const adminApi = {
  users: (params: AdminListQuery) =>
    api.get<ApiResponse<UsersResponse>>("/admin/users", { params }).then((r) => r.data.data),
  loans: (params: AdminListQuery) =>
    api
      .get<ApiResponse<AdminLoansResponse>>("/admin/loans", { params })
      .then((r) => r.data.data),
  createBook: (payload: BookPayload) =>
    api.post<ApiResponse<Book>>("/books", payload).then((r) => r.data.data),
  updateBook: (id: number, payload: BookPayload) =>
    api.put<ApiResponse<Book>>(`/books/${id}`, payload).then((r) => r.data.data),
  deleteBook: (id: number) =>
    api.delete<ApiResponse<unknown>>(`/books/${id}`).then((r) => r.data.data),
};

/* -------------------------------- Cart -------------------------------- */
export const cartApi = {
  get: () => api.get<ApiResponse<CartResponse>>("/cart").then((r) => r.data.data),
  addItem: (bookId: number) =>
    api.post<ApiResponse<unknown>>("/cart/items", { bookId }).then((r) => r.data.data),
  removeItem: (itemId: number) =>
    api.delete<ApiResponse<unknown>>(`/cart/items/${itemId}`).then((r) => r.data.data),
  clear: () => api.delete<ApiResponse<unknown>>("/cart").then((r) => r.data.data),
};

export type { Book };
