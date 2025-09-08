// Configuration des URLs de l'API
const API_CONFIG = {
  // Développement local
  development: {
    baseURL: 'http://localhost:5002/api',
    socketURL: 'http://localhost:5002',
    timeout: 10000
  },
  
  // Production (Render)
  production: {
    baseURL: 'https://beatrice-backend.onrender.com/api',
    socketURL: 'https://beatrice-backend.onrender.com',
    timeout: 15000
  }
};

// Détecter l'environnement
const isDevelopment = process.env.NODE_ENV === 'development' || 
                     process.env.REACT_APP_ENV === 'development' ||
                     window.location.hostname === 'localhost' ||
                     window.location.hostname === '127.0.0.1';

// Configuration active
export const activeConfig = isDevelopment ? API_CONFIG.development : API_CONFIG.production;

// URLs exportées
export const API_BASE_URL = activeConfig.baseURL;
export const SOCKET_URL = activeConfig.socketURL;
export const API_TIMEOUT = activeConfig.timeout;

// Log de la configuration active
console.log(`🚀 Configuration API active:`, {
  environment: isDevelopment ? 'development' : 'production',
  baseURL: API_BASE_URL,
  socketURL: SOCKET_URL,
  timeout: API_TIMEOUT
});

export default API_CONFIG;
