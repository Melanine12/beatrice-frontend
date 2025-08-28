import React from 'react';

const PaymentFilters = ({ filters, setFilters, onReset }) => {
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Filtres de recherche
          </h3>
          <button
            onClick={onReset}
            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Réinitialiser
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Statut */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Statut du paiement
            </label>
            <select
              value={filters.statut}
              onChange={(e) => handleFilterChange('statut', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Tous les statuts</option>
              <option value="En attente">En attente</option>
              <option value="Validé">Validé</option>
              <option value="Rejeté">Rejeté</option>
              <option value="Annulé">Annulé</option>
            </select>
          </div>

          {/* Type de paiement */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type de paiement
            </label>
            <select
              value={filters.type_paiement}
              onChange={(e) => handleFilterChange('type_paiement', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Tous les types</option>
              <option value="Espèces">Espèces</option>
              <option value="Carte bancaire">Carte bancaire</option>
              <option value="Chèque">Chèque</option>
              <option value="Virement">Virement</option>
              <option value="Autre">Autre</option>
            </select>
          </div>

          {/* Date début */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date de début
            </label>
            <input
              type="date"
              value={filters.date_debut}
              onChange={(e) => handleFilterChange('date_debut', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Date fin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date de fin
            </label>
            <input
              type="date"
              value={filters.date_fin}
              onChange={(e) => handleFilterChange('date_fin', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Informations sur les filtres actifs */}
        {(filters.statut || filters.type_paiement || filters.date_debut || filters.date_fin) && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Filtres actifs :</strong>
              {filters.statut && ` Statut: ${filters.statut}`}
              {filters.type_paiement && ` Type: ${filters.type_paiement}`}
              {filters.date_debut && ` Depuis: ${filters.date_debut}`}
              {filters.date_fin && ` Jusqu'à: ${filters.date_fin}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentFilters; 