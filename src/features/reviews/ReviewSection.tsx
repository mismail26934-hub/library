import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useAppSelector } from "@/app/hooks";
import { useAddReview, useDeleteReview } from "./useReviews";
import { StarRating } from "@/components/StarRating";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/states";
import { formatDate, getInitials } from "@/lib/utils";
import type { Review } from "@/types";
import { toast } from "sonner";

export function ReviewSection({ bookId, reviews }: { bookId: number; reviews: Review[] }) {
  const user = useAppSelector((s) => s.auth.user);
  const token = useAppSelector((s) => s.auth.token);
  const addReview = useAddReview(bookId);
  const deleteReview = useDeleteReview(bookId);

  const [star, setStar] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }
    addReview.mutate(
      { bookId, star, comment: comment.trim() },
      {
        onSuccess: () => {
          setComment("");
          setStar(5);
        },
      },
    );
  };

  return (
    <section className="space-y-5">
      <h2 className="text-xl font-bold">Reviews ({reviews.length})</h2>

      {token && (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Your rating:</span>
                <StarRating value={star} onChange={setStar} readOnly={false} size={22} />
              </div>
              <Textarea
                placeholder="Share your thoughts about this book..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <div className="flex justify-end">
                <Button type="submit" loading={addReview.isPending}>
                  Submit review
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {reviews.length === 0 ? (
        <EmptyState title="No reviews yet" description="Be the first to review this book." />
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-9 w-9" fallback={getInitials(review.user?.name)} />
                    <div>
                      <p className="font-medium">{review.user?.name}</p>
                      <div className="flex items-center gap-2">
                        <StarRating value={review.star} size={14} />
                        <span className="text-xs text-muted-foreground">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  {user?.id === review.userId && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteReview.mutate(review.id)}
                      title="Delete review"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {review.comment}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
