import React, { useState, useEffect } from 'react';
import { 
  UsersIcon, 
  CheckCircleIcon, 
  MinusCircleIcon, 
  ClockIcon 
} from '@heroicons/react/24/outline';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const UsersStats = () => {
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors
      console.log('Fetching user stats...');
      const response = await api.get('/users/stats/overview');
      console.log('Stats response:', response.data);
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      console.error('Error response:', err.response);
      setError(err.response?.data?.message || 'Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
    } else {
      setError('Vous devez être connecté pour voir les statistiques');
      setLoading(false);
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="card-body">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>{error}</span>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      title: 'Total Utilisateurs',
      value: stats.stats.total,
      icon: UsersIcon,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Utilisateurs Actifs',
      value: stats.stats.active,
      icon: CheckCircleIcon,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Utilisateurs Inactifs',
      value: stats.stats.inactive,
      icon: MinusCircleIcon,
      color: 'bg-red-500',
      textColor: 'text-red-600'
    },
    {
      title: 'Connexions Récentes',
      value: stats.stats.recentLogins,
      icon: ClockIcon,
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
                    <Icon className={`h-6 w-6 ${stat.textColor}`} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Users by Role */}
      {stats.usersByRole && stats.usersByRole.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Utilisateurs par Rôle
            </h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.usersByRole.map((roleStat, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {roleStat.count}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {roleStat.role}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersStats; 