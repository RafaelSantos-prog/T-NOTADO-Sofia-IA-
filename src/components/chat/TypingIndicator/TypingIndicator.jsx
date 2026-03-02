import styles from './TypingIndicator.module.css';

/**
 * Typing indicator component showing Sofia is thinking.
 * Displays three animated dots.
 */
export function TypingIndicator() {
  return (
    <div className={styles.container}>
      <div className={styles.dot} style={{ animationDelay: '0s' }} />
      <div className={styles.dot} style={{ animationDelay: '0.2s' }} />
      <div className={styles.dot} style={{ animationDelay: '0.4s' }} />
    </div>
  );
}
