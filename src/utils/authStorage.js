/**
 * Abstrações do localStorage para dados de autenticação
 */

const AUTH_STORAGE_KEYS = {
  USER: 'sofia-user',
  AUTH_TOKEN: 'sofia-auth-token',
  REMEMBER_EMAIL: 'sofia-remember-email',
  ONBOARDING_DONE: 'sofia-onboarding-done',
  SUPPORT_SCREEN_DONE: 'sofia-support-screen-done',
  SUPPORT_CHECK_INS: 'sofia-support-check-ins',
};

/**
 * Salva os dados do usuário no localStorage
 */
export const saveUser = (user) => {
  try {
    localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error('Erro ao salvar usuário:', error);
  }
};

/**
 * Recupera os dados do usuário do localStorage
 */
export const getUser = () => {
  try {
    const user = localStorage.getItem(AUTH_STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Erro ao recuperar usuário:', error);
    return null;
  }
};

/**
 * Remove os dados do usuário do localStorage (logout)
 */
export const clearUser = () => {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
    localStorage.removeItem(AUTH_STORAGE_KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error('Erro ao limpar usuário:', error);
  }
};

/**
 * Salva o token de autenticação
 */
export const saveAuthToken = (token) => {
  try {
    localStorage.setItem(AUTH_STORAGE_KEYS.AUTH_TOKEN, token);
  } catch (error) {
    console.error('Erro ao salvar token:', error);
  }
};

/**
 * Recupera o token de autenticação
 */
export const getAuthToken = () => {
  try {
    return localStorage.getItem(AUTH_STORAGE_KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error('Erro ao recuperar token:', error);
    return null;
  }
};

/**
 * Remove o token de autenticação
 */
export const clearAuthToken = () => {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error('Erro ao limpar token:', error);
  }
};

/**
 * Salva o email para "Lembrar-me"
 */
export const saveRememberEmail = (email) => {
  try {
    localStorage.setItem(AUTH_STORAGE_KEYS.REMEMBER_EMAIL, email);
  } catch (error) {
    console.error('Erro ao salvar email:', error);
  }
};

/**
 * Recupera o email salvo para "Lembrar-me"
 */
export const getRememberEmail = () => {
  try {
    return localStorage.getItem(AUTH_STORAGE_KEYS.REMEMBER_EMAIL);
  } catch (error) {
    console.error('Erro ao recuperar email:', error);
    return null;
  }
};

/**
 * Limpa o email salvo para "Lembrar-me"
 */
export const clearRememberEmail = () => {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEYS.REMEMBER_EMAIL);
  } catch (error) {
    console.error('Erro ao limpar email:', error);
  }
};

/**
 * Marca que o onboarding foi concluído
 */
export const setOnboardingDone = () => {
  try {
    localStorage.setItem(AUTH_STORAGE_KEYS.ONBOARDING_DONE, 'true');
  } catch (error) {
    console.error('Erro ao salvar onboarding:', error);
  }
};

/**
 * Verifica se o onboarding foi concluído
 */
export const isOnboardingDone = () => {
  try {
    return localStorage.getItem(AUTH_STORAGE_KEYS.ONBOARDING_DONE) === 'true';
  } catch (error) {
    console.error('Erro ao verificar onboarding:', error);
    return false;
  }
};

/**
 * Limpa o flag de onboarding
 */
export const clearOnboardingDone = () => {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEYS.ONBOARDING_DONE);
  } catch (error) {
    console.error('Erro ao limpar onboarding:', error);
  }
};

/**
 * Limpa todos os dados de autenticação
 */
export const clearAllAuthData = () => {
  try {
    Object.values(AUTH_STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Erro ao limpar dados de auth:', error);
  }
};

/**
 * Marca que o support screen foi visitado
 */
export const setSupportScreenDone = () => {
  try {
    localStorage.setItem(AUTH_STORAGE_KEYS.SUPPORT_SCREEN_DONE, 'true');
  } catch (error) {
    console.error('Erro ao salvar support screen:', error);
  }
};

/**
 * Verifica se o support screen foi visitado
 */
export const isSupportScreenDone = () => {
  try {
    return localStorage.getItem(AUTH_STORAGE_KEYS.SUPPORT_SCREEN_DONE) === 'true';
  } catch (error) {
    console.error('Erro ao verificar support screen:', error);
    return false;
  }
};

/**
 * Salva check-in de saúde mental do usuário
 */
export const saveSupportCheckIn = (checkInData) => {
  try {
    const checkIns = getSupportCheckIns();
    checkIns.push(checkInData);
    // Mantém apenas os últimos 30 check-ins
    if (checkIns.length > 30) {
      checkIns.shift();
    }
    localStorage.setItem(AUTH_STORAGE_KEYS.SUPPORT_CHECK_INS, JSON.stringify(checkIns));
  } catch (error) {
    console.error('Erro ao salvar check-in:', error);
  }
};

/**
 * Recupera histórico de check-ins
 */
export const getSupportCheckIns = () => {
  try {
    const checkIns = localStorage.getItem(AUTH_STORAGE_KEYS.SUPPORT_CHECK_INS);
    return checkIns ? JSON.parse(checkIns) : [];
  } catch (error) {
    console.error('Erro ao recuperar check-ins:', error);
    return [];
  }
};

/**
 * Limpa histórico de check-ins
 */
export const clearSupportCheckIns = () => {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEYS.SUPPORT_CHECK_INS);
  } catch (error) {
    console.error('Erro ao limpar check-ins:', error);
  }
};
