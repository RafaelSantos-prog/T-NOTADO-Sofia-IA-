import { useContext } from 'react';
import { ToastContext } from '../../../context';
import { Toast } from './Toast';
import styles from './ToastContainer.module.css';

/**
 * Container component for displaying toast notifications.
 * Renders all toasts from ToastContext.
 */
export function ToastContainer() {
  const { toasts, removeToast } = useContext(ToastContext);

  return (
    <div className={styles.container} role="region" aria-label="Notifications" aria-live="polite">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
          duration={0}
        />
      ))}
    </div>
  );
}
