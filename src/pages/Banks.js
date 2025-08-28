import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Banks = () => {
  const { user } = useAuth();
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Implémenter la récupération des comptes bancaires
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Gestion des Comptes Bancaires
          </h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Gérez les comptes bancaires et leurs mouvements.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Fonctionnalité en cours de développement
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Cette page permettra de gérer les comptes bancaires, leurs soldes et leurs transactions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banks; 