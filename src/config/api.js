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

// Détecter l'environnement - Forcer la production
const isDevelopment = false; // Forcer l'utilisation de la configuration de production

// Configuration active
export const activeConfig = API_CONFIG.production;

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
