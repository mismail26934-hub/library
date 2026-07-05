import { useQuery } from "@tanstack/react-query";
import { BookCard } from "@/components/BookCard";
import { booksApi } from "@/lib/api-endpoints";
import { qk } from "@/lib/query-keys";
import { Skeleton } from "@/components/ui/skeleton";

interface RelatedBooksSectionProps {
  bookId: number;
  categoryId?: number;
}

export function RelatedBooksSection({ bookId, categoryId }: RelatedBooksSectionProps) {
  const { data, isLoading } = useQuery({
    queryKey: qk.books({ category: categoryId, limit: 8, page: 1 }),
    queryFn: () => booksApi.list({ category: categoryId, limit: 8, page: 1 }),
    enabled: !!categoryId,
  });

  const relatedBooks = (data?.books ?? []).filter((b) => b.id !== bookId).slice(0, 5);

  if (!categoryId) return null;
  if (!isLoading && relatedBooks.length === 0) return null;

  return (
    <section className="flex flex-col gap-5 lg:gap-10">
      <h2 className="text-2xl font-bold leading-9 text-[var(--color-ink)] lg:text-4xl lg:leading-[44px] lg:tracking-[-0.72px]">
        Related Books
      </h2>
      {isLoading ? (
        <>
          <div className="grid grid-cols-2 gap-4 lg:hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[230/345] w-full rounded-xl" />
            ))}
          </div>
          <div className="hidden flex-wrap gap-5 lg:flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-[420px] min-w-[180px] flex-1 rounded-xl" />
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 lg:hidden">
            {relatedBooks.map((book) => (
              <BookCard key={book.id} book={book} variant="mobile" />
            ))}
          </div>
          <div className="hidden flex-wrap gap-5 lg:flex">
            {relatedBooks.map((book) => (
              <div
                key={book.id}
                className="min-w-[180px] max-w-[calc(20%-16px)] flex-1"
              >
                <BookCard book={book} variant="desktop" />
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
