import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <p className={styles.eyebrow}>NLP MODEL DEMO</p>
      <h1 className={styles.title}>Sentiment Analysis</h1>
      <p className={styles.subtitle}>
        An NLP-powered application for classifying customer reviews into Positive,
        Negative and Neutral sentiments.
      </p>
    </header>
  );
}
