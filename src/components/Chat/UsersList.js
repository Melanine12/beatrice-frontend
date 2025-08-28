import React from 'react';
import { UserCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const UsersList = ({ users = [], onUserSelect, currentUser }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'busy':
        return 'bg-red-500';
      case 'offline':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'online':
        return 'En ligne';
      case 'away':
        return 'Absent';
      case 'busy':
        return 'Occupé';
      case 'offline':
        return 'Hors ligne';
      default:
        return 'Hors ligne';
    }
  };

  const filteredUsers = users.filter(user => user.id !== currentUser?.id);

  if (filteredUsers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <UserCircleIcon className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Aucun utilisateur disponible
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Il n'y a actuellement aucun autre utilisateur connecté
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          Utilisateurs disponibles ({filteredUsers.length})
        </h3>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            onClick={() => onUserSelect(user)}
            className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 relative">
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.prenom?.charAt(0)}{user.nom?.charAt(0)}
                </div>
                {/* Status indicator */}
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${getStatusColor(user.status || 'offline')}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user.prenom} {user.nom}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    user.status === 'online' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : user.status === 'away'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                      : user.status === 'busy'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {getStatusText(user.status || 'offline')}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {user.role || 'Utilisateur'}
                  </p>
                  {user.department && (
                    <>
                      <span className="text-gray-300 dark:text-gray-600">•</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {user.department}
                      </p>
                    </>
                  )}
                </div>
                
                {user.lastSeen && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Dernière connexion: {user.lastSeen}
                  </p>
                )}
              </div>
              
              <div className="flex-shrink-0">
                <button className="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersList; 