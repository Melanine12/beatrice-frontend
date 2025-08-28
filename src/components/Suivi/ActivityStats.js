import React from 'react';
import {
  UserIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const ActivityStats = ({ history, dateFilter }) => {
  // Fonction pour obtenir la date de début selon le filtre
  const getStartDate = (filterType) => {
    const now = new Date();
    switch (filterType) {
      case 'today':
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
      case '3days':
        return new Date(now.getTime() - (3 * 24 * 60 * 60 * 1000));
      case 'week':
        return new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
      case 'month':
        return new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
      default:
        return null;
    }
  };

  // Filtrer l'historique par date
  const filterHistoryByDate = (history) => {
    if (dateFilter === 'all') return history;
    
    const startDate = getStartDate(dateFilter);
    if (!startDate) return history;
    
    return history.filter(activity => {
      const activityDate = new Date(activity.timestamp);
      return activityDate >= startDate;
    });
  };

  const filteredHistory = filterHistoryByDate(history);

  // Calculer les statistiques
  const stats = {
    total: filteredHistory.length,
    checkin: filteredHistory.filter(a => a.type === 'checkin').length,
    checkout: filteredHistory.filter(a => a.type === 'checkout').length,
    cleaning: filteredHistory.filter(a => a.type === 'cleaning').length,
    maintenance: filteredHistory.filter(a => a.type === 'maintenance').length,
    issues: filteredHistory.filter(a => a.type === 'issue').length
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'checkin':
        return <UserIcon className="h-4 w-4 text-green-600" />;
      case 'checkout':
        return <UserIcon className="h-4 w-4 text-red-600" />;
      case 'cleaning':
        return <ClockIcon className="h-4 w-4 text-blue-600" />;
      case 'maintenance':
        return <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600" />;
      case 'issue':
        return <ExclamationTriangleIcon className="h-4 w-4 text-orange-600" />;
      default:
        return <InformationCircleIcon className="h-4 w-4 text-gray-600" />;
    }
  };

  const getFilterLabel = () => {
    switch (dateFilter) {
      case 'today':
        return 'Aujourd\'hui';
      case '3days':
        return '3 derniers jours';
      case 'week':
        return 'Cette semaine';
      case 'month':
        return 'Ce mois';
      default:
        return 'Toutes les dates';
    }
  };

  if (filteredHistory.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Statistiques d'activité
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {getFilterLabel()}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total */}
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.total}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Total
          </div>
        </div>

        {/* Check-in */}
        {stats.checkin > 0 && (
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              {getActivityIcon('checkin')}
            </div>
            <div className="text-lg font-semibold text-green-800 dark:text-green-200">
              {stats.checkin}
            </div>
            <div className="text-xs text-green-600 dark:text-green-400">
              Arrivées
            </div>
          </div>
        )}

        {/* Check-out */}
        {stats.checkout > 0 && (
          <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              {getActivityIcon('checkout')}
            </div>
            <div className="text-lg font-semibold text-red-800 dark:text-red-200">
              {stats.checkout}
            </div>
            <div className="text-xs text-red-600 dark:text-red-400">
              Départs
            </div>
          </div>
        )}

        {/* Nettoyage */}
        {stats.cleaning > 0 && (
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              {getActivityIcon('cleaning')}
            </div>
            <div className="text-lg font-semibold text-blue-800 dark:text-blue-200">
              {stats.cleaning}
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400">
              Nettoyage
            </div>
          </div>
        )}

        {/* Maintenance */}
        {stats.maintenance > 0 && (
          <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              {getActivityIcon('maintenance')}
            </div>
            <div className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
              {stats.maintenance}
            </div>
            <div className="text-xs text-yellow-600 dark:text-yellow-400">
              Maintenance
            </div>
          </div>
        )}

        {/* Problématiques */}
        {stats.issues > 0 && (
          <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              {getActivityIcon('issue')}
            </div>
            <div className="text-lg font-semibold text-orange-800 dark:text-orange-200">
              {stats.issues}
            </div>
            <div className="text-xs text-orange-600 dark:text-orange-400">
              Problématiques
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityStats; 