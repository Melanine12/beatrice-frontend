import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ChatButton from './ChatButton';
import ChatWindow from './ChatWindow';
import './Chat.css';

const LiveChat = () => {
  const { user } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Données de démonstration
  useEffect(() => {
    // Simuler des utilisateurs connectés
    const demoUsers = [
      {
        id: 1,
        prenom: 'Jean',
        nom: 'Dupont',
        email: 'jean.dupont@example.com',
        role: 'Administrateur',
        department: 'Direction',
        status: 'online',
        lastSeen: 'À l\'instant'
      },
      {
        id: 2,
        prenom: 'Marie',
        nom: 'Martin',
        email: 'marie.martin@example.com',
        role: 'Superviseur',
        department: 'Ressources Humaines',
        status: 'away',
        lastSeen: 'Il y a 5 minutes'
      },
      {
        id: 3,
        prenom: 'Pierre',
        nom: 'Bernard',
        email: 'pierre.bernard@example.com',
        role: 'Employé',
        department: 'Maintenance',
        status: 'busy',
        lastSeen: 'Il y a 10 minutes'
      },
      {
        id: 4,
        prenom: 'Sophie',
        nom: 'Petit',
        email: 'sophie.petit@example.com',
        role: 'Employé',
        department: 'Réception',
        status: 'online',
        lastSeen: 'À l\'instant'
      },
      {
        id: 5,
        prenom: 'Lucas',
        nom: 'Moreau',
        email: 'lucas.moreau@example.com',
        role: 'Employé',
        department: 'Cuisine',
        status: 'offline',
        lastSeen: 'Il y a 1 heure'
      }
    ];

    // Simuler des conversations
    const demoConversations = [
      {
        id: 1,
        user: demoUsers[0],
        lastMessage: "As-tu terminé le rapport sur l'inventaire ?",
        lastMessageTime: "14:30",
        unreadCount: 2
      },
      {
        id: 2,
        user: demoUsers[1],
        lastMessage: "Merci pour l'information !",
        lastMessageTime: "13:45",
        unreadCount: 0
      },
      {
        id: 3,
        user: demoUsers[2],
        lastMessage: "Je serai en retard aujourd'hui",
        lastMessageTime: "12:20",
        unreadCount: 1
      }
    ];

    setUsers(demoUsers);
    setConversations(demoConversations);
    
    // Calculer le nombre total de messages non lus
    const totalUnread = demoConversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
    setUnreadCount(totalUnread);
  }, []);

  const handleChatToggle = () => {
    setIsChatOpen(!isChatOpen);
    // Réinitialiser le compteur de messages non lus quand on ouvre le chat
    if (!isChatOpen) {
      setUnreadCount(0);
    }
  };

  const handleChatClose = () => {
    setIsChatOpen(false);
  };

  // Simuler la réception de nouveaux messages
  useEffect(() => {
    if (!isChatOpen) {
      const interval = setInterval(() => {
        // Simuler l'arrivée d'un nouveau message (20% de chance toutes les 30 secondes)
        if (Math.random() < 0.2) {
          setUnreadCount(prev => prev + 1);
        }
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [isChatOpen]);

  return (
    <>
      <ChatButton 
        onClick={handleChatToggle}
        unreadCount={unreadCount}
      />
      
      <ChatWindow
        isOpen={isChatOpen}
        onClose={handleChatClose}
        users={users}
        conversations={conversations}
      />
    </>
  );
};

export default LiveChat; 