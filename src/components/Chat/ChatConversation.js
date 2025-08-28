import React, { useState, useEffect, useRef } from 'react';
import { 
  PaperAirplaneIcon,
  PaperClipIcon,
  FaceSmileIcon,
  MicrophoneIcon
} from '@heroicons/react/24/outline';

const ChatConversation = ({ user, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Messages de démonstration
  useEffect(() => {
    const demoMessages = [
      {
        id: 1,
        text: "Bonjour ! Comment ça va ?",
        sender: user.id,
        timestamp: new Date(Date.now() - 3600000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        type: 'text'
      },
      {
        id: 2,
        text: "Salut ! Ça va bien, merci. Et toi ?",
        sender: 'me',
        timestamp: new Date(Date.now() - 3500000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        type: 'text'
      },
      {
        id: 3,
        text: "Très bien ! As-tu terminé le rapport sur l'inventaire ?",
        sender: user.id,
        timestamp: new Date(Date.now() - 3000000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        type: 'text'
      },
      {
        id: 4,
        text: "Oui, je l'ai terminé hier soir. Je peux te l'envoyer si tu veux.",
        sender: 'me',
        timestamp: new Date(Date.now() - 2500000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        type: 'text'
      },
      {
        id: 5,
        text: "Parfait ! Envoie-le moi quand tu peux.",
        sender: user.id,
        timestamp: new Date(Date.now() - 2000000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        type: 'text'
      }
    ];
    setMessages(demoMessages);
  }, [user.id]);

  // Auto-scroll vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      text: newMessage,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // Simuler une réponse après 2 secondes
    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        text: "Message reçu ! Je te réponds bientôt.",
        sender: user.id,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        type: 'text'
      };
      setMessages(prev => [...prev, reply]);
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInHours = (now - messageTime) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return messageTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else {
      return messageTime.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.sender === 'me'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
            }`}>
              <p className="text-sm">{message.text}</p>
              <p className={`text-xs mt-1 ${
                message.sender === 'me'
                  ? 'text-primary-100'
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}
        
        {/* Indicateur de frappe */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Zone de saisie */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
          {/* Boutons d'action */}
          <div className="flex space-x-1">
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Joindre un fichier"
            >
              <PaperClipIcon className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Émojis"
            >
              <FaceSmileIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Zone de texte */}
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tapez votre message..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              rows="1"
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
          </div>

          {/* Boutons d'envoi */}
          <div className="flex space-x-1">
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Message vocal"
            >
              <MicrophoneIcon className="w-5 h-5" />
            </button>
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="p-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Envoyer le message"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatConversation; 