import type { PredictionResult } from "@/lib/types";
import ReviewResultCard from "./ReviewResultCard";
import SummaryPanel from "./SummaryPanel";
import styles from "./ResultsPanel.module.css";

interface ResultsPanelProps {
  results: PredictionResult[];
  title: string;
}

export default function ResultsPanel({ results, title }: ResultsPanelProps) {
  if (results.length === 0) {
    return null;
  }

  return (
    <section className={styles.panel} aria-live="polite">
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>MODEL OUTPUT</p>
          <h2>{title}</h2>
        </div>
        <span className={styles.count}>{results.length} analyzed</span>
      </div>

      <SummaryPanel results={results} />

      <div className={styles.results}>
        {results.map((result, index) => (
          <ReviewResultCard key={`${index}-${result.text}`} index={index + 1} result={result} />
        ))}
      </div>
    </section>
  );
}
