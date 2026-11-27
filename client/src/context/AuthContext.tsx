import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client.js';
import { User, UserRole } from '../types/index.js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  switchUser: (role: UserRole, storeId?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data?.success && res.data?.data) {
        setUser(res.data.data);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();

    const handleExpired = () => {
      setUser(null);
    };
    window.addEventListener('auth:expired', handleExpired);
    return () => window.removeEventListener('auth:expired', handleExpired);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data?.data?.user) {
      setUser(res.data.data.user);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      setUser(null);
    }
  };

  const switchUser = async (role: UserRole, storeId?: string) => {
    let email = 'admin@blinkit.com';
    if (role === 'MANAGER') {
      email = storeId === 'DEL-IND-02' ? 'manager.del@blinkit.com' : 'manager.blr@blinkit.com';
    } else if (role === 'ANALYST') {
      email = 'analyst@blinkit.com';
    }
    await login(email, 'Blinkit@123');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, switchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
