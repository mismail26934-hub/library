import { LoanStatusBadge } from "@/components/admin/LoanStatusBadge";
import { formatDate, formatDueDate } from "@/lib/utils";
import type { AdminLoan } from "@/types";

interface AdminBorrowedLoanCardDesktopProps {
  loan: AdminLoan;
}

export function AdminBorrowedLoanCardDesktop({ loan }: AdminBorrowedLoanCardDesktopProps) {
  const { book, borrower } = loan;

  return (
    <article className="shadow-card flex flex-col gap-5 rounded-2xl bg-white p-5">
      <div className="flex w-full items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-base font-bold leading-[30px] tracking-[-0.32px] text-[var(--color-ink)]">
            Status
          </span>
          <LoanStatusBadge status={loan.status} />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-base font-bold leading-[30px] tracking-[-0.32px] text-[var(--color-ink)]">
            Due Date
          </span>
          <span className="inline-flex h-8 items-center justify-center rounded-[4px] bg-[rgba(238,29,82,0.1)] px-2 py-[2px] text-sm font-bold leading-7 tracking-[-0.28px] text-[#ee1d52]">
            {formatDueDate(loan.dueAt)}
          </span>
        </div>
      </div>

      <hr className="border-[#d5d7da]" />

      <div className="flex items-center gap-4">
        <div className="h-[138px] w-[92px] shrink-0 overflow-hidden rounded-md bg-secondary">
          {book?.coverImage ? (
            <img src={book.coverImage} alt={book.title} className="size-full object-cover" />
          ) : null}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="w-fit rounded-md border border-[#d5d7da] px-2 text-sm font-bold leading-7 tracking-[-0.28px] text-[var(--color-ink)]">
            {book?.category?.name ?? "Category"}
          </span>
          <p className="text-xl font-bold leading-[34px] tracking-[-0.4px] text-[var(--color-ink)]">
            {book?.title ?? "-"}
          </p>
          <p className="text-base font-medium leading-[30px] tracking-[-0.48px] text-[#414651]">
            {book?.author?.name ?? "-"}
          </p>
          <div className="flex items-center gap-2 text-base font-bold leading-[30px] tracking-[-0.32px] text-[var(--color-ink)]">
            <span>{formatDate(loan.borrowedAt)}</span>
            <span className="size-[2px] shrink-0 rounded-full bg-[var(--color-ink)]" aria-hidden />
            <span>Duration {loan.durationDays ?? "-"} Days</span>
          </div>
        </div>

        <div className="flex shrink-0 flex-col justify-center">
          <p className="text-base font-semibold leading-[30px] tracking-[-0.32px] text-[var(--color-ink)]">
            borrower&apos;s name
          </p>
          <p className="text-xl font-bold leading-[34px] tracking-[-0.4px] text-[var(--color-ink)]">
            {borrower?.name ?? "-"}
          </p>
        </div>
      </div>
    </article>
  );
}
