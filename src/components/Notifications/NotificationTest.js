import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const NotificationTest = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const testNotification = async (type) => {
    if (!user) {
      toast.error('Vous devez être connecté pour tester les notifications');
      return;
    }

    setIsLoading(true);
    try {
      const testData = {
        title: `Test notification - ${type}`,
        message: `Ceci est un test de notification de type ${type} pour ${user.prenom} ${user.nom}`,
        type: type,
        link: '/rh/offres-emploi',
        target_roles: ['Superviseur RH', 'Administrateur', 'Patron'],
        metadata: {
          action_type: 'test',
          related_type: 'test',
          related_id: 1,
          test_user: `${user.prenom} ${user.nom}`,
          timestamp: new Date().toISOString()
        }
      };

      await api.post('/notifications', testData);
      toast.success(`Notification de test ${type} envoyée !`);
    } catch (error) {
      console.error('Erreur lors du test de notification:', error);
      toast.error('Erreur lors de l\'envoi de la notification de test');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  const notificationTypes = [
    { type: 'info', label: 'Information', color: 'bg-blue-500' },
    { type: 'success', label: 'Succès', color: 'bg-green-500' },
    { type: 'warning', label: 'Avertissement', color: 'bg-yellow-500' },
    { type: 'error', label: 'Erreur', color: 'bg-red-500' },
    { type: 'urgent', label: 'Urgent', color: 'bg-red-600' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Test des Notifications
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Cliquez sur les boutons ci-dessous pour tester les différents types de notifications.
        Les notifications apparaîtront dans la cloche en haut à droite.
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {notificationTypes.map(({ type, label, color }) => (
          <button
            key={type}
            onClick={() => testNotification(type)}
            disabled={isLoading}
            className={`${color} text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity`}
          >
            {isLoading ? 'Envoi...' : label}
          </button>
        ))}
      </div>

      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          <strong>Note :</strong> Les notifications de test sont envoyées aux rôles : Superviseur RH, Administrateur, Patron.
          Si vous n'avez pas l'un de ces rôles, vous ne verrez pas la notification.
        </p>
      </div>
    </div>
  );
};

export default NotificationTest;
