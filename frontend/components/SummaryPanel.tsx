import { countSentiments, SENTIMENTS } from "@/lib/results";
import type { PredictionResult, Sentiment } from "@/lib/types";
import styles from "./SummaryPanel.module.css";

const summaryClasses: Record<Sentiment, string> = {
  Positive: styles.positive,
  Negative: styles.negative,
  Neutral: styles.neutral,
};

export default function SummaryPanel({
  results,
}: {
  results: PredictionResult[];
}) {
  const counts = countSentiments(results);

  return (
    <section className={styles.summary} aria-label="Prediction summary">
      <div className={styles.total}>
        <span>Reviews analyzed</span>
        <strong>{results.length}</strong>
      </div>
      <div className={styles.breakdown}>
        {SENTIMENTS.map((sentiment) => (
          <div key={sentiment} className={styles.count}>
            <span className={`${styles.dot} ${summaryClasses[sentiment]}`} />
            <span>{sentiment}</span>
            <strong>{counts[sentiment]}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
