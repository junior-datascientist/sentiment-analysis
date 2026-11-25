import LoadingIndicator from "./LoadingIndicator";
import { MAX_REVIEW_LENGTH } from "@/lib/validation";
import styles from "./SingleReviewInput.module.css";

interface SingleReviewInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  isLoading: boolean;
}

export default function SingleReviewInput({
  value,
  onChange,
  onSubmit,
  onClear,
  isLoading,
}: SingleReviewInputProps) {
  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className={styles.fieldHeader}>
        <label htmlFor="single-review">Review text</label>
        <span>
          {value.length}/{MAX_REVIEW_LENGTH}
        </span>
      </div>

      <textarea
        id="single-review"
        className={styles.textarea}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={MAX_REVIEW_LENGTH}
        rows={10}
        placeholder="The food was excellent and the service was amazing..."
        disabled={isLoading}
      />

      <div className={styles.actions}>
        <button
          type="submit"
          className={styles.primaryButton}
          disabled={isLoading || value.trim().length === 0}
        >
          {isLoading ? <LoadingIndicator label="Analyzing..." /> : "Predict Sentiment"}
        </button>
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={onClear}
          disabled={isLoading || value.length === 0}
        >
          Clear
        </button>
      </div>
    </form>
  );
}
