import { io } from 'socket.io-client';
import { SOCKET_URL } from '../config/api';
import { getMemoryAccessToken } from './authTokenMemory';
import { ensureSocketAuthToken } from './socketAuth';

let socket = null;
let connectingPromise = null;

/**
 * Cookie HttpOnly (withCredentials) + auth.token mémoire si cookies tiers bloqués.
 * Sur synaptasys.com → API via /api (cookie OK) mais Socket vers Render = Bearer obligatoire.
 */
export const connectSocket = async () => {
  if (socket && socket.connected) {
    return socket;
  }
  if (connectingPromise) return connectingPromise;

  connectingPromise = (async () => {
    await ensureSocketAuthToken();
    console.log('🔌 Connexion Socket.io à:', SOCKET_URL);

    if (socket) {
      socket.auth = { token: getMemoryAccessToken() };
      if (!socket.connected) socket.connect();
      return socket;
    }

    socket = io(SOCKET_URL, {
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
      console.log('✅ Connected to chat server at:', SOCKET_URL);
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from chat server. Reason:', reason);
    });

    socket.on('connect_error', async (error) => {
      console.error('❌ Socket connection error:', error?.message || error);
      if (String(error?.message || '').toLowerCase().includes('auth')) {
        await ensureSocketAuthToken();
        if (socket && !socket.connected) {
          socket.auth = { token: getMemoryAccessToken() };
          socket.connect();
        }
      }
    });

    return socket;
  })();

  try {
    return await connectingPromise;
  } finally {
    connectingPromise = null;
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;

export const getToken = () => getMemoryAccessToken();

const socketService = {
  connect: () => connectSocket(),
  disconnect: () => disconnectSocket(),
  getSocket: () => getSocket()
};

export default socketService;
