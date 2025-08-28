import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from '@headlessui/react';
import { 
  XMarkIcon, 
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
  PaperAirplaneIcon,
  PhoneIcon,
  VideoCameraIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import ChatConversation from './ChatConversation';
import UsersList from './UsersList';

const ChatWindow = ({ isOpen, onClose, users = [], conversations = [] }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('conversations'); // 'conversations' or 'users'
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [filteredConversations, setFilteredConversations] = useState(conversations);

  // Filtrer les utilisateurs et conversations selon la recherche
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
      setFilteredConversations(conversations);
    } else {
      const term = searchTerm.toLowerCase();
      
      // Filtrer les utilisateurs
      const filtered = users.filter(u => 
        u.nom?.toLowerCase().includes(term) ||
        u.prenom?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term)
      );
      setFilteredUsers(filtered);
      
      // Filtrer les conversations
      const filteredConv = conversations.filter(conv => 
        conv.user?.nom?.toLowerCase().includes(term) ||
        conv.user?.prenom?.toLowerCase().includes(term) ||
        conv.lastMessage?.toLowerCase().includes(term)
      );
      setFilteredConversations(filteredConv);
    }
  }, [searchTerm, users, conversations]);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setActiveTab('conversations');
  };

  const handleBackToConversations = () => {
    setSelectedUser(null);
  };

  const handleNewConversation = () => {
    setActiveTab('users');
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto w-full max-w-4xl h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleBackToConversations}
                className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  selectedUser ? 'block' : 'hidden'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div>
                <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedUser ? `Chat avec ${selectedUser.prenom} ${selectedUser.nom}` : 'Messages'}
                </Dialog.Title>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedUser ? 'Conversation en cours' : 'Gérez vos conversations'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {selectedUser && (
                <>
                  <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                    <PhoneIcon className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                    <VideoCameraIcon className="w-5 h-5" />
                  </button>
                </>
              )}
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={activeTab === 'conversations' ? 'Rechercher dans les conversations...' : 'Rechercher des utilisateurs...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Tabs */}
          {!selectedUser && (
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('conversations')}
                className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'conversations'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Conversations
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'users'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Utilisateurs
              </button>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {selectedUser ? (
              <ChatConversation 
                user={selectedUser}
                onBack={handleBackToConversations}
              />
            ) : activeTab === 'conversations' ? (
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-y-auto">
                  {filteredConversations.length > 0 ? (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredConversations.map((conversation) => (
                        <div
                          key={conversation.id}
                          onClick={() => handleUserSelect(conversation.user)}
                          className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                                {conversation.user?.prenom?.charAt(0)}{conversation.user?.nom?.charAt(0)}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {conversation.user?.prenom} {conversation.user?.nom}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {conversation.lastMessageTime}
                                </p>
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                {conversation.lastMessage}
                              </p>
                            </div>
                            {conversation.unreadCount > 0 && (
                              <div className="flex-shrink-0">
                                <span className="bg-primary-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                  {conversation.unreadCount}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                        <ChatBubbleLeftRightIcon className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Aucune conversation
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Commencez une nouvelle conversation avec un utilisateur
                      </p>
                      <button
                        onClick={handleNewConversation}
                        className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        Nouvelle conversation
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <UsersList 
                users={filteredUsers}
                onUserSelect={handleUserSelect}
                currentUser={user}
              />
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ChatWindow; 