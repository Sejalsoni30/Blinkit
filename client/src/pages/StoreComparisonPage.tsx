import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client.js';
import { useStore } from '../context/StoreContext.js';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton.js';
import { ExportButton } from '../components/common/ExportButton.js';
import { Trophy, CheckCircle2, Clock, Users, ArrowUpRight } from 'lucide-react';

export const StoreComparisonPage: React.FC = () => {
  const { startDate, endDate } = useStore();

  const queryParams = new URLSearchParams();
  if (startDate) queryParams.append('startDate', startDate);
  if (endDate) queryParams.append('endDate', endDate);

  const { data, isLoading } = useQuery({
    queryKey: ['store-comparison', startDate, endDate],
    queryFn: async () => {
      const res = await api.get(`/analytics/store-comparison?${queryParams.toString()}`);
      return res.data.data;
    },
  });

  if (isLoading) return <LoadingSkeleton />;

  const stores = data || [];

  const exportColumns = [
    { header: 'Store Name', key: 'storeName' },
    { header: 'City', key: 'city' },
    { header: 'SLA Compliance (%)', key: 'slaCompliance' },
    { header: 'Total Orders', key: 'totalOrders' },
    { header: 'Breaches', key: 'breachedOrders' },
    { header: 'Avg Delivery Sec', key: 'avgDeliverySeconds' },
    { header: 'Avg Pick Sec', key: 'avgPickSeconds' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              Dark Store Performance Leaderboard
            </h1>
            <span className="bg-yellow-100 text-yellow-900 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-yellow-300">
              National Fleet Comparison
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Comparative benchmarking of 10-minute SLA fulfillment across all 5 dark stores (Admin View).
          </p>
        </div>

        <ExportButton
          data={stores}
          filename="blinkit_store_leaderboard"
          title="National Store Leaderboard"
          columns={exportColumns}
        />
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white border border-gray-200 rounded-3xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-base font-extrabold text-gray-900 tracking-tight">
            City Ops Fulfillment Scorecard
          </h3>
          <p className="text-xs text-gray-500">
            Ranked by % of orders delivered under 10 minutes (600 seconds)
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Rank</th>
                <th className="px-5 py-3.5">Dark Store Hub</th>
                <th className="px-5 py-3.5">City</th>
                <th className="px-5 py-3.5">10m SLA Compliance</th>
                <th className="px-5 py-3.5">Total Orders</th>
                <th className="px-5 py-3.5">Breaches</th>
                <th className="px-5 py-3.5">Avg Delivery Time</th>
                <th className="px-5 py-3.5">Avg Pick Time</th>
                <th className="px-5 py-3.5">Capacity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stores.map((store: any, idx: number) => {
                const isWinner = idx === 0;
                return (
                  <tr key={store.storeId} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-5 py-4">
                      {isWinner ? (
                        <div className="w-7 h-7 rounded-full bg-yellow-400 text-gray-950 font-black flex items-center justify-center text-xs shadow-xs">
                          🏆
                        </div>
                      ) : (
                        <span className="font-extrabold text-gray-400 text-sm pl-2">#{idx + 1}</span>
                      )}
                    </td>

                    <td className="px-5 py-4 font-bold text-gray-900 text-sm">
                      {store.storeName}
                      <div className="text-[10px] text-gray-400 font-normal">{store.storeId}</div>
                    </td>

                    <td className="px-5 py-4 font-semibold text-gray-600">{store.city}</td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black text-blinkit-green">
                          {store.slaCompliance}%
                        </span>
                        <div className="w-20 bg-gray-200 rounded-full h-2 overflow-hidden hidden sm:block">
                          <div
                            className="bg-emerald-500 h-full rounded-full"
                            style={{ width: `${store.slaCompliance}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 font-bold text-gray-800">{store.totalOrders}</td>

                    <td className="px-5 py-4 font-bold text-red-600">{store.breachedOrders}</td>

                    <td className="px-5 py-4 font-extrabold text-gray-900">
                      {Math.floor(store.avgDeliverySeconds / 60)}m {store.avgDeliverySeconds % 60}s
                    </td>

                    <td className="px-5 py-4 font-bold text-gray-700">{store.avgPickSeconds}s</td>

                    <td className="px-5 py-4 text-gray-500 font-medium">
                      {store.capacity} orders/hr
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
