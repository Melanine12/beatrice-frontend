import React from 'react';
import { 
  PencilIcon, 
  TrashIcon, 
  CheckIcon, 
  XMarkIcon, 
  CurrencyDollarIcon,
  EyeIcon,
  DocumentIcon,
  TagIcon,
  PlusIcon,
  BellIcon,
  CalendarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../UI/LoadingSpinner';
import Pagination from '../UI/Pagination';

const ExpensesTable = ({ 
  expenses, 
  onEdit, 
  onDelete, 
  onApprove, 
  onReject, 
  onPay,
  onPaiementsPartiels,
  onRappelsPaiement,
  hasPermission,
  hasExactRole,
  currentUser,
  loading,
  pagination,
  onPageChange,
  onNewExpense
}) => {
  const getStatusColor = (status) => {
    const colors = {
      'En attente': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'Approuvée': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Payée': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Rejetée': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const getUrgencyColor = (urgence) => {
    const colors = {
      'Très faible': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      'Faible': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Normale': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Élevée': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'Très élevée': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'Critique': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return colors[urgence] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const getPriorityColor = (priorite) => {
    const colors = {
      'Très basse': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      'Basse': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Moyenne': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Haute': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'Très haute': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'Urgente': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return colors[priorite] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Maintenance': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'Nettoyage': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Équipement': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Services': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Marketing': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      'Administration': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      'Autre': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatAmount = (amount, currency = 'FC') => {
    // Gérer les devises qui ne sont pas supportées par Intl.NumberFormat
    const supportedCurrencies = ['EUR', 'USD', 'GBP', 'JPY'];
    
    if (supportedCurrencies.includes(currency)) {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: currency
      }).format(amount);
    } else {
      // Pour les devises non supportées (comme FC), formater manuellement
      return new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }).format(amount) + ' ' + currency;
    }
  };

  const canEdit = (expense) => {
    return expense.demandeur_id === currentUser?.id || hasPermission('Superviseur');
  };

  const canApprove = (expense) => {
    return hasPermission('Superviseur') && expense.statut === 'En attente';
  };

  const canPay = (expense) => {
    return hasPermission('Administrateur') && expense.statut === 'Approuvée';
  };

  const canDelete = (expense) => {
    return hasPermission('Administrateur');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Action Bar with New Expense Button */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {expenses.length} dépense{expenses.length !== 1 ? 's' : ''} trouvée{expenses.length !== 1 ? 's' : ''}
        </div>
        <div className="flex space-x-2">
          {hasExactRole('Superviseur') && onNewExpense && (
            <button
              onClick={onNewExpense}
              className="btn-primary bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white px-4 py-2 text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
              title="Créer une nouvelle dépense"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Nouvelle Dépense
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Dépense
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Montant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Catégorie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Demandeur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Dates
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Paiement
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {expenses.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="text-gray-400 dark:text-gray-500">
                      <DocumentIcon className="w-12 h-12 mx-auto" />
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">
                      <p className="text-lg font-medium">Aucune dépense trouvée</p>
                      <p className="text-sm">Commencez par créer votre première dépense</p>
                    </div>
                    {hasExactRole('Superviseur') && onNewExpense && (
                      <button
                        onClick={onNewExpense}
                        className="btn-primary bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white px-4 py-2 text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
                      >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Créer une dépense
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              expenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {expense.titre}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {expense.description?.substring(0, 50)}
                        {expense.description?.length > 50 && '...'}
                      </div>
                      {expense.fournisseur && (
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          Fournisseur: {expense.fournisseur}
                        </div>
                      )}
                      {expense.numero_facture && (
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          Facture: {expense.numero_facture}
                        </div>
                      )}
                      {/* Tags */}
                      {(() => {
                        try {
                          const tags = typeof expense.tags === 'string' ? JSON.parse(expense.tags) : expense.tags;
                          if (tags && Array.isArray(tags) && tags.length > 0) {
                            return (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {tags.slice(0, 3).map((tag, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                  >
                                    <TagIcon className="w-3 h-3 mr-1" />
                                    {tag}
                                  </span>
                                ))}
                                {tags.length > 3 && (
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    +{tags.length - 3} autres
                                  </span>
                                )}
                              </div>
                            );
                          }
                          return null;
                        } catch (error) {
                          console.warn('Erreur lors du parsing des tags:', error);
                          return null;
                        }
                      })()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatAmount(expense.montant, expense.devise)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(expense.categorie)}`}>
                      {expense.categorie}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(expense.statut)}`}>
                      {expense.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {expense.demandeur?.nom} {expense.demandeur?.prenom}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div>
                      <div>Dépense: {formatDate(expense.date_depense)}</div>
                      {expense.date_paiement && (
                        <div className="text-xs text-green-600 dark:text-green-400">
                          Payée: {formatDate(expense.date_paiement)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="space-y-1">
                      {/* Date de paiement prévue */}
                      {expense.date_paiement_prevue && (
                        <div className="flex items-center text-xs">
                          <CalendarIcon className="w-3 h-3 mr-1 text-blue-500" />
                          <span className="text-blue-600 dark:text-blue-400">
                            Prévue: {formatDate(expense.date_paiement_prevue)}
                          </span>
                        </div>
                      )}
                      
                      {/* Niveau d'urgence */}
                      {expense.urgence && expense.urgence !== 'Normale' && (
                        <div className="flex items-center text-xs">
                          <ExclamationTriangleIcon className="w-3 h-3 mr-1 text-orange-500" />
                          <span className={`inline-flex px-1.5 py-0.5 rounded-full text-xs font-medium ${getUrgencyColor(expense.urgence)}`}>
                            {expense.urgence}
                          </span>
                        </div>
                      )}
                      
                      {/* Priorité de paiement */}
                      {expense.priorite_paiement && expense.priorite_paiement !== 'Moyenne' && (
                        <div className="flex items-center text-xs">
                          <span className={`inline-flex px-1.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(expense.priorite_paiement)}`}>
                            {expense.priorite_paiement}
                          </span>
                        </div>
                      )}
                      
                      {/* Montant payé vs restant */}
                      {expense.montant_paye && expense.montant_paye > 0 && (
                        <div className="text-xs">
                          <span className="text-green-600 dark:text-green-400">
                            Payé: {formatAmount(expense.montant_paye, expense.devise)}
                          </span>
                          {expense.montant_paye < expense.montant && (
                            <span className="text-orange-600 dark:text-orange-400 ml-2">
                              Reste: {formatAmount(expense.montant - expense.montant_paye, expense.devise)}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {/* View Files */}
                      {(() => {
                        try {
                          const fichiers = typeof expense.fichiers === 'string' ? JSON.parse(expense.fichiers) : expense.fichiers;
                          if (fichiers && Array.isArray(fichiers) && fichiers.length > 0) {
                            return (
                              <button
                                onClick={() => window.open(`/uploads/depenses/${fichiers[0].filename}`, '_blank')}
                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                title="Voir les fichiers"
                              >
                                <DocumentIcon className="w-4 h-4" />
                              </button>
                            );
                          }
                          return null;
                        } catch (error) {
                          console.warn('Erreur lors du parsing des fichiers:', error);
                          return null;
                        }
                      })()}

                      {/* Edit */}
                      {canEdit(expense) && (
                        <button
                          onClick={() => onEdit(expense)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                          title="Modifier"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                      )}

                      {/* Approve */}
                      {canApprove(expense) && (
                        <button
                          onClick={() => onApprove(expense.id)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          title="Approuver"
                        >
                          <CheckIcon className="w-4 h-4" />
                        </button>
                      )}

                      {/* Reject */}
                      {canApprove(expense) && (
                        <button
                          onClick={() => onReject(expense.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="Rejeter"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      )}

                      {/* Pay */}
                      {canPay(expense) && (
                        <button
                          onClick={() => onPay(expense.id)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          title="Marquer comme payée"
                        >
                          <CurrencyDollarIcon className="w-4 h-4" />
                        </button>
                      )}

                      {/* Paiements Partiels */}
                      {onPaiementsPartiels && (
                        <button
                          onClick={() => onPaiementsPartiels(expense)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Gérer les paiements partiels"
                        >
                          <CurrencyDollarIcon className="w-4 h-4" />
                        </button>
                      )}

                      {/* Rappels de Paiement */}
                      {onRappelsPaiement && (
                        <button
                          onClick={() => onRappelsPaiement(expense)}
                          className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300"
                          title="Gérer les rappels de paiement"
                        >
                          <BellIcon className="w-4 h-4" />
                        </button>
                      )}

                      {/* Delete */}
                      {canDelete(expense) && (
                        <button
                          onClick={() => onDelete(expense.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="Supprimer"
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
      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default ExpensesTable; 