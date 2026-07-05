import { useQueries, useQuery } from '@tanstack/react-query';
import { authorsApi, booksApi } from '@/lib/api-endpoints';
import { qk } from '@/lib/query-keys';

const AUTHOR_BOOKS_LIMIT = 50;

export function useAuthorBooks(authorId: number | string | undefined) {
  return useQuery({
    queryKey: qk.books({ authorId: Number(authorId), page: 1, limit: AUTHOR_BOOKS_LIMIT }),
    queryFn: () =>
      booksApi.list({ authorId: Number(authorId), page: 1, limit: AUTHOR_BOOKS_LIMIT }),
    enabled: !!authorId && !Number.isNaN(Number(authorId)),
  });
}

export function useAuthorFallback(id: number | string | undefined, enabled: boolean) {
  return useQuery({
    queryKey: qk.author(id ?? ''),
    queryFn: async () => {
      const authors = await authorsApi.list();
      return authors.find((a) => a.id === Number(id)) ?? null;
    },
    enabled: enabled && !!id && !Number.isNaN(Number(id)),
  });
}

export function useAuthorBookCounts(authorIds: number[]) {
  return useQueries({
    queries: authorIds.map((id) => ({
      queryKey: qk.authorBookCount(id),
      queryFn: () => booksApi.list({ authorId: id, page: 1, limit: 1 }),
      staleTime: 1000 * 60 * 5,
      enabled: id > 0,
    })),
  });
}

export { AUTHOR_BOOKS_LIMIT };
