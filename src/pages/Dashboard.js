import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import {
  BuildingOfficeIcon,
  ExclamationTriangleIcon,
  ClipboardDocumentListIcon,
  BanknotesIcon,
  UsersIcon,
  ChartBarIcon,
  BellIcon,
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();
  const { startRealTimeSimulation, stopSimulation, isSimulationActive, addNotification } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Fonction pour récupérer les statistiques
  const fetchDashboardStats = useCallback(async () => {
    try {
      // Check if user is authenticated
      if (!user) {
        console.log('User not authenticated, skipping stats fetch');
        setLoading(false);
        return;
      }

      console.log('Fetching dashboard stats...');
      
      // Try to fetch comprehensive stats from the new dashboard endpoint
      let statsData = {
        rooms: { stats: { total: 0, available: 0 } },
        issues: { stats: { total: 0, urgent: 0 } },
        tasks: { stats: { total: 0, completed: 0 } },
        expenses: { stats: { totalAmount: 0, pending: 0 } }
      };

      try {
        const dashboardRes = await api.get('/dashboard/stats');
        console.log('Dashboard stats response:', dashboardRes.data);

        // Map the new comprehensive stats to the expected format
        const overview = dashboardRes.data.overview;
        statsData = {
          rooms: { stats: overview.rooms },
          issues: { stats: overview.issues },
          tasks: { stats: overview.tasks },
          expenses: { stats: overview.expenses },
          users: overview.users,
          assignments: overview.assignments,
          systemHealth: dashboardRes.data.systemHealth,
          overallScore: dashboardRes.data.overallScore
        };
      } catch (apiError) {
        console.error('API Error:', apiError);
        // Fallback to individual endpoints if dashboard endpoint fails
        if (apiError.response?.status === 401) {
          toast.error('Session expirée. Veuillez vous reconnecter.');
        } else {
          console.log('Dashboard endpoint failed, trying individual endpoints...');
          try {
            const [roomsRes, issuesRes, tasksRes, expensesRes] = await Promise.all([
              api.get('/chambres/stats/overview'),
              api.get('/problematiques/stats/overview'),
              api.get('/taches/stats/overview'),
              api.get('/depenses/stats/overview'),
            ]);

            statsData = {
              rooms: roomsRes.data,
              issues: issuesRes.data,
              tasks: tasksRes.data,
              expenses: expensesRes.data,
            };
          } catch (fallbackError) {
            console.error('Fallback API Error:', fallbackError);
            // Demo data for testing (comment out in production)
            if (process.env.NODE_ENV === 'development') {
              statsData = {
                rooms: { stats: { total: 5, available: 2, occupied: 1, maintenance: 1, cleaning: 1 } },
                issues: { stats: { total: 4, urgent: 1, open: 2, inProgress: 1, resolved: 1 } },
                tasks: { stats: { total: 4, completed: 2, pending: 1, inProgress: 1, urgent: 1 } },
                expenses: { stats: { totalAmount: 501.25, pending: 1, approved: 2, paid: 1 } },
              };
            }
          }
        }
      }

      setStats(statsData);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error in fetchDashboardStats:', error);
      toast.error('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Mettre à jour les stats quand l'utilisateur change
  useEffect(() => {
    if (user) {
      fetchDashboardStats();
      // Démarrer la simulation de notifications en temps réel
      const cleanup = startRealTimeSimulation();
      return cleanup;
    }
  }, [user, fetchDashboardStats]);

  // Mettre à jour les stats à chaque fois qu'on revient sur le dashboard
  useEffect(() => {
    if (location.pathname === '/dashboard' && user) {
      console.log('Dashboard focused, refreshing stats...');
      fetchDashboardStats();
    }
  }, [location.pathname, user, fetchDashboardStats]);

  // Mettre à jour les stats toutes les 30 secondes pour le temps réel
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      console.log('Auto-refreshing dashboard stats...');
      fetchDashboardStats();
    }, 30000); // 30 secondes

    return () => clearInterval(interval);
  }, [user, fetchDashboardStats]);

  // Fonction pour forcer la mise à jour manuelle
  const refreshStats = () => {
    setLoading(true);
    fetchDashboardStats();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="card">
      <div className="card-body">
        <div className="flex items-center">
          <div className={`flex-shrink-0 p-3 rounded-lg ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {title}
            </p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {value}
            </p>
            {subtitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header avec bouton de rafraîchissement */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tableau de bord
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Bienvenue, {user?.prenom} {user?.nom}
          </p>
          {lastUpdate && (
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              Dernière mise à jour: {lastUpdate.toLocaleTimeString('fr-FR')}
            </p>
          )}
        </div>
        <button
          onClick={refreshStats}
          disabled={loading}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {loading ? 'Actualisation...' : 'Actualiser'}
        </button>
      </div>

      {/* System Health Overview */}
      {stats?.overallScore && (
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Santé du système
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Score global: {stats.overallScore}%
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                parseFloat(stats.overallScore) >= 80 ? 'bg-green-100 text-green-800' :
                parseFloat(stats.overallScore) >= 60 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {parseFloat(stats.overallScore) >= 80 ? 'Excellent' :
                 parseFloat(stats.overallScore) >= 60 ? 'Bon' : 'Attention'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Espaces"
          value={stats?.rooms?.stats?.total || 0}
          icon={BuildingOfficeIcon}
          color="bg-primary-600"
          subtitle={`${stats?.rooms?.stats?.available || 0} disponibles`}
        />
        <StatCard
          title="Problématiques"
          value={stats?.issues?.stats?.total || 0}
          icon={ExclamationTriangleIcon}
          color="bg-warning-600"
          subtitle={`${stats?.issues?.stats?.urgent || 0} urgentes`}
        />
        <StatCard
          title="Tâches"
          value={stats?.tasks?.stats?.total || 0}
          icon={ClipboardDocumentListIcon}
          color="bg-success-600"
          subtitle={`${stats?.tasks?.stats?.completed || 0} terminées`}
        />
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Actions rapides
          </h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button 
              onClick={() => navigate('/spaces')}
              className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 dark:border-gray-600 dark:hover:border-primary-400 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <BuildingOfficeIcon className="h-8 w-8 text-gray-400" />
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Nouvel espace
              </span>
            </button>
            <button 
              onClick={() => navigate('/issues')}
              className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-warning-500 hover:bg-warning-50 dark:border-gray-600 dark:hover:border-warning-400 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <ExclamationTriangleIcon className="h-8 w-8 text-gray-400" />
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Nouvelle problématique
              </span>
            </button>
            <button 
              onClick={() => navigate('/tasks')}
              className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-success-500 hover:bg-success-50 dark:border-gray-600 dark:hover:border-success-400 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <ClipboardDocumentListIcon className="h-8 w-8 text-gray-400" />
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Nouvelle tâche
              </span>
            </button>
            <button 
              onClick={() => navigate('/expenses')}
              className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-secondary-500 hover:bg-secondary-50 dark:border-gray-600 dark:hover:border-secondary-400 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <BanknotesIcon className="h-8 w-8 text-gray-400" />
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Nouvelle dépense
              </span>
            </button>
            <button 
              onClick={() => {
                addNotification({
                  title: 'Test de notification',
                  message: 'Ceci est une notification de test pour vérifier le système',
                  type: 'info',
                  link: '/notifications'
                });
                toast.success('Notification de test ajoutée !');
              }}
              className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:border-gray-600 dark:hover:border-blue-400 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <BellIcon className="h-8 w-8 text-gray-400" />
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Test notification
              </span>
            </button>
            <button 
              onClick={() => navigate('/notifications')}
              className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 dark:border-gray-600 dark:hover:border-green-400 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="relative">
                <BellIcon className="h-8 w-8 text-gray-400" />
                {isSimulationActive && (
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                )}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                {isSimulationActive ? 'Simulation active' : 'Notifications'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Activité récente
          </h3>
        </div>
        <div className="card-body">
          <div className="text-center py-8">
            <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              Aucune activité récente
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Les activités récentes apparaîtront ici.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 