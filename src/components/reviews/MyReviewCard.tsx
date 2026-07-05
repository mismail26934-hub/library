import { Link } from "react-router-dom";
import { StarRating } from "@/components/StarRating";
import { formatReviewDate } from "@/lib/utils";
import type { Review } from "@/types";

interface MyReviewCardProps {
  review: Review;
}

export function MyReviewCard({ review }: MyReviewCardProps) {
  const book = review.book;

  return (
    <article className="shadow-card flex flex-col gap-4 rounded-2xl bg-white p-4 lg:gap-5 lg:p-5">
      <p className="text-sm font-semibold tracking-[-0.28px] text-[var(--color-ink)] lg:text-base lg:tracking-[-0.32px]">
        {formatReviewDate(review.createdAt)}
      </p>

      <hr className="border-[#d5d7da]" />

      <div className="flex items-center gap-4">
        <Link to={`/books/${review.bookId}`} className="shrink-0">
          {book?.coverImage ? (
            <img
              src={book.coverImage}
              alt={book.title}
              className="h-[106px] w-[70px] object-cover lg:h-[138px] lg:w-[92px]"
            />
          ) : (
            <div className="h-[106px] w-[70px] bg-muted lg:h-[138px] lg:w-[92px]" />
          )}
        </Link>

        <div className="flex min-w-0 flex-col gap-1">
          {book?.category?.name && (
            <span className="inline-flex w-fit items-center rounded-md border border-[#d5d7da] px-2 text-sm font-bold leading-7 tracking-[-0.28px] text-[var(--color-ink)]">
              {book.category.name}
            </span>
          )}
          <Link
            to={`/books/${review.bookId}`}
            className="text-base font-bold leading-[30px] tracking-[-0.32px] text-[var(--color-ink)] hover:underline lg:text-xl lg:leading-[34px] lg:tracking-[-0.4px]"
          >
            {book?.title ?? `Book #${review.bookId}`}
          </Link>
          {book?.author?.name && (
            <p className="truncate text-sm font-medium tracking-[-0.42px] text-[var(--color-ink-muted)] lg:text-base lg:leading-[30px] lg:tracking-[-0.48px]">
              {book.author.name}
            </p>
          )}
        </div>
      </div>

      <hr className="border-[#d5d7da]" />

      <StarRating value={review.star} size={24} />

      <p className="text-sm font-semibold leading-6 tracking-[-0.28px] text-[var(--color-ink)] lg:text-base lg:leading-[30px] lg:tracking-[-0.32px]">
        {review.comment}
      </p>
    </article>
  );
}
