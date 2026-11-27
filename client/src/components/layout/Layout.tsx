import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar.js';
import { Sidebar } from './Sidebar.js';
import { useSocket } from '../../context/SocketContext.js';
import { AlertCircle, X } from 'lucide-react';

export const Layout: React.FC = () => {
  const { latestNotification, clearNotification } = useSocket();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full overflow-x-hidden">
          {/* Floating Live Realtime Alert Toast Notification */}
          {latestNotification && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-xl shadow-lg flex items-start justify-between animate-bounce">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-red-900 uppercase tracking-wider">
                      Real-Time Operational Alert ({latestNotification.severity})
                    </span>
                    <span className="text-[10px] font-bold bg-red-200 text-red-800 px-2 py-0.5 rounded">
                      {latestNotification.storeId}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-red-800 mt-0.5">
                    {latestNotification.message}
                  </p>
                </div>
              </div>
              <button
                onClick={clearNotification}
                className="text-red-400 hover:text-red-700 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <Outlet />
        </main>
      </div>
    </div>
  );
};
