import styles from './Button.module.css';

/**
 * Reusable Button component with multiple variants.
 * @param {string} variant - 'primary' | 'secondary' | 'ghost' (default: 'primary')
 * @param {string} size - 'sm' | 'md' | 'lg' (default: 'md')
 * @param {boolean} isLoading - Shows loading state
 * @param {boolean} disabled - Disables button
 * @param {function} onClick - Click handler
 * @param {React.ReactNode} children - Button content
 * @param {object} className - Additional CSS classes
 */
export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  onClick,
  children,
  className = '',
  ...restProps
}) {
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    isLoading && styles.loading,
    disabled && styles.disabled,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classes}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...restProps}
    >
      {isLoading ? (
        <span className={styles.spinner} aria-hidden="true" />
      ) : (
        children
      )}
    </button>
  );
}
