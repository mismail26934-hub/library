import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMyReviews } from "@/features/reviews/useReviews";
import { ProfilePageLayout } from "@/components/ProfilePageLayout";
import { MyReviewCard } from "@/components/reviews/MyReviewCard";
import { SearchLarge } from "@/components/admin/SearchLarge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/states";
import { useDebounce } from "@/lib/useDebounce";
import type { Review } from "@/types";

const LIMIT = 10;

export function MyReviewsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);

  const debouncedSearch = useDebounce(search, 450);

  const query = useMemo(
    () => ({
      q: debouncedSearch || undefined,
      page,
      limit: LIMIT,
    }),
    [debouncedSearch, page],
  );

  const { data, isLoading, isError, refetch, isFetching } = useMyReviews(query);

  useEffect(() => {
    setPage(1);
    setReviews([]);
  }, [debouncedSearch]);

  useEffect(() => {
    if (!data) return;
    setReviews((prev) => (page === 1 ? data.reviews : [...prev, ...data.reviews]));
  }, [data, page]);

  const totalPages = data?.pagination.totalPages ?? 1;
  const hasMore = page < totalPages;
  const initialLoading = isLoading && page === 1;

  return (
    <ProfilePageLayout wide>
      <div className="flex flex-col gap-4 lg:gap-6">
        <h1 className="text-2xl font-extrabold leading-9 tracking-[-0.72px] text-[var(--color-ink)] lg:text-[28px] lg:leading-[38px] lg:tracking-[-0.84px]">
          Reviews
        </h1>

        <SearchLarge
          value={search}
          onChange={setSearch}
          placeholder="Search Reviews"
          className="h-11 w-full lg:h-12 lg:max-w-[544px]"
        />

        {initialLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[320px] w-full rounded-2xl lg:h-[340px]" />
            ))}
          </div>
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : reviews.length === 0 ? (
          <EmptyState
            title="No reviews yet"
            description={
              debouncedSearch
                ? "No reviews match your search."
                : "Reviews you write on books will appear here."
            }
            action={
              <Link to="/books">
                <Button>Browse books</Button>
              </Link>
            }
          />
        ) : (
          <div className="flex flex-col items-center gap-4 lg:gap-6">
            <div className="flex w-full flex-col gap-4">
              {reviews.map((review) => (
                <MyReviewCard key={review.id} review={review} />
              ))}
            </div>

            {hasMore && (
              <button
                type="button"
                disabled={isFetching}
                onClick={() => setPage((p) => p + 1)}
                className="flex h-12 w-[200px] items-center justify-center rounded-full border border-[#d5d7da] text-base font-bold tracking-[-0.32px] text-[var(--color-ink)] transition-colors hover:bg-secondary disabled:opacity-60"
              >
                {isFetching ? "Loading…" : "Load More"}
              </button>
            )}
          </div>
        )}
      </div>
    </ProfilePageLayout>
  );
}
