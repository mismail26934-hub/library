import type { AdminListQuery, BooksQuery, MyLoansQuery } from "./api-endpoints";

export const qk = {
  books: (params: BooksQuery) => ["books", params] as const,
  book: (id: number | string) => ["book", String(id)] as const,
  recommend: (page: number) => ["books", "recommend", page] as const,
  categories: () => ["categories"] as const,
  authors: () => ["authors"] as const,
  reviews: (bookId: number | string) => ["reviews", String(bookId)] as const,
  myLoans: (params: MyLoansQuery) => ["my-loans", params] as const,
  profile: () => ["profile"] as const,
  cart: () => ["cart"] as const,
  myReviews: () => ["my-reviews"] as const,
  adminUsers: (params: AdminListQuery) => ["admin", "users", params] as const,
  adminLoans: (params: AdminListQuery) => ["admin", "loans", params] as const,
};
