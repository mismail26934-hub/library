import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setCategory, setRating, setSearch } from "@/store/uiSlice";
import { useBooks, useCategories } from "@/features/books/useBooks";
import { useDebounce } from "@/lib/useDebounce";
import { BookCard } from "@/components/BookCard";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/states";

export function BookListPage() {
  const dispatch = useAppDispatch();
  const { search, category, rating } = useAppSelector((s) => s.ui);
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 450);

  const { data: categories } = useCategories();

  const query = useMemo(
    () => ({
      page,
      limit: 12,
      search: debouncedSearch || undefined,
      category: category ?? undefined,
      rating: rating ?? undefined,
    }),
    [page, debouncedSearch, category, rating],
  );

  const { data, isLoading, isError, refetch, isFetching } = useBooks(query);

  const categoryOptions = [
    { label: "All categories", value: "" },
    ...(categories ?? []).map((c) => ({ label: c.name, value: String(c.id) })),
  ];
  const ratingOptions = [
    { label: "All ratings", value: "" },
    { label: "4+ stars", value: "4" },
    { label: "3+ stars", value: "3" },
    { label: "2+ stars", value: "2" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Browse Books</h1>
        <p className="text-muted-foreground">Find your next read from our collection</p>
      </div>

      <div className="flex flex-col gap-3 rounded-[var(--radius)] border bg-card p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title..."
            value={search}
            onChange={(e) => {
              dispatch(setSearch(e.target.value));
              setPage(1);
            }}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="hidden h-4 w-4 text-muted-foreground sm:block" />
          <Select
            className="w-40"
            value={category ? String(category) : ""}
            options={categoryOptions}
            onChange={(v) => {
              dispatch(setCategory(v ? Number(v) : null));
              setPage(1);
            }}
          />
          <Select
            className="w-36"
            value={rating ? String(rating) : ""}
            options={ratingOptions}
            onChange={(v) => {
              dispatch(setRating(v ? Number(v) : null));
              setPage(1);
            }}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-[3/4] w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
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
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {data.books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 pt-4">
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
      )}
    </div>
  );
}
