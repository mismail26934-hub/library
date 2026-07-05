import type { Review, ReviewUser, User } from '@/types';

/** Merge profilePhoto from API, admin user lookup, or logged-in reviewer. */
export function enrichReviewsWithProfilePhotos(
  reviews: Review[],
  currentUser: User | null,
  photoByUserId?: Map<number, string | null>,
): Review[] {
  return reviews.map((review) => {
    if (review.user?.profilePhoto) return review;

    const fromMap =
      photoByUserId?.get(review.userId) ??
      (review.user ? photoByUserId?.get(review.user.id) : undefined);
    if (fromMap) {
      return { ...review, user: { ...review.user, profilePhoto: fromMap } };
    }

    if (
      currentUser?.profilePhoto &&
      Number(review.userId) === Number(currentUser.id)
    ) {
      return {
        ...review,
        user: { ...review.user, profilePhoto: currentUser.profilePhoto },
      };
    }

    return review;
  });
}

export function normalizeReviewUser(
  user: (ReviewUser & { profile_photo?: string | null }) | undefined | null,
): ReviewUser {
  if (!user) {
    return { id: 0, name: "User", profilePhoto: null };
  }
  return {
    id: user.id,
    name: user.name,
    profilePhoto: user.profilePhoto ?? user.profile_photo ?? null,
  };
}

export function normalizeReview(
  review: Review & { user?: ReviewUser & { profile_photo?: string | null } },
): Review {
  return {
    ...review,
    user: normalizeReviewUser(review.user),
  };
}

/** Fill missing nested user when create-review API omits it. */
export function ensureReviewUser(review: Review, currentUser: User | null): Review {
  if (review.user) return normalizeReview(review);

  return normalizeReview({
    ...review,
    user: {
      id: review.userId ?? currentUser?.id ?? 0,
      name: currentUser?.name ?? "User",
      profilePhoto: currentUser?.profilePhoto ?? null,
    },
  });
}

export function normalizeReviews(reviews: Review[]): Review[] {
  return reviews.map((review) => normalizeReview(review));
}
