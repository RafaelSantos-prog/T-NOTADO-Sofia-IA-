import { useState } from 'react';
import { AuthCard } from '../../auth/AuthCard/AuthCard';
import { PasswordInput } from '../../ui/PasswordInput/PasswordInput';
import { PasswordStrength } from '../../auth/PasswordStrength/PasswordStrength';
import { Button } from '../../ui/Button/Button';
import { useFormValidation } from '../../../hooks/useFormValidation';
import { useAuth } from '../../../hooks/useAuth';
import {
  isValidEmail,
  isValidName,
  isValidAge,
  isValidPassword,
  passwordsMatch,
} from '../../../utils/validators';
import styles from './RegisterScreen.module.css';

export function RegisterScreen({ onNavigateToLogin }) {
  const { setAuth } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Step 1 - Personal Data
  const { values: step1Values, errors: step1Errors, touched: step1Touched, handleChange: handleStep1Change, handleBlur: handleStep1Blur, isValid: isStep1Valid } =
    useFormValidation(
      {
        name: '',
        email: '',
        age: '',
      },
      {
        name: [{ test: isValidName, message: 'Mínimo 2 caracteres' }],
        email: [{ test: isValidEmail, message: 'E-mail inválido' }],
        age: [{ test: isValidAge, message: 'Idade entre 13 e 120' }],
      }
    );

  // Step 2 - Security
  const { values: step2Values, errors: step2Errors, touched: step2Touched, handleChange: handleStep2Change, handleBlur: handleStep2Blur, isValid: isStep2Valid } =
    useFormValidation(
      {
        password: '',
        confirmPassword: '',
      },
      {
        password: [
          { test: isValidPassword, message: 'Mínimo 8 caracteres' },
        ],
        confirmPassword: [
          {
            test: (v) => passwordsMatch(step2Values.password, v),
            message: 'Senhas não correspondem',
          },
        ],
      }
    );

  const handleStep1Submit = (e) => {
    e.preventDefault();
    if (isStep1Valid()) {
      setStep(2);
      setErrorMessage('');
    } else {
      setErrorMessage('Verifique os campos do formulário');
    }
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();

    if (!isStep2Valid()) {
      setErrorMessage('Passwords não correspondem');
      return;
    }

    if (!termsAccepted) {
      setErrorMessage('Você deve aceitar os termos de uso');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Aqui você faria a chamada real da API para registrar
      const user = {
        id: Math.random().toString(36).substring(7),
        email: step1Values.email,
        name: step1Values.name,
        age: step1Values.age,
      };

      setAuth(user);
    } catch (error) {
      setErrorMessage(error.message || 'Erro ao criar conta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <AuthCard>
        <div className={styles.header}>
          <div className={styles.logo}>🧠</div>
          <h1 className={styles.title}>Crie sua conta</h1>
          <div className={styles.progress}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${step === 1 ? 50 : 100}%` }}
              ></div>
            </div>
            <span className={styles.progressText}>
              Etapa {step} de 2
            </span>
          </div>
        </div>

        {step === 1 ? (
          <form onSubmit={handleStep1Submit} className={styles.form}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="name"
                placeholder="👤 Seu nome completo"
                value={step1Values.name}
                onChange={handleStep1Change}
                onBlur={handleStep1Blur}
                disabled={isLoading}
                autoComplete="name"
                className={`${styles.input} ${
                  step1Errors.name && step1Touched.name ? styles.error : ''
                }`}
              />
              {step1Errors.name && step1Touched.name && (
                <span className={styles.errorMsg}>{step1Errors.name}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <input
                type="email"
                name="email"
                placeholder="📧 seu@email.com"
                value={step1Values.email}
                onChange={handleStep1Change}
                onBlur={handleStep1Blur}
                disabled={isLoading}
                autoComplete="email"
                className={`${styles.input} ${
                  step1Errors.email && step1Touched.email ? styles.error : ''
                }`}
              />
              {step1Errors.email && step1Touched.email && (
                <span className={styles.errorMsg}>{step1Errors.email}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <input
                type="number"
                name="age"
                placeholder="🎂 Sua idade"
                value={step1Values.age}
                onChange={handleStep1Change}
                onBlur={handleStep1Blur}
                disabled={isLoading}
                min="13"
                max="120"
                className={`${styles.input} ${
                  step1Errors.age && step1Touched.age ? styles.error : ''
                }`}
              />
              {step1Errors.age && step1Touched.age && (
                <span className={styles.errorMsg}>{step1Errors.age}</span>
              )}
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
            >
              Continuar →
            </Button>
          </form>
        ) : (
          <form onSubmit={handleStep2Submit} className={styles.form}>
            <PasswordInput
              label="🔒 Crie uma senha"
              placeholder="Mínimo 8 caracteres"
              name="password"
              value={step2Values.password}
              onChange={handleStep2Change}
              onBlur={handleStep2Blur}
              error={step2Errors.password}
              touched={step2Touched.password}
              disabled={isLoading}
              autoComplete="new-password"
            />

            <PasswordStrength password={step2Values.password} />

            <PasswordInput
              label="🔒 Confirme a senha"
              placeholder="Repita sua senha"
              name="confirmPassword"
              value={step2Values.confirmPassword}
              onChange={handleStep2Change}
              onBlur={handleStep2Blur}
              error={step2Errors.confirmPassword}
              touched={step2Touched.confirmPassword}
              disabled={isLoading}
              autoComplete="new-password"
            />

            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                disabled={isLoading}
              />
              <span>
                Li e aceito os{' '}
                <a href="#" onClick={(e) => e.preventDefault()}>
                  Termos de Uso
                </a>
              </span>
            </label>

            {errorMessage && (
              <div className={styles.errorAlert}>{errorMessage}</div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={isLoading || !termsAccepted}
            >
              {isLoading ? '⏳ Criando conta...' : '🧠 Criar minha conta'}
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="lg"
              fullWidth
              onClick={() => setStep(1)}
              disabled={isLoading}
            >
              ← Voltar
            </Button>
          </form>
        )}

        <p className={styles.switchAuth}>
          Já tem conta?{' '}
          <button
            type="button"
            className={styles.linkBtn}
            onClick={onNavigateToLogin}
            disabled={isLoading}
          >
            Login
          </button>
        </p>
      </AuthCard>
    </div>
  );
}
