import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { reviewsApi, type MyReviewsQuery, type ReviewPayload } from "@/lib/api-endpoints";
import { getApiErrorMessage } from "@/lib/axios";
import { qk } from "@/lib/query-keys";
import type { BookDetail, Review } from "@/types";

export function useBookReviews(bookId: number | string) {
  return useQuery({
    queryKey: qk.reviews(bookId),
    queryFn: () => reviewsApi.byBook(bookId),
    enabled: !!bookId,
  });
}

export function useMyReviews(params: MyReviewsQuery) {
  return useQuery({
    queryKey: qk.myReviews(params),
    queryFn: () => reviewsApi.mine(params),
  });
}

export function useAddReview(bookId: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReviewPayload) => reviewsApi.create(payload),
    onSuccess: () => {
      toast.success("Review submitted");
      qc.invalidateQueries({ queryKey: qk.reviews(bookId) });
      qc.invalidateQueries({ queryKey: qk.book(bookId) });
      qc.invalidateQueries({ queryKey: ["my-reviews"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Failed to submit review")),
  });
}

export function useDeleteReview(bookId: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => reviewsApi.remove(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: qk.reviews(bookId) });
      const prevReviews = qc.getQueryData<{ reviews: Review[] }>(qk.reviews(bookId));
      const prevBook = qc.getQueryData<BookDetail>(qk.book(bookId));

      qc.setQueryData<{ reviews: Review[] } | undefined>(qk.reviews(bookId), (old) =>
        old ? { ...old, reviews: old.reviews.filter((r) => r.id !== id) } : old,
      );
      qc.setQueryData<BookDetail | undefined>(qk.book(bookId), (old) =>
        old ? { ...old, reviews: old.reviews.filter((r) => r.id !== id) } : old,
      );

      return { prevReviews, prevBook };
    },
    onError: (error, _id, ctx) => {
      if (ctx?.prevReviews) qc.setQueryData(qk.reviews(bookId), ctx.prevReviews);
      if (ctx?.prevBook) qc.setQueryData(qk.book(bookId), ctx.prevBook);
      toast.error(getApiErrorMessage(error, "Failed to delete review"));
    },
    onSuccess: () => toast.success("Review deleted"),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: qk.reviews(bookId) });
      qc.invalidateQueries({ queryKey: qk.book(bookId) });
      qc.invalidateQueries({ queryKey: ["my-reviews"] });
    },
  });
}
