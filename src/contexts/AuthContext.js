import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  setMemoryAccessToken,
  clearMemoryAccessToken,
  purgeLegacyAuthStorage
} from '../services/authTokenMemory';
import { ensureSocketAuthToken } from '../services/socketAuth';

const AUTH_USER_CACHE_KEY = 'auth_user_cache';

function clearCachedUser() {
  try {
    sessionStorage.removeItem(AUTH_USER_CACHE_KEY);
  } catch {
    /* ignore */
  }
}

function writeCachedUser(userData) {
  try {
    if (userData) {
      sessionStorage.setItem(AUTH_USER_CACHE_KEY, JSON.stringify(userData));
    }
  } catch {
    /* ignore */
  }
}

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Auth : cookie HttpOnly (synapta_at) + Bearer mémoire de secours (cross-site Netlify↔Render).
 * Jamais de JWT dans localStorage. Empêche un GET /auth/me concurrent d’effacer la session.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const authCheckIdRef = useRef(0);
  const userRef = useRef(null);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const clearSession = useCallback((showToast = false) => {
    setUser(null);
    userRef.current = null;
    clearMemoryAccessToken();
    clearCachedUser();
    if (showToast) {
      toast.success('Déconnexion réussie');
    }
  }, []);

  const checkAuthStatus = useCallback(
    async (retriesLeft = 2) => {
      const checkId = ++authCheckIdRef.current;
      try {
        const response = await api.get('/auth/me');
        // Une connexion a eu lieu pendant l’appel → ignorer ce résultat
        if (checkId !== authCheckIdRef.current) return;
        // Bearer mémoire pour Socket.IO cross-origin (cookie same-origin ne suffit pas)
        await ensureSocketAuthToken();
        if (checkId !== authCheckIdRef.current) return;
        setUser(response.data.user);
        userRef.current = response.data.user;
        writeCachedUser(response.data.user);
        setLoading(false);
      } catch (error) {
        if (checkId !== authCheckIdRef.current) return;

        const status = error.response?.status;

        // Ne pas effacer une session venant d’un login réussi concurrent
        if (userRef.current) {
          setLoading(false);
          return;
        }

        if (status === 401) {
          // Normal sur /login ou après expiration cookie — pas une erreur applicative
          clearSession(false);
          setLoading(false);
          return;
        }

        console.error('Auth check failed:', status || error.message);

        if (retriesLeft > 0 && (!status || status === 429 || status >= 500)) {
          await new Promise((resolve) => setTimeout(resolve, (3 - retriesLeft) * 1500 + 1000));
          if (checkId !== authCheckIdRef.current) return;
          return checkAuthStatus(retriesLeft - 1);
        }

        clearSession(false);
        setLoading(false);
      }
    },
    [clearSession]
  );

  useEffect(() => {
    purgeLegacyAuthStorage();
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (email, password, rememberMe = false) => {
    // Invalide tout /auth/me en vol (sinon 401 efface le user après login)
    authCheckIdRef.current += 1;

    try {
      const response = await api.post('/auth/login', {
        email,
        mot_de_passe: password,
        remember_me: Boolean(rememberMe)
      });

      const { user: userData, token } = response.data;
      // Secours si le navigateur bloque le cookie tiers (Safari / Chrome / Kenya, etc.)
      if (token) {
        setMemoryAccessToken(token);
      }

      if (!userData) {
        clearSession(false);
        toast.error('Connexion refusée : réponse serveur incomplète.');
        return false;
      }

      setUser(userData);
      userRef.current = userData;
      writeCachedUser(userData);
      setLoading(false);

      // Vérifie cookie et/ou Bearer — si token présent, ne pas bloquer l’entrée
      try {
        const me = await api.get('/auth/me', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        });
        if (me.data?.user) {
          setUser(me.data.user);
          userRef.current = me.data.user;
          writeCachedUser(me.data.user);
        }
      } catch (meErr) {
        console.error('Post-login /auth/me failed:', meErr.response?.status || meErr.message);
        if (token) {
          // Cookie tiers bloqué mais Bearer OK pour la suite des appels API
          toast.success('Connexion réussie');
          return true;
        }
        clearSession(false);
        toast.error(
          'Connexion refusée : session non établie. Videz le cache du navigateur, réessayez, ou contactez le support (déploiement API requis).'
        );
        return false;
      }

      toast.success('Connexion réussie');
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      clearMemoryAccessToken();
      const status = error.response?.status;
      let message = error.response?.data?.message || 'Erreur lors de la connexion';
      if (status === 429) {
        message = 'Trop de tentatives. Patientez quelques minutes avant de réessayer.';
      }
      toast.error(message);
      return false;
    }
  };

  const requestPasswordReset = async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      toast.success(
        response.data?.message ||
          'Si un compte existe, un email de réinitialisation a été envoyé.'
      );
      return true;
    } catch (error) {
      const status = error.response?.status;
      let message = error.response?.data?.message || 'Erreur lors de la demande';
      if (status === 429) {
        message = 'Trop de demandes. Réessayez dans quelques minutes.';
      }
      toast.error(message);
      return false;
    }
  };

  const resetPassword = async (resetToken, newPassword) => {
    try {
      const response = await api.post('/auth/reset-password', {
        token: resetToken,
        mot_de_passe: newPassword
      });
      toast.success(response.data?.message || 'Mot de passe mis à jour');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Échec de la réinitialisation');
      return false;
    }
  };

  const logout = useCallback(async () => {
    authCheckIdRef.current += 1;
    try {
      await api.post('/auth/logout');
    } catch {
      /* ignore */
    }
    clearSession(true);
  }, [clearSession]);

  const updateProfile = (userData) => {
    setUser(userData);
    userRef.current = userData;
    writeCachedUser(userData);
  };

  const hasPermission = (requiredRole) => {
    if (!user) return false;

    const roleHierarchy = {
      Guichetier: 1,
      Agent: 2,
      'Agent Chambre': 2,
      'Agent Exterieur': 2,
      'Agent Gouvernant': 2,
      Booker: 2,
      call_center: 2,
      'Web Master': 3,
      'Manager Bureau': 4,
      'Superviseur Stock': 4,
      'Responsable Zone': 5,
      'Superviseur Housing': 5,
      'Superviseur Finance': 6,
      'Superviseur RH': 7,
      'Superviseur Resto': 7,
      'Superviseur Comptable': 7,
      'Superviseur Technique': 7,
      Superviseur: 8,
      Auditeur: 9,
      'Chef Exécutif des Opérations': 9,
      'Directeur Opérations': 9,
      'Directeur Operations': 9,
      Administrateur: 10,
      Patron: 11
    };

    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  };

  const hasExactRole = (exactRole) => {
    if (!user) return false;
    return user.role === exactRole;
  };

  const value = {
    user,
    token: null,
    loading,
    login,
    logout,
    requestPasswordReset,
    resetPassword,
    updateProfile,
    hasPermission,
    hasExactRole,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
