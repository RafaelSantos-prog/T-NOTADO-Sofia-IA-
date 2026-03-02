import styles from './OnboardingStep.module.css';

/**
 * Card de cada etapa do onboarding
 */
export function OnboardingStep({
  icon,
  title,
  description,
  children,
  className = '',
  ...props
}) {
  return (
    <div className={`${styles.step} ${className}`} {...props}>
      {icon && <div className={styles.icon}>{icon}</div>}
      {title && <h1 className={styles.title}>{title}</h1>}
      {description && <p className={styles.description}>{description}</p>}
      {children && <div className={styles.content}>{children}</div>}
    </div>
  );
}
