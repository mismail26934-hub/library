import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setCategory, setSearch } from "@/store/uiSlice";
import { useBooks } from "@/features/books/useBooks";
import { useDebounce } from "@/lib/useDebounce";
import { BookCard } from "@/components/BookCard";
import { BookListFilters } from "@/components/BookListFilters";
import { BookListMobileFilterBar } from "@/components/BookListMobileFilterBar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/states";

export function BookListPage() {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const { search, category, rating } = useAppSelector((s) => s.ui);
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 450);

  useEffect(() => {
    const q = searchParams.get("search");
    if (q) dispatch(setSearch(q));
    const cat = searchParams.get("category");
    if (cat) dispatch(setCategory(Number(cat)));
  }, [searchParams, dispatch]);

  const query = useMemo(
    () => ({
      page,
      limit: 12,
      q: debouncedSearch || undefined,
      categoryId: category ?? undefined,
      minRating: rating ?? undefined,
    }),
    [page, debouncedSearch, category, rating],
  );

  const { data, isLoading, isError, refetch, isFetching } = useBooks(query);

  const resetPage = () => setPage(1);

  const bookGrid = isLoading ? (
    <div className="grid grid-cols-2 gap-4 lg:flex lg:flex-wrap lg:gap-5">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="lg:min-w-[180px] lg:flex-1">
          <Skeleton className="aspect-[230/345] w-full rounded-xl" />
          <Skeleton className="mt-2 h-4 w-3/4" />
          <Skeleton className="mt-1 h-4 w-1/2" />
        </div>
      ))}
    </div>
  ) : isError ? (
    <ErrorState onRetry={() => refetch()} />
  ) : !data || data.books.length === 0 ? (
    <EmptyState
      title="No books found"
      description="Try adjusting your search or filters."
    />
  ) : (
    <>
      <div className="grid grid-cols-2 gap-4 lg:flex lg:flex-wrap lg:gap-5">
        {data.books.map((book) => (
          <div
            key={book.id}
            className="min-w-0 lg:min-w-[180px] lg:max-w-[calc(25%-15px)] lg:flex-1"
          >
            <BookCard book={book} variant="desktop" />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4 pt-6">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1 || isFetching}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {data.pagination.page} of {data.pagination.totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= data.pagination.totalPages || isFetching}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </>
  );

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 lg:gap-8">
      <h1 className="text-2xl font-bold leading-9 text-[var(--color-ink)] lg:text-4xl lg:leading-[44px]">
        Book List
      </h1>

      <BookListMobileFilterBar onChange={resetPage} />

      <div className="flex gap-10">
        <BookListFilters onChange={resetPage} />
        <div className="min-w-0 flex-1">{bookGrid}</div>
      </div>
    </div>
  );
}
