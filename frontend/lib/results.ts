import type { PredictionResult, Sentiment, SentimentCounts } from "./types";


export const SENTIMENTS: Sentiment[] = ["Positive", "Negative", "Neutral"];

export function countSentiments(results: PredictionResult[]): SentimentCounts {
  const counts: SentimentCounts = {
    Positive: 0,
    Negative: 0,
    Neutral: 0,
  };

  for (const result of results) {
    counts[result.sentiment] += 1;
  }

  return counts;
}
