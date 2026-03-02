import { useState } from 'react';
import { Input } from '../../ui/Input/Input';
import { Button } from '../../ui/Button/Button';
import styles from './SetupScreen.module.css';

/**
 * Setup screen for API key configuration.
 * User enters Gemini API key to authenticate.
 * @param {function} onSubmit - Callback with API key
 * @param {boolean} isLoading - Show loading state
 * @param {string} error - Error message to display
 */
export function SetupScreen({ onSubmit, isLoading = false, error = '' }) {
  const [apiKey, setApiKey] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError('');

    if (!apiKey.trim()) {
      setLocalError('Por favor, insira sua chave API');
      return;
    }

    onSubmit(apiKey);
  };

  return (
    <div className={styles.container}>
      <div className={styles.background} />

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.logoContainer}>
            <h1 className={styles.logo}>Sofia</h1>
          </div>
          <h2 className={styles.subtitle}>Sua psicóloga virtual IA</h2>
          <p className={styles.description}>
            Um espaço seguro e confidencial para explorar seus pensamentos e emoções.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            label="Chave API do Google Gemini"
            placeholder="Cole sua chave API aqui..."
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            error={localError || error}
            disabled={isLoading}
          />

          <div className={styles.info}>
            <h3 className={styles.infoTitle}>Como obter sua chave API?</h3>
            <ol className={styles.steps}>
              <li>Acesse <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a></li>
              <li>Clique em "Create API Key"</li>
              <li>Copie a chave gerada</li>
              <li>Cole aqui e comece a usar Sofia</li>
            </ol>
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            disabled={isLoading || !apiKey.trim()}
          >
            {isLoading ? 'Conectando...' : 'Começar Conversa'}
          </Button>
        </form>

        <footer className={styles.footer}>
          <p className={styles.disclaimer}>
            Sua chave API é armazenada apenas localmente no seu navegador e nunca é compartilhada com servidores de terceiros, exceto com Google Gemini.
          </p>
        </footer>
      </div>
    </div>
  );
}
