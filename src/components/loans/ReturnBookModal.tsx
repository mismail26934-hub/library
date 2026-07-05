import { X } from "lucide-react";
import { useReturnLoan } from "@/features/loans/useLoans";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn, formatDueDate } from "@/lib/utils";
import type { Loan } from "@/types";

interface ReturnBookModalProps {
  open: boolean;
  loan: Loan | null;
  onOpenChange: (open: boolean) => void;
}

export function ReturnBookModal({ open, loan, onOpenChange }: ReturnBookModalProps) {
  const returnLoan = useReturnLoan();
  const book = loan?.book;

  const handleClose = () => onOpenChange(false);

  const handleReturn = () => {
    if (!loan) return;
    returnLoan.mutate(loan.id, { onSuccess: () => handleClose() });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-w-[345px] gap-6 rounded-2xl border-0 p-4 shadow-card",
          "lg:max-w-[446px] lg:p-6",
        )}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold leading-8 tracking-[-0.54px] text-[var(--color-ink)]">
            Return Book
          </h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="flex size-6 items-center justify-center text-[var(--color-ink)] transition-opacity hover:opacity-70"
          >
            <X className="size-6" strokeWidth={2} />
          </button>
        </div>

        {book && (
          <div className="flex items-center gap-4">
            {book.coverImage ? (
              <img
                src={book.coverImage}
                alt={book.title}
                className="h-[106px] w-[70px] shrink-0 object-cover lg:h-[138px] lg:w-[92px]"
              />
            ) : (
              <div className="h-[106px] w-[70px] shrink-0 bg-muted lg:h-[138px] lg:w-[92px]" />
            )}

            <div className="flex min-w-0 flex-col gap-1">
              {book.category?.name && (
                <span className="inline-flex w-fit items-center rounded-md border border-[#d5d7da] px-2 text-sm font-bold leading-7 tracking-[-0.28px] text-[var(--color-ink)]">
                  {book.category.name}
                </span>
              )}
              <p className="text-base font-bold leading-[30px] tracking-[-0.32px] text-[var(--color-ink)] lg:text-xl lg:leading-[34px] lg:tracking-[-0.4px]">
                {book.title}
              </p>
              {book.author?.name && (
                <p className="truncate text-sm font-medium tracking-[-0.42px] text-[var(--color-ink-muted)] lg:text-base lg:leading-[30px] lg:tracking-[-0.48px]">
                  {book.author.name}
                </p>
              )}
            </div>
          </div>
        )}

        <p className="text-sm font-medium leading-7 tracking-[-0.42px] text-[var(--color-ink-muted)] lg:text-base lg:leading-[30px] lg:tracking-[-0.48px]">
          Are you sure you want to return this book?
          {loan?.dueAt && (
            <>
              {" "}
              The due date is{" "}
              <span className="font-bold text-[var(--color-ink)]">{formatDueDate(loan.dueAt)}</span>.
            </>
          )}
        </p>

        <button
          type="button"
          disabled={!loan || returnLoan.isPending}
          onClick={handleReturn}
          className={cn(
            "flex h-10 w-full items-center justify-center rounded-full bg-[#1c65da] text-sm font-bold tracking-[-0.28px] text-white transition-colors hover:bg-[#1c65da]/90 disabled:cursor-not-allowed disabled:opacity-50",
            "lg:h-12 lg:text-base lg:tracking-[-0.32px]",
          )}
        >
          {returnLoan.isPending ? "Returning…" : "Return"}
        </button>
      </DialogContent>
    </Dialog>
  );
}
