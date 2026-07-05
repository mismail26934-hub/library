import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { booksApi, categoriesApi, type BooksQuery } from "@/lib/api-endpoints";
import { qk } from "@/lib/query-keys";

export function useBooks(params: BooksQuery) {
  return useQuery({
    queryKey: qk.books(params),
    queryFn: () => booksApi.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useBook(id: number | string) {
  return useQuery({
    queryKey: qk.book(id),
    queryFn: () => booksApi.detail(id),
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: qk.categories(),
    queryFn: () => categoriesApi.list(),
    staleTime: 1000 * 60 * 10,
  });
}
