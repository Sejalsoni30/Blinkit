import React, { useState } from 'react';
import { useSocket } from '../context/SocketContext.js';
import { useStore } from '../context/StoreContext.js';
import { Alert } from '../types/index.js';
import { Bell, CheckCircle2, AlertTriangle, ShieldAlert, Filter } from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const { activeAlerts, resolveAlert, refreshAlerts } = useSocket();
  const { stores } = useStore();
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const filteredAlerts = activeAlerts.filter((a) => {
    if (severityFilter !== 'ALL' && a.severity !== severityFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              Live Operations Alerts Center
            </h1>
            <span className="bg-red-100 text-red-800 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-red-300 animate-pulse">
              {activeAlerts.length} Active Alerts
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Real-time Socket.IO feed of warehouse SLA risks, surge notices, and stockout warnings.
          </p>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl p-1 text-xs shadow-2xs">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                severityFilter === sev
                  ? 'bg-yellow-400 text-gray-950 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Feed */}
      {filteredAlerts.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-3xl p-12 text-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
          <h3 className="text-base font-bold text-gray-900">All Operations Clear</h3>
          <p className="text-xs text-gray-500 mt-1">
            No active alerts matching the selected filter criteria.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAlerts.map((alert) => {
            const storeName =
              stores.find((s) => s.storeId === alert.storeId)?.name || alert.storeId;

            return (
              <div
                key={alert.alertId}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`p-2.5 rounded-xl shrink-0 ${
                      alert.severity === 'CRITICAL'
                        ? 'bg-red-100 text-red-600'
                        : alert.severity === 'HIGH'
                        ? 'bg-orange-100 text-orange-600'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    <AlertTriangle className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                        {alert.type.replace('_', ' ')}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                          alert.severity === 'CRITICAL'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-orange-50 text-orange-700 border-orange-200'
                        }`}
                      >
                        {alert.severity}
                      </span>
                      <span className="text-xs font-bold text-gray-700">{storeName}</span>
                    </div>

                    <p className="text-sm font-bold text-gray-900">{alert.message}</p>
                    <div className="text-[11px] text-gray-400 mt-1">
                      Reported: {new Date(alert.createdAt).toLocaleTimeString('en-IN')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => resolveAlert(alert.alertId)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Acknowledge & Resolve</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
