import { useState } from "react";
import LoadingIndicator from "./LoadingIndicator";
import {
  MAX_REVIEW_COUNT,
  MAX_REVIEW_LENGTH,
  splitPastedReviews,
} from "@/lib/validation";
import styles from "./MultipleReviewsInput.module.css";

interface MultipleReviewsInputProps {
  reviews: string[];
  onReviewsChange: (reviews: string[]) => void;
  pastedText: string;
  onPastedTextChange: (value: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  isLoading: boolean;
}

interface Notice {
  text: string;
  isError: boolean;
}

export default function MultipleReviewsInput({
  reviews,
  onReviewsChange,
  pastedText,
  onPastedTextChange,
  onSubmit,
  onClear,
  isLoading,
}: MultipleReviewsInputProps) {
  const [notice, setNotice] = useState<Notice | null>(null);
  const readyCount = reviews.filter((review) => review.trim().length > 0).length;

  function updateReview(index: number, value: string) {
    setNotice(null);
    onReviewsChange(
      reviews.map((review, reviewIndex) =>
        reviewIndex === index ? value : review,
      ),
    );
  }

  function addReview() {
    setNotice(null);

    if (reviews.length >= MAX_REVIEW_COUNT) {
      setNotice({ text: `You can compare at most ${MAX_REVIEW_COUNT} reviews.`, isError: true });
      return;
    }

    onReviewsChange([...reviews, ""]);
  }

  function removeReview(index: number) {
    setNotice(null);

    if (reviews.length <= 1) {
      onReviewsChange([""]);
      return;
    }

    onReviewsChange(reviews.filter((_, reviewIndex) => reviewIndex !== index));
  }

  function addPastedReviews() {
    const lines = splitPastedReviews(pastedText);

    if (lines.length === 0) {
      setNotice({ text: "Paste at least one review, one per line.", isError: true });
      return;
    }

    const availableSlots = MAX_REVIEW_COUNT - reviews.length;

    if (lines.length > availableSlots) {
      setNotice({
        text: `Only ${availableSlots} review slots are available.`,
        isError: true,
      });
      return;
    }

    onReviewsChange([...reviews, ...lines]);
    onPastedTextChange("");
    setNotice({
      text: `${lines.length} ${lines.length === 1 ? "review" : "reviews"} added from paste.`,
      isError: false,
    });
  }

  function clearAll() {
    setNotice(null);
    onClear();
  }

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className={styles.toolbar}>
        <div>
          <h2>Reviews</h2>
          <p>
            {readyCount} ready · {reviews.length}/{MAX_REVIEW_COUNT} fields
          </p>
        </div>
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={addReview}
          disabled={isLoading || reviews.length >= MAX_REVIEW_COUNT}
        >
          Add review
        </button>
      </div>

      <div className={styles.fields}>
        {reviews.map((review, index) => (
          <div key={index} className={styles.field}>
            <div className={styles.fieldHeader}>
              <label htmlFor={`review-${index}`}>Review {index + 1}</label>
              <span>
                {review.length}/{MAX_REVIEW_LENGTH}
              </span>
            </div>
            <div className={styles.fieldRow}>
              <textarea
                id={`review-${index}`}
                value={review}
                onChange={(event) => updateReview(index, event.target.value)}
                maxLength={MAX_REVIEW_LENGTH}
                rows={3}
                placeholder="Enter a customer review..."
                disabled={isLoading}
              />
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => removeReview(index)}
                disabled={isLoading}
                aria-label={`Remove review ${index + 1}`}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.pastePanel}>
        <div className={styles.pasteHeader}>
          <label htmlFor="bulk-paste">Paste multiple reviews</label>
          <p>Enter one review per line, then add them as fields.</p>
        </div>
        <textarea
          id="bulk-paste"
          value={pastedText}
          onChange={(event) => {
            setNotice(null);
            onPastedTextChange(event.target.value);
          }}
          rows={4}
          placeholder={"The food was excellent.\nThe service was terrible.\nThe restaurant was okay."}
          disabled={isLoading}
        />
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={addPastedReviews}
          disabled={isLoading || pastedText.trim().length === 0}
        >
          Add pasted reviews
        </button>
        {notice && (
          <p
            className={`${styles.notice} ${notice.isError ? styles.noticeError : ""}`}
            role="status"
          >
            {notice.text}
          </p>
        )}
      </div>

      <div className={styles.actions}>
        <button
          type="submit"
          className={styles.primaryButton}
          disabled={isLoading || readyCount === 0}
        >
          {isLoading ? <LoadingIndicator label="Analyzing..." /> : "Predict All"}
        </button>
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={clearAll}
          disabled={
            isLoading ||
            (readyCount === 0 && pastedText.length === 0)
          }
        >
          Clear all
        </button>
      </div>
    </form>
  );
}
