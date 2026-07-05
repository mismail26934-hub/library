import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Share2, Star } from "lucide-react";
import { useBook } from "@/features/books/useBooks";
import { useIsBookBorrowed } from "@/features/loans/useLoans";
import { useAppSelector } from "@/app/hooks";
import { useAddToCart } from "@/features/cart/useCart";
import { BookDetailStat, StatDivider } from "@/components/BookDetailBreadcrumbs";
import { Button } from "@/components/ui/button";
import { LoadingSpinner, ErrorState } from "@/components/states";
import { toast } from "sonner";

export function AdminBookPreviewPage() {
  const { id } = useParams<{ id: string }>();
  const bookId = Number(id);
  const navigate = useNavigate();
  const { data: book, isLoading, isError, refetch } = useBook(bookId);
  const token = useAppSelector((s) => s.auth.token);
  const inCart = useAppSelector((s) => s.cart.items.some((i) => i.book.id === bookId));
  const addToCart = useAddToCart();
  const { isBorrowed } = useIsBookBorrowed(bookId);

  if (isLoading) return <LoadingSpinner label="Loading book..." />;
  if (isError || !book) return <ErrorState onRetry={() => refetch()} />;

  const outOfStock = book.availableCopies <= 0;
  const borrowLabel = outOfStock
    ? "Out of Stock"
    : isBorrowed
      ? "Already Borrowed"
      : "Borrow Book";

  const handleBorrow = () => {
    if (!token) {
      toast.error("Please log in to borrow books");
      navigate("/login", { state: { from: `/admin/books/${bookId}/preview` } });
      return;
    }
    navigate("/checkout", { state: { bookIds: [book.id] } });
  };

  const handleAddToCart = () => {
    if (!token) {
      toast.error("Please log in to add books to cart");
      navigate("/login", { state: { from: `/admin/books/${bookId}/preview` } });
      return;
    }
    addToCart.mutate(bookId);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/books/${bookId}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: book.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard");
      }
    } catch {
      /* user cancelled share */
    }
  };

  const actionButtons = (
    <>
      <Button
        variant="outline"
        className="h-12 w-[200px] rounded-full border-[#d5d7da] text-base font-bold tracking-[-0.32px]"
        disabled={outOfStock || inCart || addToCart.isPending || isBorrowed}
        onClick={handleAddToCart}
      >
        {inCart ? "In Cart" : "Add to Cart"}
      </Button>
      <Button
        className="h-12 w-[200px] rounded-full bg-[#1C65DA] text-base font-bold tracking-[-0.32px] hover:bg-[#1C65DA]/90"
        onClick={handleBorrow}
        disabled={outOfStock || isBorrowed}
      >
        {borrowLabel}
      </Button>
    </>
  );

  return (
    <>
      <div className="flex flex-col gap-6 pb-[72px] lg:gap-8 lg:pb-0">
        <button
          type="button"
          onClick={() => navigate("/admin/books")}
          className="flex items-center gap-3 text-[var(--color-ink)]"
        >
          <ArrowLeft className="size-6 lg:size-8" />
          <span className="text-xl font-bold tracking-[-0.4px] lg:text-[28px] lg:tracking-[-0.84px]">
            Preview Book
          </span>
        </button>

        <div className="flex flex-col items-center gap-9 lg:flex-row lg:items-start lg:gap-9">
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
                <BookDetailStat value={book.totalCopies} label="Page" />
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

            <div className="hidden gap-3 lg:flex">{actionButtons}</div>
          </div>
        </div>
      </div>

      <div className="shadow-card fixed inset-x-0 bottom-0 z-40 flex gap-3 bg-white p-4 lg:hidden">
        <Button
          variant="outline"
          className="h-10 min-w-0 flex-1 rounded-full border-[#d5d7da] text-sm font-bold tracking-[-0.28px]"
          disabled={outOfStock || inCart || addToCart.isPending || isBorrowed}
          onClick={handleAddToCart}
        >
          {inCart ? "In Cart" : "Add to Cart"}
        </Button>
        <Button
          className="h-10 min-w-0 flex-1 rounded-full bg-[#1C65DA] text-sm font-bold tracking-[-0.28px] hover:bg-[#1C65DA]/90"
          onClick={handleBorrow}
          disabled={outOfStock || isBorrowed}
        >
          {borrowLabel}
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="size-10 shrink-0 rounded-full border-[#d5d7da]"
          onClick={handleShare}
          aria-label="Share book"
        >
          <Share2 className="size-5" />
        </Button>
      </div>
    </>
  );
}
