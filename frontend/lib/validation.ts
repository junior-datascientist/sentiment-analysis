export const MAX_REVIEW_COUNT = 100;
export const MAX_REVIEW_LENGTH = 10000;

export function validateSingleReview(value: string): string {
  const text = value.trim();

  if (!text) {
    throw new Error("Enter a review before predicting.");
  }

  if (text.length > MAX_REVIEW_LENGTH) {
    throw new Error(`A review must be at most ${MAX_REVIEW_LENGTH} characters.`);
  }

  return text;
}

export function validateReviews(values: string[]): string[] {
  const reviews = values
    .map((value) => value.trim())
    .filter((value) => value.length > 0);

  if (reviews.length === 0) {
    throw new Error("Add at least one review before predicting.");
  }

  if (reviews.length > MAX_REVIEW_COUNT) {
    throw new Error(`Submit at most ${MAX_REVIEW_COUNT} reviews at once.`);
  }

  const oversizedReview = reviews.find(
    (review) => review.length > MAX_REVIEW_LENGTH,
  );

  if (oversizedReview) {
    throw new Error(`Each review must be at most ${MAX_REVIEW_LENGTH} characters.`);
  }

  return reviews;
}

export function splitPastedReviews(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}
