import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
  }

  connect(token) {
    if (this.socket && this.isConnected) {
      return this.socket;
    }

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    
    this.socket = io(socketUrl, {
      auth: {
        token
      },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('🔌 Connected to server');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('🔌 Disconnected from server');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
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

  joinStore(storeId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join-store', storeId);
    }
  }

  leaveStore(storeId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave-store', storeId);
    }
  }

  onNewAlert(callback) {
    if (this.socket) {
      this.socket.on('new-alert', callback);
    }
  }

  onAlertResolved(callback) {
    if (this.socket) {
      this.socket.on('alert-resolved', callback);
    }
  }

  onCameraStatusChange(callback) {
    if (this.socket) {
      this.socket.on('camera-status-change', callback);
    }
  }

  onSystemNotification(callback) {
    if (this.socket) {
      this.socket.on('system-notification', callback);
    }
  }

  removeListener(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      socketId: this.socket?.id
    };
  }
}

// Create and export a singleton instance
const socketService = new SocketService();
export default socketService;
