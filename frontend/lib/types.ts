export type Sentiment = "Positive" | "Negative" | "Neutral";

export interface PredictionResult {
  text: string;
  sentiment: Sentiment;
  confidence?: number;
}

export interface PredictionResponse {
  success: boolean;
  count: number;
  results: PredictionResult[];
}

export interface ApiErrorResponse {
  success: false;
  error: string;
}

export interface SinglePredictionPayload {
  text: string;
}

export interface MultiplePredictionPayload {
  texts: string[];
}

export type PredictionPayload = SinglePredictionPayload | MultiplePredictionPayload;

export type SentimentCounts = Record<Sentiment, number>;
