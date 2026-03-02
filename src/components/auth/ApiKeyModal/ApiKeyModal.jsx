import { useState } from 'react';
import { Button } from '../../ui/Button/Button';
import { Input } from '../../ui/Input/Input';
import { useAuth } from '../../../hooks/useAuth';
import styles from './ApiKeyModal.module.css';

/**
 * Modal para solicitar Gemini API Key
 */
export function ApiKeyModal({ isOpen, onClose }) {
  const { setAuth, apiKey } = useAuth();
  const [key, setKey] = useState(apiKey || '');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!key.trim()) {
      setError('Digite sua chave API');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simular validação (em produção, validar com teste de chamada)
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Guardar a chave
      setAuth(key);
      setKey('');
      onClose();
    } catch (err) {
      setError(err.message || 'Erro ao validar chave');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Chave Gemini API</h2>
        <p className={styles.description}>
          Para usar Sofia, você precisa de uma chave de API do Google Gemini.
          <br />
          <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.link}
          >
            Obter chave gratuita →
          </a>
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            type="password"
            placeholder="Cole sua chave API aqui"
            value={key}
            onChange={(e) => {
              setKey(e.target.value);
              setError('');
            }}
            disabled={isLoading}
            autoComplete="off"
          />

          {error && <div className={styles.error}>{error}</div>}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={isLoading || !key.trim()}
          >
            {isLoading ? '⏳ Validando...' : 'Continuar'}
          </Button>
        </form>

        <p className={styles.info}>
          ℹ️ Sua chave é armazenada localmente e nunca enviada para nossos servidores.
        </p>
      </div>
    </div>
  );
}
