import { useContext, useState } from 'react';
import { AuthContext, AuthProvider, ChatProvider, ToastProvider } from './context';
import { LoginScreen } from './components/screens/LoginScreen/LoginScreen';
import { RegisterScreen } from './components/screens/RegisterScreen/RegisterScreen';
import { ForgotPasswordScreen } from './components/screens/ForgotPasswordScreen/ForgotPasswordScreen';
import { OnboardingScreen } from './components/screens/OnboardingScreen/OnboardingScreen';
import { SupportScreen } from './components/screens/SupportScreen/SupportScreen';
import { SetupScreen } from './components/screens/SetupScreen/SetupScreen';
import { ChatScreen } from './components/screens/ChatScreen/ChatScreen';
import { ToastContainer } from './components/ui/Toast/ToastContainer';
import { isOnboardingDone, isSupportScreenDone, setSupportScreenDone } from './utils/authStorage';
import './styles/tokens.css';
import './styles/reset.css';
import './styles/animations.css';

/**
 * Main app component handling auth-based routing.
 */
function AppContent() {
  const { isAuthenticated, user, setAuth, logout } = useContext(AuthContext);
  const [authScreen, setAuthScreen] = useState('login'); // login, register, forgot
  const [isOnboardingComplete] = useState(() => isOnboardingDone());
  const [isSupportComplete, setIsSupportComplete] = useState(() => isSupportScreenDone());

  // Not authenticated - show auth screens
  if (!isAuthenticated && !user) {
    if (authScreen === 'register') {
      return (
        <>
          <RegisterScreen
            onNavigateToLogin={() => setAuthScreen('login')}
          />
          <ToastContainer />
        </>
      );
    }

    if (authScreen === 'forgot') {
      return (
        <>
          <ForgotPasswordScreen
            onNavigateToLogin={() => setAuthScreen('login')}
          />
          <ToastContainer />
        </>
      );
    }

    return (
      <>
        <LoginScreen
          onNavigateToRegister={() => setAuthScreen('register')}
          onNavigateToForgot={() => setAuthScreen('forgot')}
        />
        <ToastContainer />
      </>
    );
  }

  // Authenticated with user but onboarding not done - show onboarding
  if (user && !isOnboardingComplete) {
    return (
      <>
        <OnboardingScreen />
        <ToastContainer />
      </>
    );
  }

  // Authenticated with user + onboarding done, but support screen not done - show support
  if (user && isOnboardingComplete && !isSupportComplete) {
    return (
      <>
        <SupportScreen
          onContinueToChat={() => {
            setSupportScreenDone();
            setIsSupportComplete(true);
          }}
        />
        <ToastContainer />
      </>
    );
  }

  // Legacy API key auth (SetupScreen) - for backward compatibility
  if (isAuthenticated && !user) {
    return (
      <>
        <ChatScreen onLogout={logout} />
        <ToastContainer />
      </>
    );
  }

  // Fully authenticated - show chat
  if (isAuthenticated && user && isOnboardingComplete && isSupportComplete) {
    return (
      <>
        <ChatScreen onLogout={logout} />
        <ToastContainer />
      </>
    );
  }

  // Fallback - shouldn't reach here
  return (
    <>
      <SetupScreen onSubmit={setAuth} />
      <ToastContainer />
    </>
  );
}

/**
 * Root App component with context providers.
 */
export default function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </ChatProvider>
    </AuthProvider>
  );
}
