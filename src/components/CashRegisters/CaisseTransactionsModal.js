import React, { useState, useEffect } from 'react';
import { XMarkIcon, CurrencyDollarIcon, CalendarIcon, UserIcon, EyeIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

const CaisseTransactionsModal = ({ isOpen, onClose, caisse }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({
    totalPaiements: 0,
    totalDepenses: 0,
    soldeInitial: 0,
    soldeCalcule: 0
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  useEffect(() => {
    if (isOpen && caisse) {
      fetchTransactions();
    }
  }, [isOpen, caisse]);

  const fetchTransactions = async (page = 1, itemsPerPage = 10) => {
    try {
      setLoading(true);
      const response = await api.get(`/caisses/${caisse.id}/transactions?page=${page}&limit=${itemsPerPage}`);
      
      if (response.data.success) {
        setTransactions(response.data.transactions);
        setSummary(response.data.summary);
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des transactions:', error);
      toast.error('Erreur lors de la récupération des transactions');
    } finally {
      setLoading(false);
    }
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

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionTypeColor = (type) => {
    switch (type) {
      case 'Paiement':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Dépense':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Validé':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Rejeté':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handlePageChange = (newPage) => {
    fetchTransactions(newPage, pagination.itemsPerPage);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setPagination(prev => ({ ...prev, itemsPerPage: newItemsPerPage }));
    fetchTransactions(1, newItemsPerPage);
  };

  const generatePDF = async () => {
    try {
      toast.loading('Génération du rapport PDF...');
      
      // Récupérer toutes les transactions pour le PDF
      const response = await api.get(`/caisses/${caisse.id}/transactions?page=1&limit=1000`);
      
      if (!response.data.success) {
        throw new Error('Erreur lors de la récupération des transactions');
      }
      
      const allTransactions = response.data.transactions;
      const summary = response.data.summary;
      
      // Créer une nouvelle fenêtre pour l'impression
      const printWindow = window.open('', '_blank', 'width=1000,height=800');
      
      if (!printWindow) {
        throw new Error('Impossible d\'ouvrir la fenêtre d\'impression');
      }
      
      // Contenu HTML pour l'impression
      const printContent = `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="utf-8">
          <title>Rapport des Transactions - ${caisse.nom}</title>
          <style>
            @media print {
              @page {
                size: A4;
                margin: 1.5cm;
              }
              body { margin: 0; }
              .no-print { display: none !important; }
            }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #1f2937;
              margin: 0;
              padding: 20px;
              background: white;
            }
            .header {
              background: linear-gradient(135deg, #3b82f6, #1d4ed8);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 12px 12px 0 0;
              margin-bottom: 0;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: bold;
              text-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header h2 {
              margin: 10px 0 0 0;
              font-size: 18px;
              font-weight: normal;
              opacity: 0.9;
            }
            .info-section {
              background: #f8fafc;
              padding: 20px;
              border: 1px solid #e2e8f0;
              border-top: none;
            }
            .info-section h3 {
              margin: 0 0 15px 0;
              color: #374151;
              font-size: 16px;
              font-weight: bold;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
            }
            .summary-section {
              background: white;
              padding: 25px;
              border: 1px solid #e2e8f0;
              border-top: none;
            }
            .summary-section h3 {
              margin: 0 0 20px 0;
              color: #374151;
              font-size: 18px;
              font-weight: bold;
            }
            .summary-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 15px;
            }
            .summary-card {
              border-radius: 12px;
              padding: 20px;
              text-align: center;
              border: 2px solid;
            }
            .summary-card.blue {
              background: linear-gradient(135deg, #dbeafe, #bfdbfe);
              border-color: #3b82f6;
            }
            .summary-card.green {
              background: linear-gradient(135deg, #dcfce7, #bbf7d0);
              border-color: #22c55e;
            }
            .summary-card.red {
              background: linear-gradient(135deg, #fef2f2, #fecaca);
              border-color: #ef4444;
            }
            .summary-card.yellow {
              background: linear-gradient(135deg, #fefce8, #fef3c7);
              border-color: #f59e0b;
            }
            .summary-card .label {
              font-size: 12px;
              font-weight: bold;
              margin-bottom: 8px;
              text-transform: uppercase;
            }
            .summary-card .value {
              font-size: 18px;
              font-weight: bold;
              color: #1e293b;
            }
            .transactions-section {
              background: white;
              padding: 25px;
              border: 1px solid #e2e8f0;
              border-top: none;
              border-radius: 0 0 12px 12px;
            }
            .transactions-section h3 {
              margin: 0 0 20px 0;
              color: #374151;
              font-size: 18px;
              font-weight: bold;
            }
            .transactions-table {
              width: 100%;
              border-collapse: collapse;
              background: white;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            .transactions-table thead tr {
              background: linear-gradient(135deg, #3b82f6, #1d4ed8);
              color: white;
            }
            .transactions-table th,
            .transactions-table td {
              padding: 12px;
              text-align: left;
              border-bottom: 1px solid #e5e7eb;
            }
            .transactions-table th {
              font-weight: bold;
              font-size: 14px;
            }
            .transactions-table td {
              font-size: 13px;
            }
            .transactions-table tbody tr:nth-child(even) {
              background: #f8fafc;
            }
            .transactions-table tbody tr:nth-child(odd) {
              background: white;
            }
            .amount-positive {
              color: #059669;
              font-weight: bold;
            }
            .amount-negative {
              color: #dc2626;
              font-weight: bold;
            }
            .status-badge {
              display: inline-block;
              padding: 4px 8px;
              border-radius: 6px;
              font-size: 11px;
              font-weight: bold;
            }
            .status-valid {
              background: #dcfce7;
              color: #166534;
            }
            .status-pending {
              background: #fef3c7;
              color: #92400e;
            }
            .status-rejected {
              background: #fef2f2;
              color: #991b1b;
            }
            .footer {
              margin-top: 30px;
              padding: 20px;
              background: #f8fafc;
              border-radius: 8px;
              border: 1px solid #e2e8f0;
            }
            .footer-content {
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 12px;
              color: #6b7280;
            }
            .print-button {
              position: fixed;
              top: 20px;
              right: 20px;
              background: #3b82f6;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 8px;
              cursor: pointer;
              font-size: 14px;
              font-weight: bold;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .print-button:hover {
              background: #2563eb;
            }
          </style>
        </head>
        <body>
          <button class="print-button no-print" onclick="window.print()">
            🖨️ Imprimer en PDF
          </button>
          
          <div class="header">
            <h1>📊 RAPPORT DES TRANSACTIONS</h1>
            <h2>Caisse: ${caisse.nom}</h2>
          </div>
          
          <div class="info-section">
            <h3>📅 Informations du rapport</h3>
            <div class="info-grid">
              <div>
                <p><strong>Généré le:</strong> ${new Date().toLocaleDateString('fr-FR', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
                <p><strong>Devise:</strong> ${caisse.devise}</p>
              </div>
              <div>
                <p><strong>Total transactions:</strong> ${allTransactions.length}</p>
                <p><strong>Utilisateur:</strong> ${caisse.nom}</p>
              </div>
            </div>
          </div>
          
          <div class="summary-section">
            <h3>💰 RÉSUMÉ DU SOLDE</h3>
            <div class="summary-grid">
              <div class="summary-card blue">
                <div class="label" style="color: #1e40af;">SOLDE INITIAL</div>
                <div class="value">${formatCurrency(summary.soldeInitial, caisse.devise)}</div>
              </div>
              <div class="summary-card green">
                <div class="label" style="color: #166534;">PAIEMENTS</div>
                <div class="value">+${formatCurrency(summary.totalPaiements, caisse.devise)}</div>
              </div>
              <div class="summary-card red">
                <div class="label" style="color: #991b1b;">DÉPENSES</div>
                <div class="value">-${formatCurrency(summary.totalDepensesComplet, caisse.devise)}</div>
              </div>
              <div class="summary-card yellow">
                <div class="label" style="color: #92400e;">SOLDE FINAL</div>
                <div class="value">${formatCurrency(summary.soldeCalcule, caisse.devise)}</div>
              </div>
            </div>
          </div>
          
          <div class="transactions-section">
            <h3>📋 DÉTAIL DES TRANSACTIONS</h3>
            <table class="transactions-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Référence</th>
                  <th>Type</th>
                  <th style="text-align: right;">Montant</th>
                  <th style="text-align: center;">Statut</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                ${allTransactions.map((transaction, index) => {
                  const amount = parseFloat(transaction.montant || 0);
                  const isPositive = amount > 0;
                  const statusClass = transaction.statut === 'Validé' || transaction.statut === 'Payée' ? 'status-valid' : 
                                   transaction.statut === 'En attente' ? 'status-pending' : 'status-rejected';
                  return `
                    <tr>
                      <td>${new Date(transaction.date).toLocaleDateString('fr-FR')}</td>
                      <td style="font-family: monospace;">${transaction.reference || '-'}</td>
                      <td>${transaction.type_paiement || transaction.type || '-'}</td>
                      <td style="text-align: right;" class="${isPositive ? 'amount-positive' : 'amount-negative'}">
                        ${formatCurrency(transaction.montant, transaction.devise || caisse.devise)}
                      </td>
                      <td style="text-align: center;">
                        <span class="status-badge ${statusClass}">
                          ${transaction.statut || '-'}
                        </span>
                      </td>
                      <td>${transaction.description || '-'}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
          
          <div class="footer">
            <div class="footer-content">
              <div style="font-weight: bold;">
                🏨 Hôtel Beatrice - Système de Gestion
              </div>
              <div style="text-align: center;">
                Rapport généré le ${new Date().toLocaleString('fr-FR')}
              </div>
              <div>
                Page 1 sur 1
              </div>
            </div>
          </div>
        </body>
        </html>
      `;
      
      printWindow.document.open();
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      
      // Attendre que le contenu soit chargé puis déclencher l'impression
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      };
      
      toast.dismiss();
      toast.success('Rapport PDF généré avec succès !');
      
    } catch (error) {
      toast.dismiss();
      console.error('Erreur lors de la génération du PDF:', error);
      toast.error('Erreur lors de la génération du PDF');
    }
  };

  if (!isOpen || !caisse) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                📊 Détails des Transactions - {caisse.nom}
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
            {/* Résumé des transactions */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
              <h4 className="text-md font-semibold text-blue-800 dark:text-blue-200 mb-3">
                💰 Résumé du Solde
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-sm text-blue-600 dark:text-blue-400">Solde Initial</div>
                  <div className="text-lg font-bold text-blue-800 dark:text-blue-200">
                    {formatCurrency(summary.soldeInitial, caisse.devise)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-green-600 dark:text-green-400">Total Paiements</div>
                  <div className="text-lg font-bold text-green-800 dark:text-green-200">
                    +{formatCurrency(summary.totalPaiements, caisse.devise)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-red-600 dark:text-red-400">Total Dépenses</div>
                  <div className="text-lg font-bold text-red-800 dark:text-red-200">
                    -{formatCurrency(summary.totalDepensesComplet, caisse.devise)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-purple-600 dark:text-purple-400">Solde Calculé</div>
                  <div className="text-lg font-bold text-purple-800 dark:text-purple-200">
                    {formatCurrency(summary.soldeCalcule, caisse.devise)}
                  </div>
                </div>
              </div>
              
              {/* Détail des dépenses */}
              <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="text-center">
                    <div className="text-gray-600 dark:text-gray-400">Dépenses régulières</div>
                    <div className="font-medium text-gray-800 dark:text-gray-200">
                      -{formatCurrency(summary.totalDepenses, caisse.devise)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-600 dark:text-gray-400">Paiements partiels</div>
                    <div className="font-medium text-gray-800 dark:text-gray-200">
                      -{formatCurrency(summary.totalPaiementsPartiels, caisse.devise)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Liste des transactions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-md font-semibold text-gray-900 dark:text-white">
                  📋 Transactions ({pagination.totalItems})
                </h4>
                <div className="flex space-x-2">
                  <button
                    onClick={generatePDF}
                    disabled={loading}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
                    Générer PDF
                  </button>
                  <button
                    onClick={fetchTransactions}
                    disabled={loading}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? 'Actualisation...' : 'Actualiser'}
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Chargement des transactions...
                  </p>
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 text-gray-400 mx-auto mb-4">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Aucune transaction trouvée
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Cette caisse n'a pas encore de transactions
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Référence
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Montant
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {transactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {formatDate(transaction.date_paiement || transaction.date_depense)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {transaction.reference || transaction.numero_facture}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTransactionTypeColor(transaction.type_paiement || 'Dépense')}`}>
                              {transaction.type_paiement || 'Dépense'}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {formatCurrency(transaction.montant, transaction.devise || caisse.devise)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(transaction.statut)}`}>
                              {transaction.statut}
                            </span>
                          </td>
                                                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                             {transaction.description || '-'}
                           </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-gray-700 dark:text-gray-300">
                      Éléments par page:
                    </label>
                    <select
                      value={pagination.itemsPerPage}
                      onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value))}
                      className="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Page {pagination.currentPage} sur {pagination.totalPages}
                    </span>
                    
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handlePageChange(1)}
                        disabled={pagination.currentPage === 1}
                        className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        ⏮️
                      </button>
                      <button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={!pagination.hasPrevPage}
                        className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        ◀️
                      </button>
                      <button
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={!pagination.hasNextPage}
                        className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        ▶️
                      </button>
                      <button
                        onClick={() => handlePageChange(pagination.totalPages)}
                        disabled={pagination.currentPage === pagination.totalPages}
                        className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        ⏭️
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaisseTransactionsModal;
