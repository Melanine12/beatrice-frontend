import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect() {
    if (this.socket && this.isConnected) {
      return this.socket;
    }

    // Utiliser l'URL de l'API pour Socket.io
    const backendUrl = process.env.REACT_APP_API_URL || 'https://beatrice-backend.onrender.com';
    
    this.socket = io(backendUrl, {
      transports: ['polling', 'websocket'], // Commencer par polling
      timeout: 20000,
      forceNew: true,
      autoConnect: true
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket.io connecté au serveur');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket.io déconnecté du serveur');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Erreur de connexion Socket.io:', error);
      this.isConnected = false;
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  getSocket() {
    if (!this.socket || !this.isConnected) {
      return this.connect();
    }
    return this.socket;
  }

  // Écouter les notifications
  onNotification(callback) {
    const socket = this.getSocket();
    socket.on('notification', callback);
  }

  // Arrêter d'écouter les notifications
  offNotification(callback) {
    if (this.socket) {
      this.socket.off('notification', callback);
    }
  }

  // Émettre un événement
  emit(event, data) {
    const socket = this.getSocket();
    socket.emit(event, data);
  }

  // Écouter un événement
  on(event, callback) {
    const socket = this.getSocket();
    socket.on(event, callback);
  }

  // Arrêter d'écouter un événement
  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
}

// Export d'une instance singleton
const socketService = new SocketService();

// Exposer Socket.io globalement pour les composants qui en ont besoin
window.io = () => socketService.getSocket();

export default socketService;
