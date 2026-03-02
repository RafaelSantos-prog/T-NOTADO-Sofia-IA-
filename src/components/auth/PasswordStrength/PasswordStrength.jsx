import { usePasswordStrength } from '../../../hooks/usePasswordStrength';
import styles from './PasswordStrength.module.css';

/**
 * Indicador visual de força da senha
 */
export function PasswordStrength({ password }) {
  const { score, label, color, percent } = usePasswordStrength(password);

  if (!password) return null;

  return (
    <div className={styles.container}>
      <div className={styles.bar}>
        <div
          className={styles.fill}
          style={{
            width: `${percent}%`,
            backgroundColor: color,
          }}
        ></div>
      </div>
      <span className={styles.label} style={{ color }}>
        Força: {label}
      </span>
    </div>
  );
}
