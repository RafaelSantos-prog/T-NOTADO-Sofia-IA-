import styles from './SocialButton.module.css';

/**
 * Botão de login social (Google)
 */
export function SocialButton({
  provider = 'google',
  text = 'Entrar com Google',
  onClick,
  disabled = false,
  loading = false,
  ...props
}) {
  const getIcon = () => {
    if (provider === 'google') return 'G';
    return '●';
  };

  return (
    <button
      type="button"
      className={styles.button}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={text}
      {...props}
    >
      <span className={styles.icon}>{getIcon()}</span>
      <span className={styles.text}>
        {loading ? 'Conectando...' : text}
      </span>
    </button>
  );
}
