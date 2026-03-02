import { useContext, useState } from 'react';
import { AuthContext, ToastContext } from '../../../context';
import { saveSupportCheckIn } from '../../../utils/authStorage';
import styles from './SupportScreen.module.css';

/**
 * Support Dashboard Screen
 * Provides self-assessment, mental health information, and resources
 */
export function SupportScreen({ onContinueToChat }) {
  const { user, logout } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  
  const [selectedMood, setSelectedMood] = useState(null);
  const [activeTab, setActiveTab] = useState('check-in'); // check-in, info, resources

  const moods = [
    { id: 'excellent', label: 'Excelente', emoji: '😄', color: '#10b981' },
    { id: 'good', label: 'Bem', emoji: '🙂', color: '#3b82f6' },
    { id: 'neutral', label: 'Neutro', emoji: '😐', color: '#f59e0b' },
    { id: 'sad', label: 'Triste', emoji: '😔', color: '#ef4444' },
    { id: 'anxious', label: 'Ansioso', emoji: '😰', color: '#8b5cf6' },
  ];

  const mentalHealthTips = [
    {
      title: 'Respiração Consciente',
      description: 'Pratique respiração profunda: inspire por 4 contagens, segure por 4, expire por 4.',
      icon: '🫁',
    },
    {
      title: 'Movimento Diário',
      description: 'Caminhar, dançar ou alongar por 10-15 minutos melhora o humor naturalmente.',
      icon: '🚶',
    },
    {
      title: 'Conexões Sociais',
      description: 'Conversar com amigos ou família é fundamental para seu bem-estar emocional.',
      icon: '👥',
    },
    {
      title: 'Rotina de Sono',
      description: 'Dormir 7-9 horas regularmente estabiliza seu estado emocional.',
      icon: '😴',
    },
    {
      title: 'Autocuidado',
      description: 'Reserve tempo para atividades que te trazem alegria e paz.',
      icon: '🧘',
    },
    {
      title: 'Limite de Telas',
      description: 'Reduza tempo em redes sociais para evitar comparações e ansiedade.',
      icon: '📱',
    },
  ];

  const crisisResources = [
    {
      title: 'Alguém para Conversar',
      description: 'Sofia está aqui 24/7 para escutar e apoiar você.',
      action: 'Conversar Agora',
      priority: 'primary',
    },
    {
      title: 'CVV - Centro de Valorização da Vida',
      description: 'Atendimento voluntário gratuito: 188 (ligação gratuita)',
      link: 'https://www.cvv.org.br',
      action: 'Mais Informações',
    },
    {
      title: 'Disque 188',
      description: 'Prevenção do suicídio - Ligação gratuita disponível 24h',
      action: 'Ligar',
    },
    {
      title: 'Atendimento de Crise',
      description: 'Se você está em risco imediato, procure um pronto-socorro ou ligue 192.',
      action: 'Emergência',
      priority: 'danger',
    },
  ];

  const handleMoodSelect = (moodId) => {
    setSelectedMood(moodId);
    const moodData = moods.find(m => m.id === moodId);
    
    // Save check-in
    saveSupportCheckIn({
      timestamp: new Date().toISOString(),
      mood: moodId,
      moodLabel: moodData.label,
    });

    addToast(`Registrado: Você está se sentindo ${moodData.label.toLowerCase()}`, 'success', 3000);
  };

  const handleContinue = () => {
    if (!selectedMood) {
      addToast('Por favor, selecione como você está se sentindo', 'warning', 3000);
      return;
    }
    onContinueToChat();
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Bem-vindo, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className={styles.subtitle}>Seu espaço seguro para bem-estar mental</p>
        </div>
        <button
          className={styles.logoutBtn}
          onClick={logout}
          title="Sair"
        >
          🚪
        </button>
      </header>

      {/* Content */}
      <main className={styles.content}>
        {/* Check-in Tab */}
        <div className={`${styles.section} ${activeTab === 'check-in' ? styles.active : ''}`}>
          <div className={styles.checkIn}>
            <h2>Como você está se sentindo hoje?</h2>
            <p className={styles.description}>
              Seu check-in diário nos ajuda a personalizar melhor o suporte
            </p>

            <div className={styles.moodGrid}>
              {moods.map((mood) => (
                <button
                  key={mood.id}
                  className={`${styles.moodButton} ${selectedMood === mood.id ? styles.selected : ''}`}
                  onClick={() => handleMoodSelect(mood.id)}
                  style={selectedMood === mood.id ? { borderColor: mood.color } : {}}
                >
                  <span className={styles.emoji}>{mood.emoji}</span>
                  <span className={styles.label}>{mood.label}</span>
                </button>
              ))}
            </div>

            {selectedMood && (
              <div className={styles.selectedMood}>
                <p>
                  ✓ Status registrado: <strong>{moods.find(m => m.id === selectedMood)?.label}</strong>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Info Tab */}
        <div className={`${styles.section} ${activeTab === 'info' ? styles.active : ''}`}>
          <div className={styles.mentalHealthInfo}>
            <h2>Dicas para Bem-estar Mental</h2>
            <div className={styles.tipsGrid}>
              {mentalHealthTips.map((tip, idx) => (
                <div key={idx} className={styles.tipCard}>
                  <div className={styles.tipIcon}>{tip.icon}</div>
                  <h3>{tip.title}</h3>
                  <p>{tip.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resources Tab */}
        <div className={`${styles.section} ${activeTab === 'resources' ? styles.active : ''}`}>
          <div className={styles.resourcesSection}>
            <h2>Recursos de Suporte</h2>
            <div className={styles.resourcesList}>
              {crisisResources.map((resource, idx) => (
                <div key={idx} className={`${styles.resourceCard} ${resource.priority ? styles[resource.priority] : ''}`}>
                  <div className={styles.resourceContent}>
                    <h3>{resource.title}</h3>
                    <p>{resource.description}</p>
                  </div>
                  <a
                    href={resource.link || '#'}
                    className={`${styles.resourceBtn} ${resource.priority ? styles[resource.priority] : ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {resource.action} →
                  </a>
                </div>
              ))}
            </div>

            <div className={styles.helpInfo}>
              <p>
                <strong>Você não está sozinho.</strong> Se está passando por uma crise, 
                existem pessoas treinadas prontas para ajudar. Não hesite em procurar ajuda profissional.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Tabs Navigation */}
      <nav className={styles.tabs}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'check-in' ? styles.active : ''}`}
          onClick={() => setActiveTab('check-in')}
        >
          Check-in
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'info' ? styles.active : ''}`}
          onClick={() => setActiveTab('info')}
        >
          Dicas
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'resources' ? styles.active : ''}`}
          onClick={() => setActiveTab('resources')}
        >
          Recursos
        </button>
      </nav>

      {/* Footer */}
      <footer className={styles.footer}>
        <button
          className={styles.continueBtn}
          onClick={handleContinue}
          disabled={!selectedMood}
        >
          Conversar com Sofia →
        </button>
      </footer>
    </div>
  );
}
