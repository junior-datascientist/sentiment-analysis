import styles from "./ErrorMessage.module.css";

export default function ErrorMessage({ message }: { message: string }) {
  if (!message) {
    return null;
  }

  return (
    <div className={styles.error} role="alert">
      {message}
    </div>
  );
}
