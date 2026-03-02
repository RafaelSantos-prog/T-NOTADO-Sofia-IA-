import { useState } from 'react';
import { AuthCard } from '../../auth/AuthCard/AuthCard';
import { Button } from '../../ui/Button/Button';
import { useFormValidation } from '../../../hooks/useFormValidation';
import { isValidEmail } from '../../../utils/validators';
import styles from './ForgotPasswordScreen.module.css';

export function ForgotPasswordScreen({ onNavigateToLogin }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const { values, errors, touched, handleChange, handleBlur, isValid } =
    useFormValidation(
      { email: '' },
      {
        email: [{ test: isValidEmail, message: 'E-mail inválido' }],
      }
    );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValid()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Aqui você faria a chamada real da API para enviar email
      setIsSubmitted(true);
      setCountdown(60);

      // Decrement countdown
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCountdown(60);

      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <AuthCard>
        {!isSubmitted ? (
          <>
            <div className={styles.header}>
              <div className={styles.icon}>✉️</div>
              <h1 className={styles.title}>Recuperar acesso</h1>
              <p className={styles.description}>
                Digite seu e-mail e enviaremos um link de recuperação
              </p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <input
                  type="email"
                  name="email"
                  placeholder="📧 seu@email.com"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isLoading}
                  autoComplete="email"
                  className={`${styles.input} ${
                    errors.email && touched.email ? styles.error : ''
                  }`}
                />
                {errors.email && touched.email && (
                  <span className={styles.errorMsg}>{errors.email}</span>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={isLoading}
              >
                {isLoading ? '⏳ Enviando...' : 'Enviar link →'}
              </Button>
            </form>

            <button
              type="button"
              className={styles.backBtn}
              onClick={onNavigateToLogin}
              disabled={isLoading}
            >
              ← Voltar para o Login
            </button>
          </>
        ) : (
          <>
            <div className={styles.header}>
              <div className={`${styles.icon} ${styles.success}`}>✅</div>
              <h1 className={styles.title}>E-mail enviado!</h1>
              <p className={styles.description}>
                Verifique sua caixa de entrada e a pasta de spam
              </p>
            </div>

            <div className={styles.successMessage}>
              <p>Um link de recuperação foi enviado para:</p>
              <p className={styles.email}>{values.email}</p>
            </div>

            {countdown > 0 ? (
              <p className={styles.retryMessage}>
                Reenviar em: <strong>{countdown}s</strong>
              </p>
            ) : (
              <Button
                type="button"
                variant="secondary"
                size="lg"
                fullWidth
                onClick={handleResend}
                disabled={isLoading}
              >
                Reenviar link
              </Button>
            )}

            <button
              type="button"
              className={styles.backBtn}
              onClick={onNavigateToLogin}
            >
              ← Voltar para o Login
            </button>
          </>
        )}
      </AuthCard>
    </div>
  );
}
