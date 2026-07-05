import type { Review, ReviewUser, User } from '@/types';

/** Merge profilePhoto from API, admin user lookup, or logged-in reviewer. */
export function enrichReviewsWithProfilePhotos(
  reviews: Review[],
  currentUser: User | null,
  photoByUserId?: Map<number, string | null>,
): Review[] {
  return reviews.map((review) => {
    if (review.user.profilePhoto) return review;

    const fromMap =
      photoByUserId?.get(review.userId) ?? photoByUserId?.get(review.user.id);
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
  user: ReviewUser & { profile_photo?: string | null },
): ReviewUser {
  return {
    id: user.id,
    name: user.name,
    profilePhoto: user.profilePhoto ?? user.profile_photo ?? null,
  };
}

export function normalizeReview(review: Review & { user: ReviewUser & { profile_photo?: string | null } }): Review {
  return {
    ...review,
    user: normalizeReviewUser(review.user),
  };
}

export function normalizeReviews(reviews: Review[]): Review[] {
  return reviews.map((review) => normalizeReview(review));
}
