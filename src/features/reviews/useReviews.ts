import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAppSelector } from "@/app/hooks";
import { enrichReviewsWithProfilePhotos, ensureReviewUser, normalizeReview, normalizeReviews } from "./reviewUser";
import { adminApi, reviewsApi, type MyReviewsQuery, type ReviewPayload } from "@/lib/api-endpoints";
import { getApiErrorMessage } from "@/lib/axios";
import { qk } from "@/lib/query-keys";
import type { BookDetail, Review } from "@/types";

export function useBookReviews(bookId: number | string) {
  return useQuery({
    queryKey: qk.reviews(bookId),
    queryFn: async () => {
      const data = await reviewsApi.byBook(bookId);
      return { ...data, reviews: normalizeReviews(data.reviews) };
    },
    enabled: !!bookId,
  });
}

export interface ReviewerRef {
  userId: number;
  name: string;
}

/** Resolve reviewer avatars via admin user list when review API omits profilePhoto. */
export function useReviewerPhotos(reviewers: ReviewerRef[]) {
  const authUser = useAppSelector((s) => s.auth.user);
  const isAdmin = authUser?.role === "ADMIN";
  const uniqueReviewers = useMemo(() => {
    const seen = new Set<number>();
    return reviewers.filter(({ userId }) => {
      if (userId <= 0 || seen.has(userId)) return false;
      seen.add(userId);
      return true;
    });
  }, [reviewers]);
  const reviewerKey = useMemo(
    () => uniqueReviewers.map((r) => r.userId).sort((a, b) => a - b),
    [uniqueReviewers],
  );

  return useQuery({
    queryKey: ["reviewer-photos", reviewerKey] as const,
    queryFn: async () => {
      const map = new Map<number, string | null>();
      const needed = new Map(uniqueReviewers.map((r) => [r.userId, r.name]));

      for (const [userId, name] of [...needed.entries()]) {
        const { users } = await adminApi.users({ page: 1, limit: 10, q: name });
        const match = users.find((user) => user.id === userId);
        if (match?.profilePhoto) {
          map.set(userId, match.profilePhoto);
          needed.delete(userId);
        }
      }

      let page = 1;
      while (needed.size > 0) {
        const { users, pagination } = await adminApi.users({ page, limit: 50 });
        for (const user of users) {
          if (needed.has(user.id) && user.profilePhoto) {
            map.set(user.id, user.profilePhoto);
            needed.delete(user.id);
          }
        }
        if (page >= pagination.totalPages) break;
        page += 1;
      }

      return map;
    },
    enabled: isAdmin && uniqueReviewers.length > 0,
    staleTime: 1000 * 60 * 5,
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
  const currentUser = useAppSelector((s) => s.auth.user);

  return useMutation({
    mutationFn: (payload: ReviewPayload) => reviewsApi.create(payload),
    onSuccess: (review) => {
      if (!review?.id) {
        toast.success("Review submitted");
        qc.invalidateQueries({ queryKey: qk.reviews(bookId) });
        qc.invalidateQueries({ queryKey: qk.book(bookId) });
        qc.invalidateQueries({ queryKey: ["my-reviews"] });
        return;
      }

      const normalized = currentUser
        ? ensureReviewUser(review, currentUser)
        : normalizeReview(review);
      const enriched = enrichReviewsWithProfilePhotos([normalized], currentUser)[0];

      qc.setQueryData<{ reviews: Review[] } | undefined>(qk.reviews(bookId), (old) => {
        if (!old) return old;
        const exists = old.reviews.some((r) => r.id === enriched.id);
        return {
          ...old,
          reviews: exists
            ? old.reviews.map((r) => (r.id === enriched.id ? enriched : r))
            : [enriched, ...old.reviews],
        };
      });

      qc.setQueryData<BookDetail | undefined>(qk.book(bookId), (old) => {
        if (!old) return old;
        const exists = old.reviews.some((r) => r.id === enriched.id);
        const reviews = exists
          ? old.reviews.map((r) => (r.id === enriched.id ? enriched : r))
          : [enriched, ...old.reviews];
        return { ...old, reviews, reviewCount: exists ? old.reviewCount : old.reviewCount + 1 };
      });

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
