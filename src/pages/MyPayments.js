import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import PaymentDetailsModal from '../components/Paiements/PaymentDetailsModal';
import PaymentFilters from '../components/Paiements/PaymentFilters';
import PaymentStats from '../components/Paiements/PaymentStats';

const MyPayments = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    statut: '',
    type_paiement: '',
    date_debut: '',
    date_fin: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [stats, setStats] = useState({
    total: 0,
    enAttente: 0,
    valides: 0,
    rejetes: 0,
    annules: 0
  });
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Vérifier l'authentification
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      console.log('Utilisateur non authentifié, redirection vers la connexion');
      navigate('/login');
      return;
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Charger les paiements
  const loadPayments = async () => {
    // Ne pas charger si l'utilisateur n'est pas authentifié
    if (!isAuthenticated) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Vérifier que le token est présent
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token d\'authentification manquant');
        navigate('/login');
        return;
      }
      
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      
      console.log('Chargement des paiements avec token:', token ? 'Présent' : 'Manquant');
      
      const response = await api.get(`/paiements?${params.toString()}`);
      
      if (response.data.success) {
        setPayments(response.data.paiements);
        setPagination(response.data.pagination);
        
        // Calculer les statistiques
        const total = response.data.paiements.length;
        const enAttente = response.data.paiements.filter(p => p.statut === 'En attente').length;
        const valides = response.data.paiements.filter(p => p.statut === 'Validé').length;
        const rejetes = response.data.paiements.filter(p => p.statut === 'Rejeté').length;
        const annules = response.data.paiements.filter(p => p.statut === 'Annulé').length;
        
        // Calculer les montants par devise
        const montantsParDevise = {};
        response.data.paiements.forEach(paiement => {
          const devise = paiement.devise || 'FC';
          const montant = parseFloat(paiement.montant) || 0;
          
          if (!montantsParDevise[devise]) {
            montantsParDevise[devise] = {
              total: 0,
              enAttente: 0,
              valides: 0,
              rejetes: 0,
              annules: 0
            };
          }
          
          montantsParDevise[devise].total += montant;
          
          if (paiement.statut === 'En attente') {
            montantsParDevise[devise].enAttente += montant;
          } else if (paiement.statut === 'Validé') {
            montantsParDevise[devise].valides += montant;
          } else if (paiement.statut === 'Rejeté') {
            montantsParDevise[devise].rejetes += montant;
          } else if (paiement.statut === 'Annulé') {
            montantsParDevise[devise].annules += montant;
          }
        });
        
        setStats({ 
          total, 
          enAttente, 
          valides, 
          rejetes, 
          annules,
          montantsParDevise 
        });
      }
    } catch (err) {
      console.error('Erreur lors du chargement des paiements:', err);
      
      if (err.response?.status === 401) {
        setError('Session expirée. Veuillez vous reconnecter.');
        navigate('/login');
      } else {
        setError('Erreur lors du chargement des paiements');
      }
    } finally {
      setLoading(false);
    }
  };

  // Charger les paiements au montage et quand les filtres changent
  useEffect(() => {
    if (isAuthenticated) {
      loadPayments();
    }
  }, [filters, isAuthenticated]);

  // Gérer le changement de page
  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };


  // Réinitialiser les filtres
  const resetFilters = () => {
    setFilters({
      statut: '',
      type_paiement: '',
      date_debut: '',
      date_fin: '',
      page: 1,
      limit: 10
    });
  };

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

  // Formater la date
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: fr });
    } catch {
      return 'Date invalide';
    }
  };

  // Ouvrir le modal avec les détails d'un paiement
  const openPaymentDetails = (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  // Fermer le modal
  const closePaymentDetails = () => {
    setIsModalOpen(false);
    setSelectedPayment(null);
  };

  // Vérifier l'authentification
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Redirection vers la page de connexion...</p>
        </div>
      </div>
    );
  }

  if (loading && payments.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Encaissements
          </h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Consultez l'historique des Encaissements.
          </p>
        </div>
      </div>

      {/* Statistiques */}
      <PaymentStats stats={stats} />

      {/* Filtres */}
      <PaymentFilters
        filters={filters}
        setFilters={setFilters}
        onReset={resetFilters}
      />

      {/* Tableau des paiements */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {/* Message d'information */}
          <div className="mb-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  💡 <strong>Astuce :</strong> Cliquez sur une ligne du tableau pour voir les détails complets du paiement.
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    Erreur
                  </h3>
                  <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                    {error}
                  </div>
                </div>
              </div>
            </div>
          )}

          {payments.length === 0 && !loading ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucun paiement</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Aucun paiement trouvé avec les critères sélectionnés.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Référence
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Montant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Bénéficiaire
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {payments.map((payment) => (
                      <tr 
                        key={payment.id} 
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer group"
                        onClick={() => openPaymentDetails(payment)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          <div className="flex items-center space-x-2">
                            <span>{payment.reference}</span>
                            <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {formatAmount(payment.montant, payment.devise)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPaymentTypeColor(payment.type_paiement)}`}>
                            {payment.type_paiement}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(payment.statut)}`}>
                            {payment.statut}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {formatDate(payment.date_paiement)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-xs truncate">
                          {payment.description || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {payment.beneficiaire || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination - Toujours afficher si il y a des éléments */}
              {pagination.total > 0 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Affichage de <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span>
                    {' '}à{' '}
                    <span className="font-medium">
                      {Math.min(pagination.page * pagination.limit, pagination.total)}
                    </span>
                    {' '}sur{' '}
                    <span className="font-medium">{pagination.total}</span>
                    {' '}paiement{pagination.total !== 1 ? 's' : ''}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Précédent
                    </button>
                    
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Page {pagination.page} sur {pagination.pages}
                    </span>
                    
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= pagination.pages}
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal des détails du paiement */}
      <PaymentDetailsModal
        payment={selectedPayment}
        isOpen={isModalOpen}
        onClose={closePaymentDetails}
      />
    </div>
  );
};

export default MyPayments; 