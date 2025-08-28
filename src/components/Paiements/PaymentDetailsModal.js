import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const PaymentDetailsModal = ({ payment, isOpen, onClose }) => {
  if (!isOpen || !payment) return null;

  // Formater le montant
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

  // Formater la date
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: fr });
    } catch {
      return 'Date invalide';
    }
  };

  // Obtenir la couleur du statut
  const getStatusColor = (status) => {
    const colors = {
      'En attente': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Validé': 'bg-green-100 text-green-800 border-green-200',
      'Rejeté': 'bg-red-100 text-red-800 border-red-200',
      'Annulé': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || colors['Annulé'];
  };

  // Obtenir la couleur du type de paiement
  const getPaymentTypeColor = (type) => {
    const colors = {
      'Espèces': 'bg-green-100 text-green-800 border-green-200',
      'Carte bancaire': 'bg-blue-100 text-blue-800 border-blue-200',
      'Chèque': 'bg-purple-100 text-purple-800 border-purple-200',
      'Virement': 'bg-orange-100 text-orange-800 border-orange-200',
      'Autre': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[type] || colors['Autre'];
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:items-center sm:justify-between">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Détails du Paiement
            </h3>
            <button
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-600 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Fermer
            </button>
          </div>

          {/* Content */}
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-6">
              {/* Informations principales */}
              <div>
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                  Informations Générales
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Référence
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white font-mono">
                      {payment.reference}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Montant
                    </label>
                    <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                      {formatAmount(payment.montant, payment.devise)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Type de paiement
                    </label>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPaymentTypeColor(payment.type_paiement)}`}>
                        {payment.type_paiement}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Statut
                    </label>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(payment.statut)}`}>
                        {payment.statut}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Date de paiement
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {formatDate(payment.date_paiement)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Devise
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {payment.devise}
                    </p>
                  </div>
                </div>
              </div>

              {/* Informations détaillées */}
              <div>
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                  Détails
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {payment.description && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                        Description
                      </label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {payment.description}
                      </p>
                    </div>
                  )}

                  {payment.beneficiaire && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                        Bénéficiaire
                      </label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {payment.beneficiaire}
                      </p>
                    </div>
                  )}

                  {payment.numero_cheque && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                        Numéro de chèque
                      </label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white font-mono">
                        {payment.numero_cheque}
                      </p>
                    </div>
                  )}

                  {payment.notes && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                        Notes
                      </label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {payment.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Relations */}
              <div>
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                  Relations
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {payment.caisse && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                        Caisse
                      </label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {payment.caisse.nom} ({payment.caisse.code_caisse})
                      </p>
                    </div>
                  )}

                  {payment.chambre && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                        Chambre
                      </label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {payment.chambre.numero} - {payment.chambre.type}
                      </p>
                    </div>
                  )}

                  {payment.depense && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                        Dépense associée
                      </label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {payment.depense.titre} - {formatAmount(payment.depense.montant, payment.depense.devise)}
                      </p>
                    </div>
                  )}

                  {payment.utilisateur && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                        Utilisateur
                      </label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {payment.utilisateur.prenom} {payment.utilisateur.nom}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Informations système */}
              <div>
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                  Informations Système
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      ID du paiement
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white font-mono">
                      {payment.id}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Créé le
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {payment.created_at ? formatDate(payment.created_at) : 'Non disponible'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Modifié le
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {payment.updated_at ? formatDate(payment.updated_at) : 'Non disponible'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailsModal; 