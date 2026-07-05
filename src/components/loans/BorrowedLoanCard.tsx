import { Link } from "react-router-dom";
import { LoanStatusBadge } from "@/components/admin/LoanStatusBadge";
import { formatDate, formatDueDate } from "@/lib/utils";
import type { Loan } from "@/types";

interface BorrowedLoanCardProps {
  loan: Loan;
  onGiveReview?: () => void;
  onReturn?: () => void;
}

export function BorrowedLoanCard({ loan, onGiveReview, onReturn }: BorrowedLoanCardProps) {
  const { book } = loan;
  const isReturned = loan.status === "RETURNED";

  return (
    <article className="shadow-card flex flex-col gap-4 rounded-2xl bg-white p-4 lg:gap-5 lg:p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1 lg:gap-3">
          <span className="text-sm font-bold tracking-[-0.28px] text-[var(--color-ink)] lg:text-base lg:tracking-[-0.32px]">
            Status
          </span>
          <LoanStatusBadge status={loan.status} />
        </div>
        <div className="flex items-center gap-1 lg:gap-3">
          <span className="text-sm font-bold tracking-[-0.28px] text-[var(--color-ink)] lg:text-base lg:tracking-[-0.32px]">
            Due Date
          </span>
          <span className="inline-flex items-center rounded px-2 py-0.5 text-sm font-bold tracking-[-0.28px] text-[#ee1d52] bg-[rgba(238,29,82,0.1)]">
            {formatDueDate(loan.dueAt)}
          </span>
        </div>
      </div>

      <hr className="border-[#d5d7da]" />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
        <div className="flex items-center gap-4">
          <Link to={`/books/${book.id}`} className="shrink-0">
            {book.coverImage ? (
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
            {book.category?.name && (
              <span className="inline-flex w-fit items-center rounded-md border border-[#d5d7da] px-2 text-sm font-bold leading-7 tracking-[-0.28px] text-[var(--color-ink)]">
                {book.category.name}
              </span>
            )}
            <Link
              to={`/books/${book.id}`}
              className="text-base font-bold leading-[30px] tracking-[-0.32px] text-[var(--color-ink)] hover:underline lg:text-xl lg:leading-[34px] lg:tracking-[-0.4px]"
            >
              {book.title}
            </Link>
            <p className="truncate text-sm font-medium tracking-[-0.42px] text-[var(--color-ink-muted)] lg:text-base lg:leading-[30px] lg:tracking-[-0.48px]">
              {book.author?.name}
            </p>
            <div className="flex items-center gap-2 text-sm font-bold tracking-[-0.28px] text-[var(--color-ink)] lg:text-base lg:tracking-[-0.32px]">
              <span>{formatDate(loan.borrowedAt)}</span>
              <span className="size-[2px] shrink-0 rounded-full bg-[var(--color-ink)]" aria-hidden />
              <span>Duration {loan.durationDays ?? "-"} Days</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={isReturned ? onGiveReview : onReturn}
          className="flex h-10 w-full shrink-0 items-center justify-center rounded-full bg-[#1c65da] text-base font-bold tracking-[-0.32px] text-white transition-colors hover:bg-[#1c65da]/90 lg:h-10 lg:w-[182px]"
        >
          {isReturned ? "Give Review" : "Return"}
        </button>
      </div>
    </article>
  );
}
