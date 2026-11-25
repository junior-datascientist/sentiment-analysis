import type { Sentiment } from "@/lib/types";
import styles from "./SentimentBadge.module.css";

const badgeClasses: Record<Sentiment, string> = {
  Positive: styles.positive,
  Negative: styles.negative,
  Neutral: styles.neutral,
};

export default function SentimentBadge({ sentiment }: { sentiment: Sentiment }) {
  return (
    <span className={`${styles.badge} ${badgeClasses[sentiment] ?? styles.neutral}`}>
      {sentiment}
    </span>
  );
}
