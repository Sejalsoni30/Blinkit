import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { StoreProvider } from './context/StoreContext.js';
import { SocketProvider } from './context/SocketContext.js';

import { Layout } from './components/layout/Layout.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { OrdersPage } from './pages/OrdersPage.js';
import { RootCausePage } from './pages/RootCausePage.js';
import { SkuAislePage } from './pages/SkuAislePage.js';
import { PickerPage } from './pages/PickerPage.js';
import { StaffingPage } from './pages/StaffingPage.js';
import { InventoryPage } from './pages/InventoryPage.js';
import { PredictorPage } from './pages/PredictorPage.js';
import { InsightsPage } from './pages/InsightsPage.js';
import { AlertsPage } from './pages/AlertsPage.js';
import { StoreComparisonPage } from './pages/StoreComparisonPage.js';
import { LoginPage } from './pages/LoginPage.js';
import { LoadingSkeleton } from './components/common/LoadingSkeleton.js';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
        <LoadingSkeleton />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StoreProvider>
          <SocketProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<LoginPage />} />

                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<DashboardPage />} />
                  <Route path="funnel" element={<DashboardPage />} />
                  <Route path="orders" element={<OrdersPage />} />
                  <Route path="root-causes" element={<RootCausePage />} />
                  <Route path="sku-aisle" element={<SkuAislePage />} />
                  <Route path="pickers" element={<PickerPage />} />
                  <Route path="staffing" element={<StaffingPage />} />
                  <Route path="inventory" element={<InventoryPage />} />
                  <Route path="predict" element={<PredictorPage />} />
                  <Route path="insights" element={<InsightsPage />} />
                  <Route path="alerts" element={<AlertsPage />} />
                  <Route path="comparison" element={<StoreComparisonPage />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </SocketProvider>
        </StoreProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
