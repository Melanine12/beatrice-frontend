import React, { useState, useEffect } from 'react';
import {
  UsersIcon,
  ClockIcon,
  CalendarIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const RHDashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    pendingRequests: 0,
    completedEvaluations: 0,
    upcomingEvents: 0
  });

  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    // Simuler le chargement des statistiques
    setTimeout(() => {
      setStats({
        totalEmployees: 25,
        pendingRequests: 8,
        completedEvaluations: 12,
        upcomingEvents: 3
      });

      setRecentActivities([
        {
          id: 1,
          type: 'evaluation',
          message: 'Évaluation de Jean Dupont terminée',
          time: 'Il y a 2 heures',
          status: 'completed'
        },
        {
          id: 2,
          type: 'request',
          message: 'Nouvelle demande de congés de Marie Martin',
          time: 'Il y a 4 heures',
          status: 'pending'
        },
        {
          id: 3,
          type: 'hiring',
          message: 'Candidature approuvée pour le poste de Réceptionniste',
          time: 'Il y a 1 jour',
          status: 'completed'
        },
        {
          id: 4,
          type: 'training',
          message: 'Formation "Gestion du stress" programmée',
          time: 'Il y a 2 jours',
          status: 'scheduled'
        }
      ]);
    }, 1000);
  }, []);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'evaluation':
        return <ChartBarIcon className="h-5 w-5 text-blue-500" />;
      case 'request':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'hiring':
        return <UsersIcon className="h-5 w-5 text-green-500" />;
      case 'training':
        return <CalendarIcon className="h-5 w-5 text-purple-500" />;
      default:
        return <ExclamationTriangleIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <ClockIcon className="h-4 w-4 text-yellow-500" />;
      case 'scheduled':
        return <CalendarIcon className="h-4 w-4 text-blue-500" />;
      default:
        return <XCircleIcon className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Tableau de bord RH
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gestion complète des ressources humaines
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UsersIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Total Employés
                </dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-white">
                  {stats.totalEmployees}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Demandes en attente
                </dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-white">
                  {stats.pendingRequests}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Évaluations terminées
                </dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-white">
                  {stats.completedEvaluations}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CalendarIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Événements à venir
                </dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-white">
                  {stats.upcomingEvents}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Activités récentes */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Activités récentes
        </h2>
        <div className="flow-root">
          <ul className="-mb-8">
            {recentActivities.map((activity, activityIdx) => (
              <li key={activity.id}>
                <div className="relative pb-8">
                  {activityIdx !== recentActivities.length - 1 ? (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center ring-8 ring-white dark:ring-gray-800">
                        {getActivityIcon(activity.type)}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {activity.message}
                        </p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                        <span>{activity.time}</span>
                        {getStatusIcon(activity.status)}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Actions rapides
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
            Nouvelle évaluation
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            Ajouter employé
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Planifier formation
          </button>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
            Créer annonce
          </button>
        </div>
      </div>
    </div>
  );
};

export default RHDashboard;
