import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [simulationInterval, setSimulationInterval] = useState(null);

  // Charger les notifications depuis le localStorage au démarrage
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      const parsed = JSON.parse(savedNotifications);
      setNotifications(parsed);
      setUnreadCount(parsed.filter(n => !n.read).length);
    }
    // Socket.io subscription
    const socket = io(process.env.REACT_APP_API_BASE?.replace('/api','') || 'http://localhost:5002');
    socket.on('connect', () => {
      // console.log('Socket connected');
    });
    socket.on('notification', (evt) => {
      addNotification({
        title: evt.title,
        message: evt.message,
        type: evt.type || 'info',
        link: evt.link || '/dashboard'
      });
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  // Sauvegarder les notifications dans le localStorage
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  // Ajouter une nouvelle notification
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      ...notification,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  // Marquer une notification comme lue
  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  // Marquer toutes les notifications comme lues
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  // Supprimer une notification
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Supprimer toutes les notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Simuler des notifications automatiques basées sur des événements
  const simulateRealTimeNotifications = () => {
    const eventTypes = [
      {
        type: 'room_checkin',
        title: '🏠 Nouvelle arrivée',
        messages: [
                  'Arrivée de M. Dupont dans la chambre 205',
        'Arrivée de Mme Martin dans la chambre 312',
        'Arrivée de la famille Leblanc dans la suite 401'
        ],
        notificationType: 'info',
        link: '/spaces'
      },
      {
        type: 'room_checkout',
        title: '👋 Départ client',
        messages: [
                  'Départ de M. Durand de la chambre 103',
        'Départ de Mme Petit de la chambre 208',
        'Départ de M. et Mme Moreau de la suite 405'
        ],
        notificationType: 'success',
        link: '/spaces'
      },
      {
        type: 'maintenance_alert',
        title: '🔧 Alerte maintenance',
        messages: [
          'Maintenance préventive programmée pour l\'ascenseur',
          'Vérification du système de sécurité prévue',
          'Contrôle de la climatisation dans les chambres 1-10'
        ],
        notificationType: 'warning',
        link: '/issues'
      },
      {
        type: 'cleaning_complete',
        title: '🧹 Nettoyage terminé',
        messages: [
          'Nettoyage de la chambre 205 terminé',
          'Nettoyage de la chambre 312 terminé',
          'Nettoyage de la suite 401 terminé'
        ],
        notificationType: 'success',
        link: '/tasks'
      },
      {
        type: 'supplier_delivery',
        title: '📦 Livraison fournisseur',
        messages: [
          'Livraison de produits d\'entretien arrivée',
          'Livraison de linge de lit reçue',
          'Livraison de produits de toilette arrivée'
        ],
        notificationType: 'info',
        link: '/inventory'
      },
      {
        type: 'payment_received',
        title: '💳 Paiement reçu',
        messages: [
          'Paiement reçu pour la chambre 205 (150€)',
          'Paiement reçu pour la suite 401 (320€)',
          'Paiement reçu pour la chambre 312 (95€)'
        ],
        notificationType: 'success',
        link: '/expenses'
      },
      {
        type: 'system_alert',
        title: '⚠️ Alerte système',
        messages: [
          'Tentative de connexion non autorisée détectée',
          'Sauvegarde automatique effectuée avec succès',
          'Mise à jour du système disponible'
        ],
        notificationType: 'warning',
        link: '/dashboard'
      }
    ];

    const randomEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const randomMessage = randomEvent.messages[Math.floor(Math.random() * randomEvent.messages.length)];

    addNotification({
      title: randomEvent.title,
      message: randomMessage,
      type: randomEvent.notificationType,
      link: randomEvent.link
    });
  };

  // Simuler des notifications automatiques
  const simulateNotifications = () => {
    const sampleNotifications = [
      {
        title: 'Nouvelle problématique',
        message: 'Une nouvelle problématique a été signalée dans la chambre 101',
        type: 'warning',
        link: '/issues'
      },
      {
        title: 'Tâche terminée',
        message: 'La tâche "Nettoyage chambre 205" a été marquée comme terminée',
        type: 'success',
        link: '/tasks'
      },
      {
        title: 'Dépense en attente',
        message: 'Une nouvelle dépense de 150€ nécessite votre approbation',
        type: 'info',
        link: '/expenses'
      },
      {
        title: 'Stock faible',
        message: 'Le stock de savon est faible (5 unités restantes)',
        type: 'warning',
        link: '/inventory'
      }
    ];

    // Ajouter une notification aléatoire toutes les 30 secondes
    const interval = setInterval(() => {
      const randomNotification = sampleNotifications[Math.floor(Math.random() * sampleNotifications.length)];
      addNotification(randomNotification);
    }, 30000);

    setSimulationInterval(interval);
    return () => clearInterval(interval);
  };

  // Démarrer la simulation en temps réel
  const startRealTimeSimulation = () => {
    if (simulationInterval) {
      clearInterval(simulationInterval);
    }

    // Simuler des événements toutes les 45 secondes
    const interval = setInterval(() => {
      simulateRealTimeNotifications();
    }, 45000);

    setSimulationInterval(interval);
    return () => clearInterval(interval);
  };

  // Arrêter la simulation
  const stopSimulation = () => {
    if (simulationInterval) {
      clearInterval(simulationInterval);
      setSimulationInterval(null);
    }
  };

  // Simuler une notification urgente
  const simulateUrgentNotification = () => {
    addNotification({
      title: '🚨 URGENT : Intervention requise',
      message: 'Problème critique détecté dans le système de sécurité. Intervention immédiate nécessaire.',
      type: 'urgent',
      link: '/issues'
    });
    // Note: toast.success sera appelé dans le composant
  };

  // Simuler une notification d'erreur système
  const simulateSystemError = () => {
    addNotification({
      title: '❌ Erreur système critique',
      message: 'Perte de connexion avec la base de données. Tentative de reconnexion automatique...',
      type: 'error',
      link: '/dashboard'
    });
  };

  // Simuler une notification de problématique
  const simulateProblematicNotification = () => {
    const rooms = ['101', '205', '312', '408', '502'];
    const problems = [
      'Fuite d\'eau dans la salle de bain',
      'Problème électrique',
      'Climatisation défaillante',
      'Fenêtre bloquée',
      'Problème de serrure'
    ];
    const randomRoom = rooms[Math.floor(Math.random() * rooms.length)];
    const randomProblem = problems[Math.floor(Math.random() * problems.length)];
    
    addNotification({
      title: '⚠️ Nouvelle problématique',
      message: `${randomProblem} signalée dans la chambre ${randomRoom}`,
      type: 'warning',
      link: '/issues'
    });
  };

  // Simuler une notification de tâche
  const simulateTaskNotification = () => {
    const tasks = [
      'Nettoyage chambre 205',
      'Réparation climatisation',
      'Maintenance ascenseur',
      'Vérification sécurité',
      'Contrôle qualité'
    ];
    const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
    
    addNotification({
      title: '✅ Tâche terminée',
      message: `La tâche "${randomTask}" a été marquée comme terminée`,
      type: 'success',
      link: '/tasks'
    });
  };

  // Simuler une notification de dépense
  const simulateExpenseNotification = () => {
    const amounts = [150, 75, 320, 95, 180, 250];
    const randomAmount = amounts[Math.floor(Math.random() * amounts.length)];
    
    addNotification({
      title: '💰 Dépense en attente',
      message: `Une nouvelle dépense de ${randomAmount}€ nécessite votre approbation`,
      type: 'info',
      link: '/expenses'
    });
  };

  // Simuler une notification d'inventaire
  const simulateInventoryNotification = () => {
    const items = ['Savon', 'Serviettes', 'Shampoing', 'Papier toilette', 'Café'];
    const randomItem = items[Math.floor(Math.random() * items.length)];
    const quantities = [2, 5, 3, 8, 1];
    const randomQuantity = quantities[Math.floor(Math.random() * quantities.length)];
    
    addNotification({
      title: '📦 Stock faible',
      message: `Le stock de ${randomItem} est faible (${randomQuantity} unités restantes)`,
      type: 'warning',
      link: '/inventory'
    });
  };

  // Simuler une notification d'erreur
  const simulateErrorNotification = () => {
    addNotification({
      title: '❌ Erreur système',
      message: 'Erreur de connexion à la base de données. Tentative de reconnexion...',
      type: 'error',
      link: '/dashboard'
    });
  };

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    simulateNotifications,
    startRealTimeSimulation,
    stopSimulation,
    simulateUrgentNotification,
    simulateSystemError,
    simulateProblematicNotification,
    simulateTaskNotification,
    simulateExpenseNotification,
    simulateInventoryNotification,
    simulateErrorNotification,
    isSimulationActive: !!simulationInterval
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}; 