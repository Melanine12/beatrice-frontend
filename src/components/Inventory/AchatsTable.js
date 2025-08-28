import React from 'react';
import { PencilIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

const AchatsTable = ({ achats, onEdit, onApprove }) => {
  const { hasPermission } = useAuth();

  if (achats.length === 0) {
    return (
      <div className="text-center py-8">
        <ShoppingCartIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Aucun achat trouvé
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Commencez par créer des achats
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
              Commande
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Fournisseur
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Montant
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Statut
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Priorité
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {achats.map((achat) => (
            <tr key={achat.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {achat.numero_commande}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(achat.date_creation).toLocaleDateString()}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-white">
                  {achat.fournisseur?.nom || 'N/A'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {achat.montant_total ? `${achat.montant_total}$` : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  achat.statut === 'Réceptionnée' ? 'bg-green-100 text-green-800' :
                  achat.statut === 'Commandée' ? 'bg-blue-100 text-blue-800' :
                  achat.statut === 'Approuvée' ? 'bg-purple-100 text-purple-800' :
                  achat.statut === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
                  achat.statut === 'Annulée' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {achat.statut}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  achat.priorite === 'Urgente' ? 'bg-red-100 text-red-800' :
                  achat.priorite === 'Haute' ? 'bg-orange-100 text-orange-800' :
                  achat.priorite === 'Normale' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {achat.priorite}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(achat)}
                    className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  {hasPermission('Superviseur') && achat.statut === 'En attente' && (
                    <button
                      onClick={() => onApprove(achat.id)}
                      className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                    >
                      ✓
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AchatsTable; 