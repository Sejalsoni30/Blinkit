import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { api } from '../api/client.js';
import { Alert } from '../types/index.js';
import { useAuth } from './AuthContext.js';
import { useStore } from './StoreContext.js';

interface SocketContextType {
  socket: Socket | null;
  activeAlerts: Alert[];
  unreadAlertCount: number;
  latestNotification: Alert | null;
  clearNotification: () => void;
  refreshAlerts: () => Promise<void>;
  resolveAlert: (alertId: string) => Promise<void>;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { selectedStoreId } = useStore();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [activeAlerts, setActiveAlerts] = useState<Alert[]>([]);
  const [latestNotification, setLatestNotification] = useState<Alert | null>(null);

  const fetchAlerts = async () => {
    try {
      const url =
        selectedStoreId && selectedStoreId !== 'ALL'
          ? `/alerts?storeId=${selectedStoreId}`
          : `/alerts`;
      const res = await api.get(url);
      if (res.data?.success && Array.isArray(res.data.data)) {
        setActiveAlerts(res.data.data);
      }
    } catch (err) {
      console.warn('Failed to fetch active alerts', err);
    }
  };

  useEffect(() => {
    if (!user) return;

    fetchAlerts();

    const isLocalhost =
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname === '0.0.0.0');

    // Only connect WebSocket if an explicit socket URL is provided or running locally
    const socketUrl = import.meta.env.VITE_SOCKET_URL || (isLocalhost ? 'http://localhost:5050' : null);

    if (!socketUrl) {
      // In cloud preview mode without WebSocket server, simulate alert pulse safely
      return;
    }

    const socketInstance = io(socketUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 3,
    });

    socketInstance.on('connect', () => {
      console.log('⚡ Socket connected:', socketInstance.id);
      if (selectedStoreId && selectedStoreId !== 'ALL') {
        socketInstance.emit('join_store', selectedStoreId);
      }
    });

    socketInstance.on('new_alert', (newAlert: Alert) => {
      setLatestNotification(newAlert);
      setActiveAlerts((prev) => [newAlert, ...prev]);
    });

    socketInstance.on('store_alert', (newAlert: Alert) => {
      setLatestNotification(newAlert);
      setActiveAlerts((prev) => [newAlert, ...prev]);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [user, selectedStoreId]);

  const clearNotification = () => setLatestNotification(null);

  const resolveAlert = async (alertId: string) => {
    try {
      const res = await api.patch(`/alerts/${alertId}/resolve`);
      if (res.data?.success || res.status === 200) {
        setActiveAlerts((prev) => prev.filter((a) => a.alertId !== alertId));
      }
    } catch (err) {
      console.warn('Failed to resolve alert', err);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        activeAlerts,
        unreadAlertCount: activeAlerts.length,
        latestNotification,
        clearNotification,
        refreshAlerts: fetchAlerts,
        resolveAlert,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocket must be used within a SocketProvider');
  return ctx;
};
