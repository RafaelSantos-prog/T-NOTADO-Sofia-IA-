import { useEffect } from 'react';
import styles from './Toast.module.css';

/**
 * Toast notification component.
 * @param {string} message - Toast message text
 * @param {string} type - 'info' | 'success' | 'error' | 'warning' (default: 'info')
 * @param {function} onClose - Callback when closing
 * @param {number} duration - Auto-close duration in ms (0 to disable)
 */
export function Toast({ message, type = 'info', onClose, duration = 5000 }) {
  useEffect(() => {
    if (duration <= 0) return;

    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icon = {
    info: '✓',
    success: '✓',
    error: '✕',
    warning: '⚠',
  }[type];

  return (
    <div className={`${styles.toast} ${styles[type]}`} role="alert">
      <span className={styles.icon}>{icon}</span>
      <span className={styles.message}>{message}</span>
      <button
        className={styles.close}
        onClick={onClose}
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  );
}
