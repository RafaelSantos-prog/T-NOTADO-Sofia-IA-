import { createContext, useState, useCallback } from 'react';

/**
 * ToastContext for global toast notifications.
 * Manages notification queue and display.
 */
export const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = crypto.randomUUID();
    const toast = { id, message, type };

    setToasts((prev) => [...prev, toast]);

    if (duration > 0) {
      const timeout = setTimeout(() => {
        removeToast(id);
      }, duration);

      return () => clearTimeout(timeout);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = {
    toasts,
    addToast,
    removeToast,
  };

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}
