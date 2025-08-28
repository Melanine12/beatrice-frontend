import React from 'react';
import { 
  CurrencyDollarIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  BellIcon,
  CalendarIcon,
  ExclamationTriangleIcon as ExclamationIcon
} from '@heroicons/react/24/outline';

const ExpensesStats = ({ stats }) => {
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount || 0);
  };

  const formatPercentage = (value) => {
    return `${parseFloat(value).toFixed(1)}%`;
  };

  const getStatusIcon = (status) => {
    const icons = {
      'En attente': ClockIcon,
      'Approuvée': CheckCircleIcon,
      'Payée': CurrencyDollarIcon,
      'Rejetée': XCircleIcon
    };
    return icons[status] || ExclamationTriangleIcon;
  };

  const getStatusColor = (status) => {
    const colors = {
      'En attente': 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900',
      'Approuvée': 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900',
      'Payée': 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900',
      'Rejetée': 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900'
    };
    return colors[status] || 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900';
  };

  if (!stats) return null;

  return (
    <div className="card">
      <div className="card-body">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Total Expenses */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Dépenses
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {stats.total}
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Montant total: {formatAmount(stats.totalAmount)}
              </div>
            </div>
          </div>

          {/* Pending Expenses */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    En Attente
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {stats.pending}
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Montant: {formatAmount(stats.pendingAmount)}
              </div>
            </div>
          </div>

          {/* Approved Expenses */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Approuvées
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {stats.approved}
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Montant: {formatAmount(stats.approvedAmount)}
              </div>
            </div>
          </div>

          {/* Paid Expenses */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Payées
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {stats.paid}
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Montant: {formatAmount(stats.paidAmount)}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Recent Expenses */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Dépenses Récentes (30 jours)
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Nombre:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{stats.recent}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Montant:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{formatAmount(stats.recentAmount)}</span>
              </div>
            </div>
          </div>

          {/* Monthly Expenses */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Dépenses du Mois
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Nombre:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{stats.monthly}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Montant:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{formatAmount(stats.monthlyAmount)}</span>
              </div>
            </div>
          </div>

          {/* Rates */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Taux d'Approbation
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Approbation:</span>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">{formatPercentage(stats.approvalRate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Paiement:</span>
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{formatPercentage(stats.paymentRate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Rejet:</span>
                <span className="text-sm font-medium text-red-600 dark:text-red-400">{formatPercentage(stats.rejectionRate)}</span>
              </div>
            </div>
          </div>

          {/* Paiements et Rappels */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Gestion des Paiements
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Paiements Partiels:</span>
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{stats.paiementsPartiels || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Rappels Actifs:</span>
                <span className="text-sm font-medium text-orange-600 dark:text-orange-400">{stats.rappelsActifs || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Urgences:</span>
                <span className="text-sm font-medium text-red-600 dark:text-red-400">{stats.urgences || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        {stats.expensesByCategory && stats.expensesByCategory.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Répartition par Catégorie
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.expensesByCategory.map((category, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {category.categorie}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {category.count}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">Total:</span>
                      <span className="font-medium">{formatAmount(category.total)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">Moyenne:</span>
                      <span className="font-medium">{formatAmount(category.average)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">Payées:</span>
                      <span className="font-medium text-green-600 dark:text-green-400">{category.paid}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpensesStats; 