import type { PredictionResult } from "@/lib/types";
import SentimentBadge from "./SentimentBadge";
import styles from "./ReviewResultCard.module.css";

interface ReviewResultCardProps {
  index: number;
  result: PredictionResult;
}

export default function ReviewResultCard({
  index,
  result,
}: ReviewResultCardProps) {
  const confidence = result.confidence;

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <span className={styles.index}>#{index}</span>
        <SentimentBadge sentiment={result.sentiment} />
      </div>
      <p className={styles.text}>{result.text}</p>
      {typeof confidence === "number" && (
        <p className={styles.confidence}>
          Confidence <strong>{(confidence * 100).toFixed(2)}%</strong>
        </p>
      )}
    </article>
  );
}
