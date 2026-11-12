import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { SOCKET_URL } from '../config/api';
import { useAuth } from './AuthContext';
import { getMemoryAccessToken } from '../services/authTokenMemory';
import { playNotificationBeep, unlockNotificationSound } from '../utils/notificationSound';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

function isTestNotification(n) {
  return (n?.title || '').toLowerCase().includes('test notification');
}

function isNotificationForUser(evt, user) {
  const raw = evt?.target_roles;
  if (raw == null) return true;
  let roles = raw;
  if (typeof raw === 'string') {
    try {
      roles = JSON.parse(raw);
    } catch {
      return true;
    }
  }
  if (!Array.isArray(roles) || roles.length === 0) return true;
  if (!user) return false;
  if (roles.includes(user.role)) return true;
  if (roles.includes(`user:${user.id}`)) return true;
  return false;
}

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socketConnected, setSocketConnected] = useState(false);
  const seenIdsRef = useRef(new Set());
  const userRef = useRef(user);
  userRef.current = user;

  const addNotification = useCallback((notification) => {
    if (isTestNotification(notification)) return;
    const id = notification.id || `local-${Date.now()}`;
    if (seenIdsRef.current.has(String(id))) return;
    seenIdsRef.current.add(String(id));

    const newNotification = {
      id,
      ...notification,
      timestamp: notification.created_at || notification.timestamp || new Date().toISOString(),
      read: false
    };
    setNotifications((prev) => {
      if (prev.some((n) => String(n.id) === String(id))) return prev;
      return [newNotification, ...prev];
    });
  }, []);

  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications).filter((n) => !isTestNotification(n));
        setNotifications(parsed);
        setUnreadCount(parsed.filter((n) => !n.read).length);
        parsed.forEach((n) => {
          if (n?.id != null) seenIdsRef.current.add(String(n.id));
        });
      } catch {
        setNotifications([]);
        setUnreadCount(0);
      }
    }
  }, []);

  // Débloquer l’audio au premier clic / touche (politique autoplay navigateur)
  useEffect(() => {
    const unlock = () => unlockNotificationSound();
    window.addEventListener('pointerdown', unlock, { once: true, passive: true });
    window.addEventListener('keydown', unlock, { once: true });
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return undefined;

    const socketUrl =
      process.env.REACT_APP_API_BASE?.replace(/\/api\/?$/, '') || SOCKET_URL;

    const socket = io(socketUrl, {
      withCredentials: true,
      auth: (cb) => {
        const token = getMemoryAccessToken();
        cb(token ? { token } : {});
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity
    });

    socket.on('connect', () => {
      setSocketConnected(true);
      console.info('[notifications] socket connected', socket.id);
    });
    socket.on('disconnect', () => {
      setSocketConnected(false);
    });
    socket.on('connect_error', (err) => {
      setSocketConnected(false);
      console.warn('[notifications] socket connect_error', err?.message || err);
    });

    socket.on('notification', (evt) => {
      if (isTestNotification(evt)) return;
      const currentUser = userRef.current;
      if (!isNotificationForUser(evt, currentUser)) return;

      const idKey = String(evt.id || `${evt.title}-${evt.created_at}`);
      if (seenIdsRef.current.has(idKey)) return;

      addNotification({
        id: evt.id || idKey,
        title: evt.title,
        message: evt.message,
        type: evt.type || 'info',
        link: evt.link || '/dashboard',
        created_at: evt.created_at
      });

      playNotificationBeep(evt.type || 'info');

      const toastMsg = evt.message || evt.title || 'Nouvelle notification';
      const toastId = `notif-${idKey}`;
      if (evt.type === 'error' || evt.type === 'urgent') {
        toast.error(toastMsg, { duration: 6000, id: toastId });
      } else if (evt.type === 'warning') {
        toast(toastMsg, { duration: 5000, id: toastId });
      } else {
        toast.success(toastMsg, { duration: 5000, id: toastId });
      }
    });

    return () => {
      socket.disconnect();
      setSocketConnected(false);
    };
  }, [isAuthenticated, user?.id, addNotification]);

  useEffect(() => {
    const toSave = notifications.filter((n) => !isTestNotification(n));
    localStorage.setItem('notifications', JSON.stringify(toSave));
    setUnreadCount(toSave.filter((n) => !n.read).length);
  }, [notifications]);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })));
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const value = {
    notifications,
    unreadCount,
    socketConnected,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications
  };

  return (
    <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
  );
};
