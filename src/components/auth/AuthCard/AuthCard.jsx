import styles from './AuthCard.module.css';

/**
 * Card base reutilizado em todas as telas de autenticação
 */
export function AuthCard({
  children,
  className = '',
  ...props
}) {
  return (
    <div className={`${styles.card} ${className}`} {...props}>
      {children}
    </div>
  );
}
