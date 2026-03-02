import { useState } from 'react';
import { AuthCard } from '../../auth/AuthCard/AuthCard';
import { PasswordInput } from '../../ui/PasswordInput/PasswordInput';
import { Divider } from '../../ui/Divider/Divider';
import { Button } from '../../ui/Button/Button';
import { SocialButton } from '../../auth/SocialButton/SocialButton';
import { useFormValidation } from '../../../hooks/useFormValidation';
import { useAuth } from '../../../hooks/useAuth';
import { isValidEmail, isValidPassword } from '../../../utils/validators';
import { getRememberEmail, saveRememberEmail } from '../../../utils/authStorage';
import styles from './LoginScreen.module.css';

export function LoginScreen({ onNavigateToRegister, onNavigateToForgot }) {
  const { setAuth } = useAuth();
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [shakeCard, setShakeCard] = useState(false);

  const { values, errors, touched, handleChange, handleBlur, isValid } =
    useFormValidation(
      {
        email: getRememberEmail() || '',
        password: '',
      },
      {
        email: [{ test: isValidEmail, message: 'E-mail inválido' }],
        password: [
          { test: isValidPassword, message: 'Mínimo 8 caracteres' },
        ],
      }
    );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValid()) {
      setErrorMessage('Verifique os campos do formulário');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Aqui você faria a chamada real da API para login
      // Por agora, vamos simular um login bem-sucedido
      const user = {
        id: Math.random().toString(36).substring(7),
        email: values.email,
        name: values.email.split('@')[0],
      };

      if (rememberMe) {
        saveRememberEmail(values.email);
      }

      setAuth(user);
    } catch (error) {
      setErrorMessage(error.message || 'Erro ao fazer login');
      setShakeCard(true);
      setTimeout(() => setShakeCard(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <AuthCard className={shakeCard ? styles.shake : ''}>
        <div className={styles.header}>
          <div className={styles.logo}>🧠</div>
          <h1 className={styles.title}>Bem-vindo de volta</h1>
          <p className={styles.subtitle}>
            Sua psicóloga está esperando
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              📧
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="seu@email.com"
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

          <PasswordInput
            label="🔒"
            placeholder="Sua senha"
            name="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.password}
            touched={touched.password}
            disabled={isLoading}
            autoComplete="current-password"
          />

          <div className={styles.footer}>
            <label className={styles.rememberMe}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
              />
              <span>Lembrar-me</span>
            </label>
            <button
              type="button"
              className={styles.linkBtn}
              onClick={onNavigateToForgot}
              disabled={isLoading}
            >
              Esqueci senha
            </button>
          </div>

          {errorMessage && (
            <div className={styles.errorAlert}>{errorMessage}</div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={isLoading}
            aria-label={isLoading ? 'Entrando...' : 'Entrar na Sofia'}
          >
            {isLoading ? '⏳ Entrando...' : 'Entrar na Sofia'}
          </Button>
        </form>

        <Divider />

        <SocialButton
          provider="google"
          text="Entrar com Google"
          disabled={isLoading}
          loading={false}
          onClick={() => {
            // Simular Google OAuth
            setIsLoading(true);
            setTimeout(() => {
              const googleUser = {
                id: 'google_' + Math.random().toString(36).substring(7),
                email: 'usuario' + Math.floor(Math.random() * 1000) + '@gmail.com',
                name: 'Usuário Google',
                provider: 'google',
              };
              setAuth(googleUser);
              setIsLoading(false);
            }, 1500);
          }}
        />

        <p className={styles.switchAuth}>
          Não tem conta?{' '}
          <button
            type="button"
            className={styles.linkBtn}
            onClick={onNavigateToRegister}
            disabled={isLoading}
          >
            Cadastre-se
          </button>
        </p>
      </AuthCard>
    </div>
  );
}
