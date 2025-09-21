import React, { useState } from 'react';
import { XMarkIcon, CurrencyDollarIcon, MapPinIcon, UserIcon, CalendarIcon, ClockIcon, ArrowPathIcon, EyeIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import CaisseTransactionsModal from './CaisseTransactionsModal';

const CaisseDetailsModal = ({ isOpen, onClose, caisse, onCaisseUpdate }) => {
  const [recalculating, setRecalculating] = useState(false);
  const [transactionsModalOpen, setTransactionsModalOpen] = useState(false);
  const { user } = useAuth();
  
  // Debug: Afficher le rôle de l'utilisateur
  console.log('🔍 Rôle de l\'utilisateur connecté:', user?.role);
  console.log('🔍 Utilisateur complet:', user);

  if (!isOpen || !caisse) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Non définie';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount, currency) => {
    if (amount === null || amount === undefined) return 'Non définie';
    
    // Devises supportées par Intl.NumberFormat
    const supportedCurrencies = ['EUR', 'USD', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF'];
    
    if (supportedCurrencies.includes(currency)) {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: currency
      }).format(amount);
    } else {
      // Formatage manuel pour les devises non supportées (comme FC)
      return new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }).format(amount) + ' ' + currency;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'En maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Fermée':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleRecalculerSolde = async () => {
    try {
      setRecalculating(true);
      const response = await api.post(`/caisses/${caisse.id}/recalculer-solde`);
      
      if (response.data.success) {
        toast.success('Solde recalculé avec succès');
        // Mettre à jour la caisse dans le composant parent
        if (onCaisseUpdate) {
          onCaisseUpdate(response.data.caisse);
        }
      }
    } catch (error) {
      console.error('Erreur lors du recalcul du solde:', error);
      toast.error('Erreur lors du recalcul du solde');
    } finally {
      setRecalculating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Détails de la Caisse
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            {/* Informations principales */}
            <div className="space-y-6">
              {/* Nom et Code */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {caisse.nom}
                </h4>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Code:</span>
                  <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {caisse.code_caisse}
                  </span>
                </div>
              </div>

              {/* Description et Emplacement */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                    <span className="mr-2">📝</span>
                    Description
                  </h5>
                  <p className="text-gray-900 dark:text-white">
                    {caisse.description || 'Aucune description'}
                  </p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    Emplacement
                  </h5>
                  <p className="text-gray-900 dark:text-white">
                    {caisse.emplacement || 'Non défini'}
                  </p>
                </div>
              </div>

              {/* Soldes */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                    <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                    Informations Financières
                  </h5>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setTransactionsModalOpen(true)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <EyeIcon className="h-3 w-3 mr-1" />
                      Voir Transactions
                    </button>
                    
                    {(user?.role === 'Superviseur' || user?.role === 'Superviseur Finance' || user?.role === 'Administrateur' || user?.role === 'Patron') && (
                      <button
                        onClick={handleRecalculerSolde}
                        disabled={recalculating}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {recalculating ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                            Recalcul...
                          </>
                        ) : (
                          <>
                            <ArrowPathIcon className="h-3 w-3 mr-1" />
                            Recalculer
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Solde Initial:</span>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(caisse.solde_initial, caisse.devise)}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Solde Actuel:</span>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(caisse.solde_actuel, caisse.devise)}
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Devise:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">
                    {caisse.devise}
                  </span>
                </div>
              </div>

              {/* Statut et Responsable */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Statut</h5>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(caisse.statut)}`}>
                    {caisse.statut}
                  </span>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                    <UserIcon className="h-4 w-4 mr-2" />
                    Responsable
                  </h5>
                  <p className="text-gray-900 dark:text-white">
                    {caisse.responsable ? `${caisse.responsable.prenom} ${caisse.responsable.nom}` : 'Non assigné'}
                  </p>
                </div>
              </div>

              {/* Limites */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h5 className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-3">
                  ⚠️ Limites de Transaction
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-blue-600 dark:text-blue-400">Limite de Retrait:</span>
                    <p className="font-medium text-blue-900 dark:text-blue-100">
                      {caisse.limite_retrait ? formatCurrency(caisse.limite_retrait, caisse.devise) : 'Aucune limite'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-blue-600 dark:text-blue-400">Limite de Dépôt:</span>
                    <p className="font-medium text-blue-900 dark:text-blue-100">
                      {caisse.limite_depot ? formatCurrency(caisse.limite_depot, caisse.devise) : 'Aucune limite'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Date d'Ouverture
                  </h5>
                  <p className="text-gray-900 dark:text-white">
                    {formatDate(caisse.date_ouverture)}
                  </p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    Date de Création
                  </h5>
                  <p className="text-gray-900 dark:text-white">
                    {formatDate(caisse.created_at)}
                  </p>
                </div>
              </div>

              {/* Notes */}
              {caisse.notes && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-yellow-600 dark:text-yellow-400 mb-2">
                    📝 Notes
                  </h5>
                  <p className="text-yellow-800 dark:text-yellow-200">
                    {caisse.notes}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
      
      {/* Modal des transactions */}
      <CaisseTransactionsModal
        isOpen={transactionsModalOpen}
        onClose={() => setTransactionsModalOpen(false)}
        caisse={caisse}
      />
    </div>
  );
};

export default CaisseDetailsModal; 