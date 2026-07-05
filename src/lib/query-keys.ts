import type { AdminListQuery, BooksQuery, MyLoansQuery, MyReviewsQuery } from "./api-endpoints";

export const qk = {
  books: (params: BooksQuery) => ["books", params] as const,
  book: (id: number | string) => ["book", String(id)] as const,
  recommend: (page: number, limit: number) => ["books", "recommend", page, limit] as const,
  categories: () => ["categories"] as const,
  authors: () => ["authors"] as const,
  author: (id: number | string) => ["author", String(id)] as const,
  authorBookCount: (id: number) => ["author-book-count", id] as const,
  reviews: (bookId: number | string) => ["reviews", String(bookId)] as const,
  myLoans: (params: MyLoansQuery) => ["my-loans", params] as const,
  profile: () => ["profile"] as const,
  cart: () => ["cart"] as const,
  myReviews: (params: MyReviewsQuery) => ["my-reviews", params] as const,
  adminUsers: (params: AdminListQuery) => ["admin", "users", params] as const,
  adminLoans: (params: AdminListQuery) => ["admin", "loans", params] as const,
};
