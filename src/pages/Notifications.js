import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationContext';
import {
  BellIcon,
  CheckIcon,
  XMarkIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ClockIcon,
  PlusIcon,
  FireIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Notifications = () => {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    addNotification,
    startRealTimeSimulation,
    stopSimulation,
    simulateUrgentNotification,
    simulateSystemError,
    simulateProblematicNotification,
    simulateTaskNotification,
    simulateExpenseNotification,
    simulateInventoryNotification,
    simulateErrorNotification,
    isSimulationActive
  } = useNotifications();

  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  const [showSimulator, setShowSimulator] = useState(false);

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'info':
        return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
      case 'error':
        return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />;
      case 'urgent':
        return <FireIcon className="h-5 w-5 text-orange-500" />;
      default:
        return <BellIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'success':
        return 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800';
      case 'info':
        return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800';
      case 'error':
        return 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800';
      case 'urgent':
        return 'border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800';
      default:
        return 'border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)}h`;
    return date.toLocaleDateString('fr-FR');
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    toast.success('Toutes les notifications ont été marquées comme lues');
  };

  const handleClearAll = () => {
    clearAllNotifications();
    toast.success('Toutes les notifications ont été supprimées');
  };



  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Notifications
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {unreadCount} notification{unreadCount > 1 ? 's' : ''} non lue{unreadCount > 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowSimulator(!showSimulator)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Simulateur
            </button>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <CheckIcon className="h-4 w-4 mr-2" />
                Tout marquer comme lu
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-gray-800 dark:border-red-600 dark:text-red-300 dark:hover:bg-red-900/20"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Tout supprimer
              </button>
            )}
          </div>
        </div>

        {/* Simulateur de notifications */}
        {showSimulator && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              🎮 Simulateur de notifications en temps réel
            </h3>
            
            {/* Contrôles de simulation automatique */}
            <div className="mb-6 p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                🔄 Simulation automatique
              </h4>
              <div className="flex items-center space-x-4">
                <button
                  onClick={startRealTimeSimulation}
                  disabled={isSimulationActive}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    isSimulationActive
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-green-100 hover:bg-green-200 text-green-800'
                  }`}
                >
                  ▶️ Démarrer simulation
                </button>
                <button
                  onClick={stopSimulation}
                  disabled={!isSimulationActive}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    !isSimulationActive
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-red-100 hover:bg-red-200 text-red-800'
                  }`}
                >
                  ⏹️ Arrêter simulation
                </button>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  isSimulationActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {isSimulationActive ? '🟢 Simulation active' : '🔴 Simulation inactive'}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                La simulation automatique génère des notifications réalistes toutes les 45 secondes
              </p>
            </div>

            {/* Boutons de simulation manuelle */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <button
                onClick={() => {
                  simulateUrgentNotification();
                  toast.success('Notification urgente simulée !');
                }}
                className="flex items-center justify-center p-3 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded-md transition-colors"
              >
                <FireIcon className="h-5 w-5 mr-2" />
                Urgent
              </button>
              <button
                onClick={() => {
                  simulateProblematicNotification();
                  toast.success('Notification de problématique simulée !');
                }}
                className="flex items-center justify-center p-3 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-md transition-colors"
              >
                <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                Problématique
              </button>
              <button
                onClick={() => {
                  simulateTaskNotification();
                  toast.success('Notification de tâche simulée !');
                }}
                className="flex items-center justify-center p-3 bg-green-100 hover:bg-green-200 text-green-800 rounded-md transition-colors"
              >
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                Tâche
              </button>
              <button
                onClick={() => {
                  simulateExpenseNotification();
                  toast.success('Notification de dépense simulée !');
                }}
                className="flex items-center justify-center p-3 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-md transition-colors"
              >
                <InformationCircleIcon className="h-5 w-5 mr-2" />
                Dépense
              </button>
              <button
                onClick={() => {
                  simulateInventoryNotification();
                  toast.success('Notification d\'inventaire simulée !');
                }}
                className="flex items-center justify-center p-3 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-md transition-colors"
              >
                <BellIcon className="h-5 w-5 mr-2" />
                Inventaire
              </button>
              <button
                onClick={() => {
                  simulateErrorNotification();
                  toast.success('Notification d\'erreur simulée !');
                }}
                className="flex items-center justify-center p-3 bg-red-100 hover:bg-red-200 text-red-800 rounded-md transition-colors"
              >
                <ExclamationCircleIcon className="h-5 w-5 mr-2" />
                Erreur
              </button>
            </div>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              Cliquez sur les boutons pour simuler différents types de notifications en temps réel
            </p>
          </div>
        )}

        {/* Filtres */}
        <div className="mt-6 flex space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              filter === 'all'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Toutes ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              filter === 'unread'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Non lues ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              filter === 'read'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Lues ({notifications.length - unreadCount})
          </button>
        </div>
      </div>

      {/* Liste des notifications */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              Aucune notification
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {filter === 'all' 
                ? 'Vous n\'avez pas encore de notifications'
                : filter === 'unread'
                ? 'Toutes vos notifications ont été lues'
                : 'Aucune notification lue'
              }
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`relative p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
                notification.read
                  ? 'opacity-75'
                  : 'border-primary-300 bg-primary-50 dark:bg-primary-900/20'
              } ${getNotificationColor(notification.type)}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-medium ${
                      notification.read
                        ? 'text-gray-600 dark:text-gray-400'
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {notification.title}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTimestamp(notification.timestamp)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notification.id);
                          toast.success('Notification supprimée');
                        }}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className={`mt-1 text-sm ${
                    notification.read
                      ? 'text-gray-500 dark:text-gray-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {notification.message}
                  </p>
                  {notification.link && (
                    <p className="mt-2 text-xs text-primary-600 dark:text-primary-400">
                      Cliquez pour voir plus de détails
                    </p>
                  )}
                </div>
              </div>
              {!notification.read && (
                <div className="absolute top-4 right-4">
                  <div className="h-2 w-2 bg-primary-600 rounded-full"></div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications; 