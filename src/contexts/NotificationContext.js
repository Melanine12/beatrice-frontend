import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { SOCKET_URL } from '../config/api';
import { useAuth } from './AuthContext';
import { getMemoryAccessToken } from '../services/authTokenMemory';
import { ensureSocketAuthToken } from '../services/socketAuth';
import api from '../services/api';
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
  const uid = user.id != null ? String(user.id) : '';
  if (uid && roles.includes(`user:${uid}`)) return true;
  if (uid && roles.includes(`user:${Number(uid)}`)) return true;
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

  const ingestLiveNotification = useCallback((evt, { silent = false } = {}) => {
    if (isTestNotification(evt)) return false;
    const currentUser = userRef.current;
    if (!isNotificationForUser(evt, currentUser)) return false;

    const idKey = String(evt.id || `${evt.title}-${evt.created_at}`);
    if (seenIdsRef.current.has(idKey)) return false;
    seenIdsRef.current.add(idKey);

    setNotifications((prev) => {
      if (prev.some((n) => String(n.id) === idKey)) return prev;
      return [
        {
          id: evt.id || idKey,
          title: evt.title,
          message: evt.message,
          type: evt.type || 'info',
          link: evt.link || '/dashboard',
          created_at: evt.created_at,
          timestamp: evt.created_at || new Date().toISOString(),
          read: false
        },
        ...prev
      ];
    });

    if (!silent) {
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
    }
    return true;
  }, []);

  const addNotification = useCallback(
    (notification) => {
      ingestLiveNotification(notification, { silent: true });
    },
    [ingestLiveNotification]
  );

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

  // Débloquer l’audio au premier geste utilisateur
  useEffect(() => {
    const unlock = () => unlockNotificationSound();
    window.addEventListener('pointerdown', unlock, { once: true, passive: true });
    window.addEventListener('keydown', unlock, { once: true });
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  // Socket.IO temps réel — token Bearer obligatoire (cross-origin Render)
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return undefined;

    let cancelled = false;
    let socket = null;
    let pollTimer = null;

    const syncFromApi = async ({ announceNew = false } = {}) => {
      try {
        const response = await api.get('/notifications?limit=20');
        if (!response.data?.success) return;
        const data = (response.data.data || []).filter((n) => !isTestNotification(n));
        data.forEach((n) => {
          const already = seenIdsRef.current.has(String(n.id));
          if (!already && announceNew) {
            ingestLiveNotification(
              {
                id: n.id,
                title: n.title,
                message: n.message,
                type: n.type,
                link: n.link,
                created_at: n.created_at,
                target_roles: n.target_roles
              },
              { silent: false }
            );
          } else if (!already) {
            seenIdsRef.current.add(String(n.id));
            setNotifications((prev) => {
              if (prev.some((x) => String(x.id) === String(n.id))) return prev;
              return [
                {
                  id: n.id,
                  title: n.title,
                  message: n.message,
                  type: n.type || 'info',
                  link: n.link || '/dashboard',
                  created_at: n.created_at,
                  timestamp: n.created_at,
                  read: false
                },
                ...prev
              ];
            });
          }
        });
      } catch (err) {
        console.warn('[notifications] poll failed', err?.message || err);
      }
    };

    const start = async () => {
      await ensureSocketAuthToken();
      if (cancelled) return;

      const socketUrl =
        process.env.REACT_APP_SOCKET_URL ||
        process.env.REACT_APP_API_BASE?.replace(/\/api\/?$/, '') ||
        SOCKET_URL;

      socket = io(socketUrl, {
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
        if (cancelled) return;
        setSocketConnected(true);
        console.info('[notifications] socket connected', socket.id, '→', socketUrl);
      });

      socket.on('disconnect', () => {
        if (cancelled) return;
        setSocketConnected(false);
      });

      socket.on('connect_error', async (err) => {
        if (cancelled) return;
        setSocketConnected(false);
        console.warn('[notifications] socket connect_error', err?.message || err);
        // Relancer un refresh token puis forcer un nouvel essai
        if (String(err?.message || '').toLowerCase().includes('auth')) {
          await ensureSocketAuthToken();
          if (!cancelled && socket && !socket.connected) {
            socket.auth = { token: getMemoryAccessToken() };
            socket.connect();
          }
        }
      });

      socket.on('notification', (evt) => {
        ingestLiveNotification(evt, { silent: false });
      });

      // Filet de sécurité : poll API (le seenIds évite les doubles bip si le socket a déjà livré)
      pollTimer = setInterval(() => {
        if (cancelled) return;
        syncFromApi({ announceNew: true });
      }, 10000);

      // Première synchro silencieuse (évite double bip au chargement)
      await syncFromApi({ announceNew: false });
    };

    start();

    return () => {
      cancelled = true;
      if (pollTimer) clearInterval(pollTimer);
      if (socket) socket.disconnect();
      setSocketConnected(false);
    };
  }, [isAuthenticated, user?.id, ingestLiveNotification]);

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
