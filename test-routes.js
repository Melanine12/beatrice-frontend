// Test simple pour vérifier les routes disponibles sur Render
const testRoutes = async () => {
  const baseURL = 'https://beatrice-backend.onrender.com/api';
  const token = localStorage.getItem('token');
  
  const routes = [
    '/users',
    '/departements', 
    '/contrats',
    '/documents-rh'
  ];
  
  console.log('🧪 Test des routes sur Render...');
  console.log('🔑 Token:', token ? 'Present' : 'Missing');
  
  for (const route of routes) {
    try {
      console.log(`\n📡 Test de ${route}...`);
      const response = await fetch(`${baseURL}${route}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`✅ ${route}: ${response.status} ${response.statusText}`);
      
      if (response.status === 404) {
        console.log(`❌ ${route}: Route non trouvée sur le serveur`);
      } else if (response.status === 401) {
        console.log(`❌ ${route}: Authentification requise`);
      } else if (response.status === 200) {
        console.log(`✅ ${route}: Route fonctionnelle`);
      }
      
    } catch (error) {
      console.error(`❌ ${route}: Erreur`, error.message);
    }
  }
};

// Exécuter le test
testRoutes();
