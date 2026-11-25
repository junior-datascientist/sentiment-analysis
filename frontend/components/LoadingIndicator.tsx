import styles from "./LoadingIndicator.module.css";

export default function LoadingIndicator({ label }: { label: string }) {
  return (
    <span className={styles.loading}>
      <span className={styles.spinner} aria-hidden="true" />
      {label}
    </span>
  );
}
