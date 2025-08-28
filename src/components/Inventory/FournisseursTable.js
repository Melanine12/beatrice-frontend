import React from 'react';
import { PencilIcon, TrashIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../UI/LoadingSpinner';
import Pagination from '../UI/Pagination';

const FournisseursTable = ({ 
  fournisseurs, 
  onEdit, 
  onDelete, 
  getCategoryColor,
  pagination,
  onPageChange,
  onItemsPerPageChange,
  pageLoading 
}) => {
  const { hasPermission } = useAuth();

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-gray-600 dark:text-gray-400">Chargement des fournisseurs...</span>
      </div>
    );
  }

  if (fournisseurs.length === 0 && pagination.totalItems === 0) {
    return (
      <div className="text-center py-8">
        <BuildingStorefrontIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Aucun fournisseur trouvé
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Commencez par ajouter des fournisseurs
        </p>
      </div>
    );
  }

  if (fournisseurs.length === 0 && pagination.totalItems > 0) {
    return (
      <div className="text-center py-8">
        <BuildingStorefrontIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Aucun fournisseur sur cette page
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Essayez de changer de page ou de modifier les filtres
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Stats Summary */}
      {!pageLoading && fournisseurs.length > 0 && pagination.totalItems > 0 && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {pagination.totalItems}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total fournisseurs
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {fournisseurs.filter(f => f.statut === 'Actif').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Fournisseurs actifs
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {fournisseurs.filter(f => f.evaluation >= 4).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Bien évalués (4+)
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {pagination.totalPages}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Pages totales
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Fournisseur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Catégorie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Évaluation
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {pageLoading ? (
              <tr>
                <td colSpan="6" className="px-6 py-12">
                  <div className="flex items-center justify-center">
                    <LoadingSpinner size="md" />
                    <span className="ml-3 text-gray-600 dark:text-gray-400">Chargement...</span>
                  </div>
                </td>
              </tr>
            ) : (
              fournisseurs.map((fournisseur) => (
                <tr key={fournisseur.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {fournisseur.nom}
                      </div>
                      {fournisseur.ville && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {fournisseur.ville}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {fournisseur.contact_principal || fournisseur.email}
                    </div>
                    {fournisseur.telephone && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {fournisseur.telephone}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(fournisseur.categorie_principale)}`}>
                      {fournisseur.categorie_principale || 'Autre'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {fournisseur.evaluation ? (
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < fournisseur.evaluation ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      fournisseur.statut === 'Actif' ? 'bg-green-100 text-green-800' :
                      fournisseur.statut === 'Inactif' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {fournisseur.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {hasPermission('Superviseur') && (
                        <button
                          onClick={() => onEdit(fournisseur)}
                          className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                      )}
                      {hasPermission('Administrateur') && (
                        <button
                          onClick={() => onDelete(fournisseur.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {pagination.totalItems > 0 && fournisseurs.length > 0 && (
        <div className="mt-6">
          {!pageLoading && (
            <>
              {/* Progress Bar */}
              {pagination.totalPages > 1 && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>Progression</span>
                    <span>{Math.round((pagination.currentPage / pagination.totalPages) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${(pagination.currentPage / pagination.totalPages) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                itemsPerPage={pagination.itemsPerPage}
                onPageChange={onPageChange}
                onItemsPerPageChange={onItemsPerPageChange}
              />
            </>
          )}
        </div>
      )}
    </>
  );
};

export default FournisseursTable; 