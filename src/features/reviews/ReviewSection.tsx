import { useEffect, useState } from "react";
import { Star, Trash2 } from "lucide-react";
import { useAppSelector } from "@/app/hooks";
import { useDeleteReview } from "./useReviews";
import { StarRating } from "@/components/StarRating";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/states";
import { formatReviewDate, getInitials } from "@/lib/utils";
import type { Review } from "@/types";

const DESKTOP_COLS = 2;
const DESKTOP_ROWS = 3;
const PAGE_SIZE_DESKTOP = DESKTOP_COLS * DESKTOP_ROWS;
const MOBILE_ROWS = 3;
const PAGE_SIZE_MOBILE = MOBILE_ROWS;

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches,
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isDesktop;
}

interface ReviewSectionProps {
  bookId: number;
  reviews: Review[];
  rating: number;
  reviewCount: number;
}

function ReviewCard({
  review,
  canDelete,
  onDelete,
}: {
  review: Review;
  canDelete: boolean;
  onDelete: () => void;
}) {
  return (
    <article className="shadow-card flex w-full flex-col gap-4 rounded-2xl bg-white p-4">
      <div className="flex items-center justify-between gap-3 lg:items-start">
        <div className="flex items-center gap-3 lg:items-start">
          <Avatar
            className="size-[58px] shrink-0 text-sm lg:size-16 lg:text-lg"
            fallback={getInitials(review.user?.name)}
          />
          <div>
            <p className="text-sm font-bold leading-7 tracking-[-0.28px] text-[var(--color-ink)] lg:text-lg lg:leading-8 lg:tracking-[-0.36px]">
              {review.user?.name}
            </p>
            <p className="text-sm font-medium leading-7 tracking-[-0.42px] text-[var(--color-ink)] lg:text-base lg:leading-[30px] lg:tracking-[-0.48px]">
              {formatReviewDate(review.createdAt)}
            </p>
          </div>
        </div>
        {canDelete && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            title="Delete review"
            className="shrink-0"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <StarRating value={review.star} size={24} className="gap-0 lg:gap-0.5" />
        <p className="text-sm font-semibold leading-7 tracking-[-0.28px] text-[var(--color-ink)] lg:text-base lg:leading-[30px] lg:tracking-[-0.32px]">
          {review.comment}
        </p>
      </div>
    </article>
  );
}

export function ReviewSection({ bookId, reviews, rating, reviewCount }: ReviewSectionProps) {
  const user = useAppSelector((s) => s.auth.user);
  const deleteReview = useDeleteReview(bookId);
  const isDesktop = useIsDesktop();
  const pageSize = isDesktop ? PAGE_SIZE_DESKTOP : PAGE_SIZE_MOBILE;

  const [loadedPages, setLoadedPages] = useState(1);

  useEffect(() => {
    setLoadedPages(1);
  }, [bookId]);

  const visibleCount = loadedPages * pageSize;
  const visibleReviews = reviews.slice(0, visibleCount);
  const hasMore = visibleCount < reviews.length;

  const loadMore = () => {
    setLoadedPages((pages) => pages + 1);
  };

  return (
    <section className="flex flex-col items-center gap-[18px]">
      <div className="flex w-full flex-col gap-1 lg:gap-3">
        <h2 className="text-2xl font-bold leading-9 text-[var(--color-ink)] lg:text-4xl lg:leading-[44px]">
          Review
        </h2>
        <div className="flex items-center gap-1">
          <Star
            className="size-6 fill-[var(--color-star)] text-[var(--color-star)] lg:size-[34px]"
            aria-hidden
          />
          <p className="text-base font-bold leading-[30px] tracking-[-0.32px] text-[var(--color-ink)] lg:text-xl lg:leading-[34px]">
            {rating.toFixed(1)} ({reviewCount} Ulasan)
          </p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <EmptyState title="No reviews yet" description="Be the first to review this book." />
      ) : (
        <>
          <div className="flex w-full flex-col gap-[18px] lg:grid lg:grid-cols-2 lg:gap-5">
            {visibleReviews.map((review) => {
              const canDelete = user?.id === review.userId;
              return (
                <ReviewCard
                  key={review.id}
                  review={review}
                  canDelete={canDelete}
                  onDelete={() => deleteReview.mutate(review.id)}
                />
              );
            })}
          </div>

          {hasMore && (
            <Button
              variant="outline"
              className="h-10 w-[150px] rounded-full border-[#d5d7da] text-sm font-bold leading-7 tracking-[-0.28px] lg:h-12 lg:w-[200px] lg:text-base lg:leading-[30px] lg:tracking-[-0.32px]"
              onClick={loadMore}
            >
              Load More
            </Button>
          )}
        </>
      )}
    </section>
  );
}
