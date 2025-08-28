import React from 'react';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

const ChatButton = ({ onClick, unreadCount = 0 }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={onClick}
        className="relative bg-primary-600 hover:bg-primary-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        aria-label="Ouvrir le chat"
      >
        <ChatBubbleLeftRightIcon className="w-6 h-6" />
        
        {/* Badge de notifications */}
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default ChatButton; 