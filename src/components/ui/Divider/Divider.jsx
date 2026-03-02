import styles from './Divider.module.css';

/**
 * Divisor com texto "ou continue com"
 */
export function Divider({ text = 'ou continue com' }) {
  return (
    <div className={styles.divider}>
      <div className={styles.line}></div>
      <span className={styles.text}>{text}</span>
      <div className={styles.line}></div>
    </div>
  );
}
