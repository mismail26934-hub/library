import { useState } from "react";
import { useParams } from "react-router-dom";
import { Star } from "lucide-react";
import { useBook } from "@/features/books/useBooks";
import { useBorrow } from "@/features/loans/useLoans";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { addToCart } from "@/features/cart/cartSlice";
import {
  BookDetailBreadcrumbs,
  BookDetailStat,
  StatDivider,
} from "@/components/BookDetailBreadcrumbs";
import { RelatedBooksSection } from "@/components/RelatedBooksSection";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select } from "@/components/ui/select";
import { LoadingSpinner, ErrorState } from "@/components/states";
import { ReviewSection } from "@/features/reviews/ReviewSection";
import { toast } from "sonner";

const durationOptions = [
  { label: "3 days", value: "3" },
  { label: "5 days", value: "5" },
  { label: "10 days", value: "10" },
];

export function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const bookId = Number(id);
  const { data: book, isLoading, isError, refetch } = useBook(bookId);
  const borrow = useBorrow();
  const dispatch = useAppDispatch();
  const token = useAppSelector((s) => s.auth.token);
  const inCart = useAppSelector((s) => s.cart.items.some((i) => i.book.id === bookId));

  const [dialogOpen, setDialogOpen] = useState(false);
  const [days, setDays] = useState("5");

  if (isLoading) return <LoadingSpinner label="Loading book..." />;
  if (isError || !book) return <ErrorState onRetry={() => refetch()} />;

  const outOfStock = book.availableCopies <= 0;

  const handleBorrow = () => {
    if (!token) {
      toast.error("Please log in to borrow books");
      return;
    }
    setDialogOpen(true);
  };

  const confirmBorrow = () => {
    borrow.mutate(
      { bookId: book.id, days: Number(days) },
      { onSuccess: () => setDialogOpen(false) },
    );
  };

  const handleAddToCart = () => {
    dispatch(addToCart(book));
    toast.success("Added to cart");
  };

  const actionButtons = (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="outline"
        className="h-12 w-[200px] rounded-full border-[#d5d7da] text-base font-bold tracking-[-0.32px]"
        disabled={outOfStock || inCart}
        onClick={handleAddToCart}
      >
        {inCart ? "In Cart" : "Add to Cart"}
      </Button>
      <Button
        className="h-12 w-[200px] rounded-full bg-[#1C65DA] text-base font-bold tracking-[-0.32px] hover:bg-[#1C65DA]/90"
        onClick={handleBorrow}
        disabled={outOfStock}
        loading={borrow.isPending}
      >
        {outOfStock ? "Out of Stock" : "Borrow Book"}
      </Button>
    </div>
  );

  return (
    <>
    <div className="flex flex-col gap-6 pb-[72px] lg:gap-16 lg:pb-0">
      <BookDetailBreadcrumbs
        categoryName={book.category?.name}
        categoryId={book.categoryId}
        bookTitle={book.title}
      />

      <div className="flex flex-col items-center gap-9 lg:flex-row lg:items-start">
        <div className="mx-auto shrink-0 bg-[#e9eaeb] p-[5px] lg:mx-0 lg:w-full lg:max-w-[321px] lg:p-2">
          {book.coverImage ? (
            <img
              src={book.coverImage}
              alt={book.title}
              className="h-[318px] w-[212px] object-cover lg:h-[482px] lg:w-full"
            />
          ) : (
            <div className="flex h-[318px] w-[212px] items-center justify-center text-muted-foreground lg:h-[482px] lg:w-full">
              No cover
            </div>
          )}
        </div>

        <div className="flex w-full min-w-0 flex-1 flex-col gap-4 lg:gap-5">
          <div className="flex flex-col gap-3 lg:gap-[22px]">
            <div className="flex flex-col gap-0.5 lg:gap-1">
              {book.category?.name && (
                <span className="inline-flex w-fit items-center rounded-md border border-[#d5d7da] px-2 py-0 text-sm font-bold leading-7 tracking-[-0.28px] text-[var(--color-ink)]">
                  {book.category.name}
                </span>
              )}
              <h1 className="text-2xl font-bold leading-9 tracking-[-0.56px] text-[var(--color-ink)] lg:text-[28px] lg:leading-[38px]">
                {book.title}
              </h1>
              <p className="text-sm font-semibold tracking-[-0.28px] text-[var(--color-ink-muted)] lg:text-base lg:tracking-[-0.32px]">
                {book.author?.name}
              </p>
              <div className="flex items-center gap-0.5">
                <Star className="size-6 fill-[var(--color-star)] text-[var(--color-star)]" />
                <span className="text-base font-bold tracking-[-0.32px] text-[var(--color-ink-strong)]">
                  {book.rating.toFixed(1)}
                </span>
              </div>
            </div>

            <div className="flex w-full items-center gap-5">
              <BookDetailStat value={book.totalCopies} label="Stock" />
              <StatDivider />
              <BookDetailStat value={book.borrowCount} label="Rating" />
              <StatDivider />
              <BookDetailStat value={book.reviewCount} label="Reviews" />
            </div>
          </div>

          <hr className="border-[#d5d7da]" />

          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold leading-[34px] tracking-[-0.4px] text-[var(--color-ink)]">
              Description
            </h2>
            <p className="whitespace-pre-line text-sm font-medium leading-7 tracking-[-0.42px] text-[var(--color-ink)] lg:text-base lg:leading-[30px] lg:tracking-[-0.48px]">
              {book.description}
            </p>
          </div>

          <div className="hidden lg:block">{actionButtons}</div>
        </div>
      </div>

      <hr className="border-[#d5d7da]" />

      <ReviewSection
        bookId={book.id}
        reviews={book.reviews}
        rating={book.rating}
        reviewCount={book.reviewCount}
      />

      <hr className="border-[#d5d7da]" />

      <RelatedBooksSection bookId={book.id} categoryId={book.categoryId} />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent onClose={() => setDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>Borrow "{book.title}"</DialogTitle>
            <DialogDescription>
              Choose how long you'd like to borrow this book.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Loan duration</label>
              <Select value={days} options={durationOptions} onChange={setDays} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={confirmBorrow} loading={borrow.isPending}>
                Confirm borrow
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>

    <div className="shadow-card fixed inset-x-0 bottom-0 z-40 flex gap-3 bg-white p-4 lg:hidden">
      <Button
        variant="outline"
        className="h-10 min-w-0 flex-1 rounded-full border-[#d5d7da] text-sm font-bold tracking-[-0.28px]"
        disabled={outOfStock || inCart}
        onClick={handleAddToCart}
      >
        {inCart ? "In Cart" : "Add to Cart"}
      </Button>
      <Button
        className="h-10 min-w-0 flex-1 rounded-full bg-[#1C65DA] text-sm font-bold tracking-[-0.28px] hover:bg-[#1C65DA]/90"
        onClick={handleBorrow}
        disabled={outOfStock}
        loading={borrow.isPending}
      >
        {outOfStock ? "Out of Stock" : "Borrow Book"}
      </Button>
    </div>
    </>
  );
}

export function BookDetailSkeleton() {
  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:gap-9">
      <Skeleton className="mx-auto h-[318px] w-[212px] lg:mx-0 lg:h-[482px] lg:w-full lg:max-w-[321px]" />
      <div className="flex-1 space-y-4">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
}
