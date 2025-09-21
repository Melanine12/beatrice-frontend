import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  CreditCardIcon,
  WalletIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

const FinancialReports = () => {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    profitMargin: 0,
    monthlyRevenue: [],
    monthlyExpenses: [],
    monthlyDataByCurrency: {}, // Nouvelles données mensuelles par devise
    topRevenueSources: [],
    expenseBreakdown: [],
    totalCashBalance: 0,
    caisses: [],
    paymentStatsByStatus: [],
    paymentStatsByType: [],
    recentPayments: [],
    revenueByCurrency: [],
    expensesByCurrency: [],
    totalAllTimeRevenueByCurrency: {}
  });

  // Fonction pour déterminer la devise principale
  const getMainCurrency = () => {
    if (stats.caisses.length > 0) {
      return stats.caisses[0].devise || 'FC';
    }
    return 'FC';
  };

  // Fonction pour formater les montants dans toutes les devises
  const formatAmount = (amount, currency = 'FC') => {
    const supportedCurrencies = ['EUR', 'USD', 'GBP', 'JPY'];
    
    if (supportedCurrencies.includes(currency)) {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: currency
      }).format(amount);
    } else {
      return new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }).format(amount) + ' ' + currency;
    }
  };

  // Fonction pour calculer les totaux par devise
  const calculateTotalsByCurrency = (payments) => {
    if (!payments || !Array.isArray(payments) || payments.length === 0) {
      return {};
    }
    
    const totalsByCurrency = {};
    
    payments.forEach(payment => {
      const devise = payment.devise || 'FC';
      const montant = parseFloat(payment.montant) || 0;
      
      if (!totalsByCurrency[devise]) {
        totalsByCurrency[devise] = {
          total: 0,
          revenue: 0,
          expenses: 0,
          payments: 0,
          demands: 0
        };
      }
      
      totalsByCurrency[devise].total += montant;
      
      if (payment.type_paiement === 'Dépense' || payment.statut === 'Rejeté') {
        totalsByCurrency[devise].expenses += montant;
        totalsByCurrency[devise].demands += montant;
      } else {
        totalsByCurrency[devise].revenue += montant;
        totalsByCurrency[devise].payments += montant;
      }
    });
    
    return totalsByCurrency;
  };

  // Fonction pour générer le rapport PDF avec l'API native
  const generatePDFReport = async () => {
    try {
      setGeneratingPDF(true);
      
      // Créer une nouvelle fenêtre pour l'impression
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      
      // Contenu HTML pour l'impression
      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>États Financiers</title>
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
              color: #333;
              margin: 0;
              padding: 20px;
              background: white;
            }
            .header {
              background: linear-gradient(135deg, #3b82f6, #1d4ed8);
              color: white;
              padding: 25px;
              text-align: center;
              border-radius: 8px;
              margin-bottom: 25px;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
              font-weight: bold;
            }
            .header .date {
              margin-top: 8px;
              font-size: 12px;
              opacity: 0.9;
            }
            .section {
              margin-bottom: 25px;
              page-break-inside: avoid;
            }
            .section h2 {
              color: #3b82f6;
              font-size: 18px;
              border-bottom: 2px solid #3b82f6;
              padding-bottom: 8px;
              margin-bottom: 15px;
            }
            .summary-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 15px;
              margin-bottom: 15px;
            }
            .summary-item {
              background: #f8fafc;
              padding: 15px;
              border-radius: 6px;
              border-left: 3px solid #3b82f6;
            }
            .summary-item h3 {
              margin: 0 0 8px 0;
              color: #64748b;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .summary-item .value {
              font-size: 20px;
              font-weight: bold;
              color: #1e293b;
            }
            .currency-item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 12px;
              background: #f1f5f9;
              margin-bottom: 8px;
              border-radius: 5px;
              border: 1px solid #e2e8f0;
            }
            .currency-label {
              font-weight: bold;
              color: #3b82f6;
              font-size: 16px;
            }
            .currency-details {
              text-align: right;
              font-size: 12px;
            }
            .currency-details div {
              margin-bottom: 3px;
            }
            .expense-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 12px;
              font-size: 11px;
            }
            .expense-table th,
            .expense-table td {
              border: 1px solid #d1d5db;
              padding: 8px;
              text-align: left;
            }
            .expense-table th {
              background: #3b82f6;
              color: white;
              font-weight: bold;
            }
            .expense-table tr:nth-child(even) {
              background: #f8fafc;
            }
            .payments-summary {
              background: #f0f9ff;
              padding: 15px;
              border-radius: 6px;
              margin-bottom: 15px;
              font-size: 12px;
            }
            .payments-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 12px;
              font-size: 10px;
            }
            .payments-table th,
            .payments-table td {
              border: 1px solid #d1d5db;
              padding: 6px;
              text-align: left;
            }
            .payments-table th {
              background: #3b82f6;
              color: white;
              font-weight: bold;
            }
            .payments-table tr:nth-child(even) {
              background: #f8fafc;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 15px;
              border-top: 1px solid #e2e8f0;
              color: #64748b;
              font-size: 10px;
            }
            .print-button {
              position: fixed;
              top: 20px;
              right: 20px;
              background: #3b82f6;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 5px;
              cursor: pointer;
              font-size: 14px;
              font-weight: bold;
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
            <h1>📊 ÉTATS FINANCIERS</h1>
            <div class="date">Généré le ${new Date().toLocaleDateString('fr-FR', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</div>
          </div>

          <div class="section">
            <h2>📈 RÉSUMÉ EXÉCUTIF</h2>
            <div class="summary-grid">
              <div class="summary-item">
                <h3>Revenus Totaux</h3>
                <div class="value">${formatAmount(stats.totalRevenue, getMainCurrency())}</div>
              </div>
              <div class="summary-item">
                <h3>Dépenses Totales</h3>
                <div class="value">${formatAmount(stats.totalExpenses, getMainCurrency())}</div>
              </div>
              <div class="summary-item">
                <h3>Bénéfice Net</h3>
                <div class="value" style="color: ${stats.netProfit >= 0 ? '#059669' : '#dc2626'}">
                  ${formatAmount(stats.netProfit, getMainCurrency())}
                </div>
              </div>
              <div class="summary-item">
                <h3>Marge Bénéficiaire</h3>
                <div class="value">${stats.profitMargin.toFixed(1)}%</div>
              </div>
            </div>
          </div>

          ${stats.revenueByCurrency && stats.revenueByCurrency.length > 0 ? `
          <div class="section">
            <h2>💱 INDICATEURS PAR DEVISE</h2>
            ${stats.revenueByCurrency.map((revenueItem) => {
              const devise = revenueItem.devise;
              const revenue = revenueItem.total;
              const expenses = stats.expensesByCurrency 
                ? stats.expensesByCurrency.find(item => item.devise === devise)?.total || 0
                : 0;
              const netProfit = revenue - expenses;
              
              return `
                <div class="currency-item">
                  <div class="currency-label">${devise}</div>
                  <div class="currency-details">
                    <div><strong>Revenus:</strong> ${formatAmount(revenue, devise)}</div>
                    <div><strong>Dépenses:</strong> ${formatAmount(expenses, devise)}</div>
                    <div><strong>Bénéfice:</strong> ${formatAmount(netProfit, devise)}</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
          ` : ''}

          ${stats.expenseBreakdown && stats.expenseBreakdown.length > 0 ? `
          <div class="section">
            <h2>📊 RÉPARTITION DES DÉPENSES</h2>
            <table class="expense-table">
              <thead>
                <tr>
                  <th>Catégorie</th>
                  <th>Montant</th>
                  <th>Pourcentage</th>
                </tr>
              </thead>
              <tbody>
                ${stats.expenseBreakdown.map(expense => `
                  <tr>
                    <td>${expense.category}</td>
                    <td>${formatAmount(expense.amount, getMainCurrency())}</td>
                    <td>${expense.percentage}%</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          ` : ''}

          ${stats.recentPayments && stats.recentPayments.length > 0 ? `
          <div class="section">
            <h2>💳 PAIEMENTS RÉCENTS (30 derniers jours)</h2>
            
            <div class="payments-summary">
              <h3>Statistiques par Devise</h3>
              ${(() => {
                const currencyStats = {};
                stats.recentPayments.forEach(payment => {
                  const devise = payment.devise || 'FC';
                  if (!currencyStats[devise]) {
                    currencyStats[devise] = { total: 0, count: 0 };
                  }
                  currencyStats[devise].total += parseFloat(payment.montant || 0);
                  currencyStats[devise].count += 1;
                });
                
                return Object.entries(currencyStats).map(([devise, data]) => `
                  <div style="margin-bottom: 8px;">
                    <strong>${devise}:</strong> ${formatAmount(data.total, devise)} (${data.count} paiement${data.count > 1 ? 's' : ''})
                  </div>
                `).join('');
              })()}
            </div>

            <table class="payments-table">
              <thead>
                <tr>
                  <th>Référence</th>
                  <th>Montant</th>
                  <th>Devise</th>
                  <th>Type</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                ${stats.recentPayments.slice(0, 20).map(payment => `
                  <tr>
                    <td>${payment.reference || payment.id}</td>
                    <td>${formatAmount(payment.montant, payment.devise)}</td>
                    <td>${payment.devise}</td>
                    <td>${payment.type_paiement}</td>
                    <td>${new Date(payment.date_paiement).toLocaleDateString('fr-FR')}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          ` : ''}

          <div class="footer">
            <p>Rapport généré automatiquement par le système de gestion hôtelière</p>
            <p>© ${new Date().getFullYear()} - Tous droits réservés</p>
          </div>
        </body>
        </html>
      `;
      
      // Écrire le contenu dans la nouvelle fenêtre
      printWindow.document.write(printContent);
      printWindow.document.close();
      
      // Attendre que le contenu soit chargé puis lancer l'impression
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          // Fermer la fenêtre après l'impression
          printWindow.onafterprint = () => {
            printWindow.close();
          };
        }, 500);
      };
      
      toast.success('Rapport prêt ! La fenêtre d\'impression s\'ouvre automatiquement.');
      
    } catch (error) {
      console.error('Erreur lors de la génération du rapport:', error);
      toast.error('Erreur lors de la génération du rapport');
    } finally {
      setGeneratingPDF(false);
    }
  };

  const mainCurrency = getMainCurrency();

  useEffect(() => {
    if (isAuthenticated) {
      fetchFinancialStats();
    }
  }, [isAuthenticated]);

  const fetchFinancialStats = async () => {
    try {
      setLoading(true);
      
      const response = await api.get('/paiements/reports/financial');
      
      if (response.data.success) {
        const data = response.data.data;
        console.log('📊 Données financières reçues:', data);
        console.log('💰 Recent Payments:', data.recentPayments);
        console.log('💸 Expenses by Currency:', data.expensesByCurrency);
        
        setStats({
          totalRevenue: data.totalRevenue,
          totalExpenses: data.totalExpenses,
          netProfit: data.netProfit,
          profitMargin: data.profitMargin,
          monthlyRevenue: data.monthlyRevenue,
          monthlyExpenses: data.monthlyExpenses,
          monthlyDataByCurrency: data.monthlyDataByCurrency, // Ajout des données mensuelles
          topRevenueSources: data.topRevenueSources,
          expenseBreakdown: data.expenseBreakdown,
          totalCashBalance: data.totalCashBalance,
          caisses: data.caisses,
          paymentStatsByStatus: data.paymentStatsByStatus,
          paymentStatsByType: data.paymentStatsByType,
          recentPayments: data.recentPayments,
          revenueByCurrency: data.revenueByCurrency,
          expensesByCurrency: data.expensesByCurrency,
          totalAllTimeRevenueByCurrency: data.totalAllTimeRevenueByCurrency
        });
      } else {
        throw new Error('Erreur lors de la récupération des données');
      }
    } catch (error) {
      console.error('Error fetching financial stats:', error);
      toast.error('Erreur lors du chargement des états financiers');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Accès non autorisé
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Vous devez être connecté pour accéder aux états financiers.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            États Financiers
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Analysez les performances financières de l'hôtel
          </p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={fetchFinancialStats}
            disabled={loading}
            className="btn-secondary"
          >
            <ArrowPathIcon className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Actualisation...' : 'Actualiser'}
          </button>
          <button 
            onClick={generatePDFReport}
            disabled={generatingPDF}
            className="btn-primary"
          >
            <DocumentArrowDownIcon className={`w-5 h-5 mr-2 ${generatingPDF ? 'animate-spin' : ''}`} />
            {generatingPDF ? 'Génération...' : 'Générer Rapport'}
          </button>
        </div>
      </div>


      {/* Statistiques rapides des paiements récents - Séparées par devise */}
      {stats.recentPayments && Array.isArray(stats.recentPayments) && stats.recentPayments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Statistiques pour FC */}
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">Total FC</p>
                <p className="text-lg font-bold text-green-600">
                  {(() => {
                    const fcPayments = stats.recentPayments.filter(p => p.devise === 'FC');
                    const total = fcPayments.reduce((sum, p) => sum + parseFloat(p.montant || 0), 0);
                    return formatAmount(total, 'FC');
                  })()}
                </p>
                <p className="text-xs text-green-700 dark:text-green-300">
                  {(() => {
                    const fcPayments = stats.recentPayments.filter(p => p.devise === 'FC');
                    return `${fcPayments.length} paiement(s)`;
                  })()}
                </p>
              </div>
            </div>
          </div>

          {/* Statistiques pour EUR */}
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2V7a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-800 dark:text-purple-200">Total EUR</p>
                <p className="text-lg font-bold text-purple-600">
                  {(() => {
                    const eurPayments = stats.recentPayments.filter(p => p.devise === 'EUR');
                    const total = eurPayments.reduce((sum, p) => sum + parseFloat(p.montant || 0), 0);
                    return formatAmount(total, 'EUR');
                  })()}
                </p>
                <p className="text-xs text-purple-700 dark:text-purple-300">
                  {(() => {
                    const eurPayments = stats.recentPayments.filter(p => p.devise === 'EUR');
                    return `${eurPayments.length} paiement(s)`;
                  })()}
                </p>
              </div>
            </div>
          </div>

          {/* Statistiques pour USD */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Total USD</p>
                <p className="text-lg font-bold text-blue-600">
                  {(() => {
                    const usdPayments = stats.recentPayments.filter(p => p.devise === 'USD');
                    const total = usdPayments.reduce((sum, p) => sum + parseFloat(p.montant || 0), 0);
                    return formatAmount(total, 'USD');
                  })()}
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  {(() => {
                    const usdPayments = stats.recentPayments.filter(p => p.devise === 'USD');
                    return `${usdPayments.length} paiement(s)`;
                  })()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Section - SUPPRIMÉE */}
      {/* Les 3 cartes "Revenus vs Dépenses" ont été supprimées car elles ne fonctionnaient pas correctement */}


      {/* Expense Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Répartition des Dépenses
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {stats.expenseBreakdown.map((expense, index) => (
            <div key={expense.category} className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-2">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={index === 0 ? '#3b82f6' : 
                           index === 1 ? '#10b981' : 
                           index === 2 ? '#f59e0b' : 
                           index === 3 ? '#8b5cf6' : '#6b7280'}
                    strokeWidth="2"
                    strokeDasharray={`${expense.percentage}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-semibold text-gray-900 dark:text-white">
                    {expense.percentage}%
                  </span>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {expense.category}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {expense.amount.toLocaleString()} {mainCurrency}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cash Registers Details */}
      {stats.caisses && Array.isArray(stats.caisses) && stats.caisses.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Détail des Caisses
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.caisses.map((caisse) => (
              <div key={caisse.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {caisse.nom}
                  </h4>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {caisse.devise}
                  </span>
                </div>
                <div className="text-2xl font-bold text-emerald-600">
                  {formatAmount(caisse.solde, caisse.devise)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Statistics by Status */}
      {stats.paymentStatsByStatus && Array.isArray(stats.paymentStatsByStatus) && stats.paymentStatsByStatus.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Statistiques des Paiements par Statut
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.paymentStatsByStatus.map((stat) => (
              <div key={stat.status} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {stat.count}
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    {stat.status}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {stat.total.toLocaleString()} {mainCurrency}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Types Statistics */}
      {stats.paymentStatsByType && Array.isArray(stats.paymentStatsByType) && stats.paymentStatsByType.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Répartition des Paiements par Type
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {stats.paymentStatsByType.map((stat, index) => (
              <div key={stat.type} className="text-center">
                <div className="relative w-16 h-16 mx-auto mb-2">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="2"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={index === 0 ? '#3b82f6' : 
                             index === 1 ? '#10b981' : 
                             index === 2 ? '#f59e0b' : 
                             index === 3 ? '#8b5cf6' : '#6b7280'}
                      strokeWidth="2"
                      strokeDasharray={`${(stat.total / stats.totalRevenue * 100)}, 100`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-semibold text-gray-900 dark:text-white">
                      {Math.round((stat.total / stats.totalRevenue) * 100)}%
                    </span>
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {stat.type}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {stat.total.toLocaleString()} {mainCurrency}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Financial Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Résumé Financier
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-400">Revenus moyens/mois:</span>
            <div className="font-semibold text-gray-900 dark:text-white">
              {(stats.totalRevenue / 6).toLocaleString()} {mainCurrency}
            </div>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Dépenses moyennes/mois:</span>
            <div className="font-semibold text-gray-900 dark:text-white">
              {(stats.totalExpenses / 6).toLocaleString()} {mainCurrency}
            </div>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Bénéfice moyen/mois:</span>
            <div className="font-semibold text-green-600">
              {(stats.netProfit / 6).toLocaleString()} {mainCurrency}
            </div>
          </div>
        </div>
      </div>

      {/* Liste des Paiements des 30 Derniers Jours */}
      {stats.recentPayments && Array.isArray(stats.recentPayments) && stats.recentPayments.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                📊 Liste Complète des Paiements (30 derniers jours)
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Détail complet de tous les paiements effectués au cours des 30 derniers jours
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                {stats.recentPayments.length} paiement(s)
              </span>
            </div>
          </div>

          {/* Tableau détaillé des paiements */}
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
                    Devise
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Caisse
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date & Heure
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {stats.recentPayments.map((payment, index) => (
                  <tr key={payment.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {payment.reference}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        ID: {payment.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900 dark:text-white">
                        {formatAmount(payment.montant, payment.devise)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 mt-1">
                        {payment.devise !== 'FC' && (
                          <div>≈ {formatAmount(payment.montant * 2500, 'FC')}</div>
                        )}
                        {payment.devise !== 'EUR' && (
                          <div>≈ {formatAmount(payment.devise === 'FC' ? payment.montant / 2500 : payment.montant * 0.85, 'EUR')}</div>
                        )}
                        {payment.devise !== 'USD' && (
                          <div>≈ {formatAmount(payment.devise === 'FC' ? payment.montant / 2500 : payment.montant / 0.85, 'USD')}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        payment.devise === 'FC' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                        payment.devise === 'USD' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                        payment.devise === 'EUR' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {payment.devise}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        payment.type_paiement === 'Espèces' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                        payment.type_paiement === 'Carte bancaire' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                        payment.type_paiement === 'Chèque' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                        payment.type_paiement === 'Virement' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {payment.type_paiement}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {payment.caisse ? payment.caisse.nom : '-'}
                      </div>
                      {payment.caisse && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Devise: {payment.caisse.devise}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {payment.utilisateur ? `${payment.utilisateur.prenom} ${payment.utilisateur.nom}` : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {new Date(payment.date_paiement).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(payment.date_paiement).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        Validé
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialReports;
