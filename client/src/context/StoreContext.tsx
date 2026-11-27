import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client.js';
import { DarkStore } from '../types/index.js';
import { useAuth } from './AuthContext.js';

export type DateRangePreset = 'TODAY' | '7D' | '30D' | 'CUSTOM';

interface StoreContextType {
  stores: DarkStore[];
  selectedStoreId: string; // 'ALL' or specific storeId
  setSelectedStoreId: (storeId: string) => void;
  datePreset: DateRangePreset;
  setDatePreset: (preset: DateRangePreset) => void;
  startDate?: string;
  endDate?: string;
  setDateRange: (start?: string, end?: string) => void;
  loadingStores: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [stores, setStores] = useState<DarkStore[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string>('ALL');
  const [datePreset, setDatePreset] = useState<DateRangePreset>('30D');
  const [startDate, setStartDate] = useState<string | undefined>();
  const [endDate, setEndDate] = useState<string | undefined>();
  const [loadingStores, setLoadingStores] = useState<boolean>(true);

  // Auto scope for Store Managers
  useEffect(() => {
    if (user?.role === 'MANAGER' && user.storeId) {
      setSelectedStoreId(user.storeId);
    } else if (user?.role === 'ADMIN' && selectedStoreId === '') {
      setSelectedStoreId('ALL');
    }
  }, [user]);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoadingStores(true);
        const res = await api.get('/stores');
        if (res.data?.success) {
          setStores(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load dark stores', err);
      } finally {
        setLoadingStores(false);
      }
    };

    if (user) {
      fetchStores();
    }
  }, [user]);

  // Handle date preset change
  useEffect(() => {
    const now = new Date();
    if (datePreset === 'TODAY') {
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      setStartDate(todayStart.toISOString());
      setEndDate(now.toISOString());
    } else if (datePreset === '7D') {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      setStartDate(sevenDaysAgo.toISOString());
      setEndDate(now.toISOString());
    } else if (datePreset === '30D') {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      setStartDate(thirtyDaysAgo.toISOString());
      setEndDate(now.toISOString());
    }
  }, [datePreset]);

  const setDateRange = (start?: string, end?: string) => {
    setDatePreset('CUSTOM');
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <StoreContext.Provider
      value={{
        stores,
        selectedStoreId,
        setSelectedStoreId,
        datePreset,
        setDatePreset,
        startDate,
        endDate,
        setDateRange,
        loadingStores,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within a StoreProvider');
  return ctx;
};
