import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, Calendar, Layers, ShoppingCart } from "lucide-react";
import { useBook } from "@/features/books/useBooks";
import { useBorrow } from "@/features/loans/useLoans";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { addToCart } from "@/features/cart/cartSlice";
import { StarRating } from "@/components/StarRating";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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

  return (
    <div className="space-y-8">
      <Link
        to="/books"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to books
      </Link>

      <div className="grid gap-8 md:grid-cols-[300px_1fr]">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-[var(--radius)] border bg-muted">
            {book.coverImage ? (
              <img
                src={book.coverImage}
                alt={book.title}
                className="aspect-[3/4] w-full object-cover"
              />
            ) : (
              <div className="flex aspect-[3/4] items-center justify-center text-muted-foreground">
                No cover
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Button
              className="w-full"
              onClick={handleBorrow}
              disabled={outOfStock}
              loading={borrow.isPending}
            >
              <BookOpen className="h-4 w-4" />
              {outOfStock ? "Out of stock" : "Borrow this book"}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              disabled={outOfStock || inCart}
              onClick={() => {
                dispatch(addToCart(book));
                toast.success("Added to cart");
              }}
            >
              <ShoppingCart className="h-4 w-4" />
              {inCart ? "In cart" : "Add to cart"}
            </Button>
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <Badge variant="secondary">{book.category?.name}</Badge>
            <h1 className="text-3xl font-bold leading-tight">{book.title}</h1>
            <p className="text-lg text-muted-foreground">by {book.author?.name}</p>
            <div className="flex items-center gap-2">
              <StarRating value={Math.round(book.rating)} size={18} />
              <span className="text-sm font-medium">{book.rating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">
                ({book.reviewCount} reviews)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <Layers className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Available</p>
                  <p className="font-semibold">
                    {book.availableCopies} / {book.totalCopies}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Published</p>
                  <p className="font-semibold">{book.publishedYear}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <BookOpen className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Borrowed</p>
                  <p className="font-semibold">{book.borrowCount}x</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold">Description</h2>
            <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
              {book.description}
            </p>
          </div>
        </div>
      </div>

      <ReviewSection bookId={book.id} reviews={book.reviews} />

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
  );
}

export function BookDetailSkeleton() {
  return (
    <div className="grid gap-8 md:grid-cols-[300px_1fr]">
      <Skeleton className="aspect-[3/4] w-full" />
      <div className="space-y-4">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
}
