// Script de test pour vérifier la configuration de l'API
// Exécuter avec: node test-api-config.js

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

// Forcer le mode développement
const isDevelopment = true;
const activeConfig = isDevelopment ? API_CONFIG.development : API_CONFIG.production;

console.log('🔧 Test de configuration API');
console.log('============================');
console.log(`Environnement: ${isDevelopment ? 'DEVELOPPEMENT' : 'PRODUCTION'}`);
console.log(`Base URL: ${activeConfig.baseURL}`);
console.log(`Socket URL: ${activeConfig.socketURL}`);
console.log(`Timeout: ${activeConfig.timeout}ms`);
console.log('');

// Test de connectivité
const testConnectivity = async () => {
  try {
    console.log('🧪 Test de connectivité...');
    
    // Test avec fetch (si disponible)
    if (typeof fetch !== 'undefined') {
      const response = await fetch(`${activeConfig.baseURL}/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        console.log('✅ API accessible');
      } else {
        console.log(`⚠️ API accessible mais erreur: ${response.status}`);
      }
    } else {
      console.log('ℹ️ Fetch non disponible, test avec curl recommandé');
    }
    
  } catch (error) {
    console.log('❌ Erreur de connectivité:', error.message);
    console.log('');
    console.log('💡 Solutions possibles:');
    console.log('1. Vérifier que le backend est démarré sur le port 5002');
    console.log('2. Vérifier que http://localhost:5002 est accessible');
    console.log('3. Vérifier les logs du backend');
  }
};

// Exécuter le test si le script est lancé directement
if (require.main === module) {
  testConnectivity();
}

module.exports = { API_CONFIG, activeConfig, isDevelopment };
