import React from 'react';

const ContratsDocumentsSimple = () => {
  console.log('🔍 DEBUG: Composant ContratsDocumentsSimple monté');
  
  return (
    <div className="space-y-6 p-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Test Simple - Contrats & Documents
        </h1>
        
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                Composant chargé avec succès !
              </h3>
              <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                <p>Si vous voyez ce message, le composant se monte correctement.</p>
                <p className="mt-1">Vérifiez la console pour les logs de débogage.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContratsDocumentsSimple;
