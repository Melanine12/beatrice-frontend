import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const ContratsDocumentsDebug = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('🔍 DEBUG: Composant ContratsDocumentsDebug monté');
    console.log('👤 Utilisateur:', user);
    
    try {
      setStep(1);
      console.log('✅ Étape 1: useState et useEffect fonctionnent');
      
      // Test simple d'import
      setStep(2);
      console.log('✅ Étape 2: Imports fonctionnent');
      
      // Test de l'API
      setStep(3);
      console.log('✅ Étape 3: Prêt pour test API');
      
    } catch (err) {
      console.error('❌ Erreur dans useEffect:', err);
      setError(err.message);
    }
  }, []);

  const testAPI = async () => {
    try {
      console.log('🧪 Test API en cours...');
      console.log('🔑 Token avant requête:', localStorage.getItem('token'));
      setStep(4);
      
      // Import dynamique de l'API
      const api = await import('../../services/api');
      console.log('✅ API importée avec succès');
      
      setStep(5);
      
      // Test simple de l'API
      const response = await api.default.get('/users');
      console.log('✅ API users fonctionne:', response);
      
      setStep(6);
      
    } catch (err) {
      console.error('❌ Erreur API:', err);
      console.error('Status:', err.response?.status);
      console.error('Headers:', err.response?.headers);
      setError(`Erreur ${err.response?.status}: ${err.response?.data?.message || err.message}`);
    }
  };

  const testContratsAPI = async () => {
    try {
      console.log('🧪 Test API contrats en cours...');
      console.log('👤 Rôle utilisateur:', user?.role);
      console.log('🔑 Token:', localStorage.getItem('token'));
      setStep(7);
      
      const api = await import('../../services/api');
      const response = await api.default.get('/contrats');
      console.log('✅ API contrats fonctionne:', response);
      
      setStep(8);
      
    } catch (err) {
      console.error('❌ Erreur API contrats:', err);
      console.error('Status:', err.response?.status);
      console.error('Data:', err.response?.data);
      setError(`Erreur ${err.response?.status}: ${err.response?.data?.message || err.message}`);
    }
  };

  const testDepartementsAPI = async () => {
    try {
      console.log('🧪 Test API départements en cours...');
      console.log('🔑 Token:', localStorage.getItem('token'));
      setStep(9);
      
      const api = await import('../../services/api');
      const response = await api.default.get('/departements');
      console.log('✅ API départements fonctionne:', response);
      
      setStep(10);
      
    } catch (err) {
      console.error('❌ Erreur API départements:', err);
      console.error('Status:', err.response?.status);
      console.error('Data:', err.response?.data);
      setError(`Erreur ${err.response?.status}: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Debug Contrats & Documents
        </h1>
        
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-2">
              État du composant
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Étape actuelle: {step}
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Utilisateur: {user ? `${user.prenom} ${user.nom} (${user.role})` : 'Non connecté'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">
                Erreur
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300">
                {error}
              </p>
            </div>
          )}

          <div className="flex space-x-4">
            <button
              onClick={testAPI}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Test API Users
            </button>
            
            <button
              onClick={testContratsAPI}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Test API Contrats
            </button>
            
            <button
              onClick={testDepartementsAPI}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Test API Départements
            </button>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
              Instructions
            </h3>
            <ol className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>1. Ouvrez la console du navigateur (F12)</li>
              <li>2. Regardez les logs qui s'affichent automatiquement</li>
              <li>3. Cliquez sur les boutons de test</li>
              <li>4. Partagez-moi les erreurs affichées</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContratsDocumentsDebug;
