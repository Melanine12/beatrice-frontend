import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, [token]);

  const checkAuthStatus = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data.user);
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        mot_de_passe: password
      });

      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      toast.success('Connexion réussie');
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      const message = error.response?.data?.message || 'Erreur lors de la connexion';
      toast.error(message);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    toast.success('Déconnexion réussie');
  };

  const updateProfile = (userData) => {
    setUser(userData);
  };

  const hasPermission = (requiredRole) => {
    if (!user) return false;
    
    const roleHierarchy = {
      'Guichetier': 1,
      'Agent': 2,
      'Superviseur': 3,
      'Administrateur': 4,
      'Patron': 5
    };
    
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  };

  const hasExactRole = (exactRole) => {
    if (!user) return false;
    return user.role === exactRole;
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    updateProfile,
    hasPermission,
    hasExactRole,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 