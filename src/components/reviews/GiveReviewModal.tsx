import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useAddReview } from "@/features/reviews/useReviews";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { StarRating } from "@/components/StarRating";
import { cn } from "@/lib/utils";
import type { Book } from "@/types";

interface GiveReviewModalProps {
  open: boolean;
  book: Book | null;
  onOpenChange: (open: boolean) => void;
}

export function GiveReviewModal({ open, book, onOpenChange }: GiveReviewModalProps) {
  const bookId = book?.id ?? 0;
  const addReview = useAddReview(bookId);

  const [star, setStar] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (!open) {
      setStar(0);
      setComment("");
    }
  }, [open]);

  const handleClose = () => onOpenChange(false);

  const handleSend = () => {
    if (!book || star < 1 || !comment.trim()) return;

    addReview.mutate(
      { bookId: book.id, star, comment: comment.trim() },
      { onSuccess: () => handleClose() },
    );
  };

  const canSend = star >= 1 && comment.trim().length > 0 && !addReview.isPending;

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
            Give Review
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

        <div className="flex flex-col items-center gap-2">
          <p className="w-full text-center text-sm font-bold leading-7 tracking-[-0.28px] text-[var(--color-ink)]">
            Give Rating
          </p>
          <StarRating
            value={star}
            onChange={setStar}
            readOnly={false}
            size={40}
            className="justify-center gap-1"
          />
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Please share your thoughts about this book"
          className={cn(
            "h-[235px] w-full resize-none rounded-xl border border-[#d5d7da] px-3 py-2",
            "text-sm font-medium leading-7 tracking-[-0.42px] text-[var(--color-ink)]",
            "placeholder:text-[#717680] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1c65da]/30",
          )}
        />

        <button
          type="button"
          disabled={!canSend}
          onClick={handleSend}
          className={cn(
            "flex h-10 w-full items-center justify-center rounded-full bg-[#1c65da] text-sm font-bold tracking-[-0.28px] text-white transition-colors hover:bg-[#1c65da]/90 disabled:cursor-not-allowed disabled:opacity-50",
            "lg:h-12 lg:text-base lg:tracking-[-0.32px]",
          )}
        >
          {addReview.isPending ? "Sending…" : "Send"}
        </button>
      </DialogContent>
    </Dialog>
  );
}
