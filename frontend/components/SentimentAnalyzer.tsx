"use client";

import { useState } from "react";
import ErrorMessage from "./ErrorMessage";
import Header from "./Header";
import ModeTabs, { type AnalysisMode } from "./ModeTabs";
import MultipleReviewsInput from "./MultipleReviewsInput";
import ResultsPanel from "./ResultsPanel";
import SingleReviewInput from "./SingleReviewInput";
import { predictSentiment } from "@/lib/sentimentApi";
import type { PredictionPayload, PredictionResult } from "@/lib/types";
import {
  validateReviews,
  validateSingleReview,
} from "@/lib/validation";
import styles from "./SentimentAnalyzer.module.css";

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong.";
}

export default function SentimentAnalyzer() {
  const [mode, setMode] = useState<AnalysisMode>("single");
  const [singleReview, setSingleReview] = useState("");
  const [reviews, setReviews] = useState<string[]>([""]);
  const [pastedText, setPastedText] = useState("");
  const [results, setResults] = useState<PredictionResult[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function changeMode(nextMode: AnalysisMode) {
    if (isLoading || nextMode === mode) {
      return;
    }

    setMode(nextMode);
    setError("");
    setResults([]);
  }

  async function runPrediction(payload: PredictionPayload) {
    setError("");
    setResults([]);
    setIsLoading(true);

    try {
      const response = await predictSentiment(payload);
      setResults(response.results);
    } catch (predictionError) {
      setError(getErrorMessage(predictionError));
    } finally {
      setIsLoading(false);
    }
  }

  function predictSingleReview() {
    try {
      const text = validateSingleReview(singleReview);
      void runPrediction({ text });
    } catch (validationError) {
      setResults([]);
      setError(getErrorMessage(validationError));
    }
  }

  function predictMultipleReviews() {
    try {
      const texts = validateReviews(reviews);
      void runPrediction({ texts });
    } catch (validationError) {
      setResults([]);
      setError(getErrorMessage(validationError));
    }
  }

  function clearSingleReview() {
    setSingleReview("");
    setResults([]);
    setError("");
  }

  function clearMultipleReviews() {
    setReviews([""]);
    setPastedText("");
    setResults([]);
    setError("");
  }

  return (
    <main className={styles.page}>
      <Header />

      <section className={styles.workspace} aria-label="Sentiment analysis workspace">
        <div className={styles.intro}>
          <p>
            Enter one review for a quick prediction, or switch to multiple reviews to
            compare several at once. All reviews are sent to the trained model in a
            single request.
          </p>
          <span className={styles.modelTag}>TF-IDF · Logistic Regression</span>
        </div>

        <ModeTabs mode={mode} disabled={isLoading} onChange={changeMode} />
        <ErrorMessage message={error} />

        <div className={styles.inputArea}>
          {mode === "single" ? (
            <SingleReviewInput
              value={singleReview}
              onChange={setSingleReview}
              onSubmit={predictSingleReview}
              onClear={clearSingleReview}
              isLoading={isLoading}
            />
          ) : (
            <MultipleReviewsInput
              reviews={reviews}
              onReviewsChange={setReviews}
              pastedText={pastedText}
              onPastedTextChange={setPastedText}
              onSubmit={predictMultipleReviews}
              onClear={clearMultipleReviews}
              isLoading={isLoading}
            />
          )}
        </div>

        <ResultsPanel
          results={results}
          title={mode === "single" ? "Prediction result" : "Prediction results"}
        />
      </section>

      <footer className={styles.footer}>
        Powered by the trained scikit-learn model served through a Flask REST API.
      </footer>
    </main>
  );
}
