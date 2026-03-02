import { useState, useRef } from 'react';
import { OnboardingStep } from '../../auth/OnboardingStep/OnboardingStep';
import { Button } from '../../ui/Button/Button';
import { useAuth } from '../../../hooks/useAuth';
import { setOnboardingDone } from '../../../utils/authStorage';
import styles from './OnboardingScreen.module.css';

const slides = [
  {
    id: 1,
    icon: '🧠',
    title: 'Olá! 👋',
    subtitle: 'Sou a Sofia',
    description:
      'Estou aqui para te ouvir, sem julgamentos, a qualquer hora que você precisar.',
  },
  {
    id: 2,
    icon: '💬',
    title: 'Como funciona?',
    features: [
      'Converse livremente',
      'Sessões sem limite de tempo',
      'Suas conversas são privadas',
      'Baseado em TCC e ACT',
    ],
  },
  {
    id: 3,
    icon: '⚠️',
    title: 'Lembrete importante',
    description:
      'A Sofia é uma IA e não substitui um psicólogo real.',
    warning: 'Em caso de crise, ligue CVV — 188 (24h)',
  },
];

export function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const touchStartX = useRef(0);
  const { user } = useAuth();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setIsExiting(true);
      setTimeout(() => {
        setCurrentSlide(currentSlide + 1);
        setIsExiting(false);
      }, 300);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setIsExiting(true);
      setTimeout(() => {
        setCurrentSlide(currentSlide - 1);
        setIsExiting(false);
      }, 300);
    }
  };

  const handleFinish = () => {
    setOnboardingDone();
    window.location.reload();
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  const slide = slides[currentSlide];

  return (
    <div className={styles.container} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div className={styles.content}>
        <OnboardingStep
          icon={slide.icon}
          title={currentSlide === 0 && user?.name ? `${slide.title} ${user.name}!` : slide.title}
          description={slide.description}
          className={isExiting ? styles.exitLeft : ''}
        >
          {slide.features && (
            <ul className={styles.features}>
              {slide.features.map((feature, idx) => (
                <li key={idx} className={styles.feature}>
                  <span className={styles.check}>✦</span>
                  {feature}
                </li>
              ))}
            </ul>
          )}
          {slide.warning && (
            <div className={styles.warningBox}>
              <div className={styles.warningIcon}>📞</div>
              <div>
                <p className={styles.warningTitle}>CVV — 188</p>
                <p className={styles.warningSubtitle}>(24 horas)</p>
              </div>
            </div>
          )}
        </OnboardingStep>

        <div className={styles.dots}>
          {slides.map((_, idx) => (
            <button
              key={idx}
              className={`${styles.dot} ${
                idx === currentSlide ? styles.active : ''
              }`}
              onClick={() => {
                if (idx !== currentSlide) {
                  setIsExiting(true);
                  setTimeout(() => {
                    setCurrentSlide(idx);
                    setIsExiting(false);
                  }, 300);
                }
              }}
              aria-label={`Ir para slide ${idx + 1}`}
            ></button>
          ))}
        </div>

        <div className={styles.navigation}>
          {currentSlide > 0 ? (
            <Button
              type="button"
              variant="ghost"
              onClick={handlePrev}
              aria-label="Slide anterior"
            >
              ← Voltar
            </Button>
          ) : (
            <div></div>
          )}

          {currentSlide < slides.length - 1 ? (
            <Button
              type="button"
              variant="primary"
              onClick={handleNext}
              aria-label="Próximo slide"
            >
              Próximo →
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              onClick={handleFinish}
              aria-label="Começar agora"
            >
              Começar agora! 🚀
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
