import styles from './Input.module.css';

/**
 * Reusable Input component for text input.
 * @param {string} label - Label text
 * @param {string} placeholder - Placeholder text
 * @param {string} type - Input type (default: 'text')
 * @param {string} value - Input value
 * @param {function} onChange - Change handler
 * @param {string} error - Error message
 * @param {boolean} disabled - Disabled state
 * @param {object} restProps - Additional HTML attributes
 */
export function Input({
  label,
  placeholder = '',
  type = 'text',
  value,
  onChange,
  error,
  disabled = false,
  ...restProps
}) {
  return (
    <div className={styles.container}>
      {label && <label className={styles.label}>{label}</label>}
      <input
        type={type}
        className={`${styles.input} ${error ? styles.error : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        {...restProps}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}
