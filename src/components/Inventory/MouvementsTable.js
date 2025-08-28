import React from 'react';
import { PencilIcon, TruckIcon } from '@heroicons/react/24/outline';

const MouvementsTable = ({ mouvementsStock, onEdit }) => {
  if (mouvementsStock.length === 0) {
    return (
      <div className="text-center py-8">
        <TruckIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Aucun mouvement trouvé
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Commencez par créer des mouvements de stock
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Article
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Quantité
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Montant
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Chambre
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Utilisateur
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {mouvementsStock.map((mouvement) => (
            <tr key={mouvement.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {mouvement.inventaire?.nom || 'N/A'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  mouvement.type_mouvement === 'Entrée' ? 'bg-green-100 text-green-800' :
                  mouvement.type_mouvement === 'Sortie' ? 'bg-red-100 text-red-800' :
                  mouvement.type_mouvement === 'Ajustement' ? 'bg-blue-100 text-blue-800' :
                  mouvement.type_mouvement === 'Transfert' ? 'bg-purple-100 text-purple-800' :
                  mouvement.type_mouvement === 'Perte' ? 'bg-orange-100 text-orange-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {mouvement.type_mouvement}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-white">
                  {mouvement.quantite}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {mouvement.quantite_avant} → {mouvement.quantite_apres}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-white">
                  {mouvement.montant_total ? `${mouvement.montant_total}$` : '-'}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {mouvement.prix_unitaire ? `${mouvement.prix_unitaire}$/u` : ''}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-white">
                  {mouvement.chambre?.numero ? `Chambre ${mouvement.chambre.numero}` : '-'}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {mouvement.chambre?.type || ''}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {mouvement.utilisateur?.nom} {mouvement.utilisateur?.prenom}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {new Date(mouvement.date_mouvement).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(mouvement)}
                    className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MouvementsTable; 