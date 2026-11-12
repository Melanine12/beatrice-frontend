import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { BellIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import api from '../../services/api';
import {
  translateNotificationTitle,
  translateNotificationMessage,
  getNotificationsDateLocale
} from '../../utils/notificationsI18n';
import { unlockNotificationSound } from '../../utils/notificationSound';

/** N’autorise que les chemins relatifs internes (évite open redirect). */
function safeInternalLink(link) {
  if (!link || typeof link !== 'string') return null;
  const trimmed = link.trim();
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return trimmed;
  try {
    const u = new URL(trimmed, window.location.origin);
    if (u.origin === window.location.origin) {
      return `${u.pathname}${u.search}${u.hash}`;
    }
  } catch {
    /* ignore */
  }
  return null;
}

const NotificationBell = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const tp = (key, options) => t(`notificationsPage.${key}`, options);
  const dateLocale = getNotificationsDateLocale(i18n.language);
  const { user } = useAuth();
  const { unreadCount: liveUnread, notifications: liveNotifications } = useNotifications();
  const [notifications, setNotifications] = useState([]);
  const [apiUnread, setApiUnread] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const unreadCount = Math.max(apiUnread, liveUnread);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await api.get('/notifications?limit=20');
      if (response.data.success) {
        const data = (response.data.data || []).filter(
          (n) => !(n.title || '').toLowerCase().includes('test notification')
        );
        setNotifications(data);
        setApiUnread(data.length);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Quand une notif live arrive (toast + bip via NotificationContext), rafraîchir la liste API
  useEffect(() => {
    if (!liveNotifications?.length) return;
    fetchNotifications();
  }, [liveNotifications, fetchNotifications]);

  const markAsRead = async (notificationId) => {
    try {
      setNotifications((prev) => prev.filter((notif) => notif.id !== notificationId));
      setApiUnread((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Erreur lors du marquage de la notification:', error);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      warning:
        'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z',
      error:
        'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
      urgent:
        'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
    };
    return icons[type] || icons.info;
  };

  const getNotificationColor = (type) => {
    const colors = {
      info: 'text-blue-500',
      success: 'text-green-500',
      warning: 'text-yellow-500',
      error: 'text-red-500',
      urgent: 'text-red-600'
    };
    return colors[type] || colors.info;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return tp('time.justNow');
    if (diffInMinutes < 60) return tp('time.minutesAgo', { count: diffInMinutes });
    if (diffInMinutes < 1440) return tp('time.hoursAgo', { count: Math.floor(diffInMinutes / 60) });
    return date.toLocaleDateString(dateLocale);
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          unlockNotificationSound();
          setIsOpen(!isOpen);
        }}
        className="relative -m-2.5 p-2.5 rounded-xl text-gray-400 hover:bg-primary-50 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-primary-400 transition-all duration-300 transform hover:scale-110"
        aria-label={tp('title')}
      >
        <BellIcon className="h-6 w-6 transition-transform duration-300 hover:animate-bounce-subtle" aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center shadow-lg animate-pulse-slow">
            <span className="text-xs font-bold text-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{tp('title')}</h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto" />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{tp('loading')}</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center">
                <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{tp('empty.title')}</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => {
                      markAsRead(notification.id);
                      const safe = safeInternalLink(notification.link);
                      setIsOpen(false);
                      if (safe) navigate(safe);
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 ${getNotificationColor(notification.type)}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={getNotificationIcon(notification.type)}
                          />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {translateNotificationTitle(notification.title, t)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {translateNotificationMessage(notification.message, t)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {formatDate(notification.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setNotifications([]);
                  setApiUnread(0);
                }}
                className="flex-1 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              >
                {tp('markAllRead')}
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate('/notifications');
              }}
              className="flex-1 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              {t('header.viewNotifications', { defaultValue: 'Voir tout' })}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
