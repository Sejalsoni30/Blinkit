import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
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
          ? `/api/v1/alerts?storeId=${selectedStoreId}`
          : '/api/v1/alerts';
      const res = await fetch(url, { credentials: 'include' });
      const json = await res.json();
      if (json.success) {
        setActiveAlerts(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch active alerts', err);
    }
  };

  useEffect(() => {
    if (!user) return;

    fetchAlerts();

    const socketInstance = io(window.location.origin, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
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
      const res = await fetch(`/api/v1/alerts/${alertId}/resolve`, {
        method: 'PATCH',
        credentials: 'include',
      });
      if (res.ok) {
        setActiveAlerts((prev) => prev.filter((a) => a.alertId !== alertId));
      }
    } catch (err) {
      console.error('Failed to resolve alert', err);
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
