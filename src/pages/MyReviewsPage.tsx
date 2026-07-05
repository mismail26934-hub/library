import { Link } from "react-router-dom";
import { useMyReviews } from "@/features/reviews/useReviews";
import { ProfilePageLayout } from "@/components/ProfilePageLayout";
import { StarRating } from "@/components/StarRating";
import { Button } from "@/components/ui/button";
import { LoadingSpinner, ErrorState, EmptyState } from "@/components/states";
import { formatDate } from "@/lib/utils";

export function MyReviewsPage() {
  const { data, isLoading, isError, refetch } = useMyReviews();
  const reviews = data?.reviews ?? [];

  return (
    <ProfilePageLayout>
      <div className="flex flex-col gap-4 md:gap-6">
        <h1 className="text-2xl font-bold tracking-[-0.72px] text-[var(--color-ink)] md:text-[28px] md:tracking-[-0.84px]">
          Reviews
        </h1>

        {isLoading ? (
          <LoadingSpinner label="Loading reviews..." />
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : reviews.length === 0 ? (
          <EmptyState
            title="No reviews yet"
            description="Reviews you write on books will appear here."
            action={
              <Link to="/books">
                <Button>Browse books</Button>
              </Link>
            }
          />
        ) : (
          <div className="flex flex-col gap-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="shadow-card flex flex-col gap-2 rounded-2xl bg-white p-4 md:p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <Link
                    to={`/books/${review.bookId}`}
                    className="font-bold tracking-[-0.32px] text-[var(--color-ink)] hover:underline"
                  >
                    Book #{review.bookId}
                  </Link>
                  <span className="shrink-0 text-xs text-[var(--color-ink-subtle)]">
                    {formatDate(review.createdAt)}
                  </span>
                </div>
                <StarRating value={review.star} size={20} />
                <p className="text-sm leading-6 text-[var(--color-ink-muted)] md:text-base">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProfilePageLayout>
  );
}
