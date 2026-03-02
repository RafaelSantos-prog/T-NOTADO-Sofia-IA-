import { useState } from 'react';
import styles from './PasswordInput.module.css';

/**
 * Input de senha com toggle mostrar/ocultar
 */
export function PasswordInput({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  touched,
  disabled = false,
  autoComplete = 'password',
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.container}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.inputWrapper}>
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`${styles.input} ${error && touched ? styles.error : ''}`}
          {...props}
        />
        <button
          type="button"
          className={styles.toggleBtn}
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          tabIndex={-1}
        >
          {showPassword ? '🙈' : '👁'}
        </button>
      </div>
      {error && touched && <span className={styles.errorMsg}>{error}</span>}
    </div>
  );
}
