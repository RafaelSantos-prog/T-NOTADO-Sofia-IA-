import { createContext, useState, useCallback } from 'react';
import { saveUser, getUser, clearUser, clearAllAuthData } from '../utils/authStorage';

/**
 * AuthContext for managing authentication state.
 * API Key é gerenciada pelo backend (arquivo server/.env)
 * Frontend apenas gerencia dados do usuário
 */
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  // User data (mutable)
  const [user, setUser] = useState(() => getUser());
  const [isAuthenticated, setIsAuthenticated] = useState(!!user);

  // Dummy apiKey para compatibilidade com código antigo
  // Backend proxy gerencia a chave real
  const apiKey = 'backend-proxy';

  /**
   * Authenticate a user (user registration/login)
   */
  const setAuth = useCallback((userData) => {
    if (typeof userData === 'object' && userData?.email) {
      saveUser(userData);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  /**
   * Register a new user
   */
  const register = useCallback((userData) => {
    const newUser = {
      id: userData.id || Math.random().toString(36).substring(7),
      email: userData.email,
      name: userData.name,
      age: userData.age,
      createdAt: new Date().toISOString(),
    };
    saveUser(newUser);
    setUser(newUser);
    setIsAuthenticated(true);
    return newUser;
  }, []);

  /**
   * Login with user credentials
   */
  const login = useCallback((userData) => {
    const loginUser = {
      id: userData.id || Math.random().toString(36).substring(7),
      email: userData.email,
      name: userData.name,
    };
    saveUser(loginUser);
    setUser(loginUser);
    setIsAuthenticated(true);
    return loginUser;
  }, []);

  /**
   * Logout the current user
   */
  const logout = useCallback(() => {
    clearAllAuthData();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  /**
   * Update user profile
   */
  const updateUser = useCallback((updates) => {
    const updatedUser = { ...user, ...updates };
    saveUser(updatedUser);
    setUser(updatedUser);
    return updatedUser;
  }, [user]);

  const value = {
    // API Key (from environment)
    apiKey,
    // User auth
    user,
    isAuthenticated,
    // Methods
    setAuth,
    register,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
