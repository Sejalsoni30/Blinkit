import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client.js';
import { useStore } from '../context/StoreContext.js';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton.js';
import { ExportButton } from '../components/common/ExportButton.js';
import { Users, Star, Award, TrendingUp, AlertCircle } from 'lucide-react';

export const PickerPage: React.FC = () => {
  const { selectedStoreId } = useStore();

  const queryParams = new URLSearchParams();
  if (selectedStoreId && selectedStoreId !== 'ALL') queryParams.append('storeId', selectedStoreId);

  const { data, isLoading } = useQuery({
    queryKey: ['picker-leaderboard', selectedStoreId],
    queryFn: async () => {
      const res = await api.get(`/pickers/leaderboard?${queryParams.toString()}`);
      return res.data.data;
    },
  });

  if (isLoading) return <LoadingSkeleton />;

  const pickers = data || [];

  // Group by Shift for fair comparison
  const shifts = ['MORNING', 'AFTERNOON', 'EVENING', 'NIGHT'];

  const exportColumns = [
    { header: 'Picker ID', key: 'pickerId' },
    { header: 'Name', key: 'name' },
    { header: 'Store', key: 'storeId' },
    { header: 'Shift', key: 'shift' },
    { header: 'Experience', key: 'experienceLevel' },
    { header: 'Orders/Hour', key: 'ordersPerHour' },
    { header: 'Avg Pick (s)', key: 'avgPickSeconds' },
    { header: 'Breach Rate (%)', key: 'breachRate' },
    { header: 'Rating', key: 'rating' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              Picker Performance & Efficiency
            </h1>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-300">
              Staff Metrics
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Compare pick speed, orders/hour, and SLA breach rate across shifts and experience levels.
          </p>
        </div>

        <ExportButton
          data={pickers}
          filename="blinkit_picker_performance"
          title="Picker Leaderboard"
          columns={exportColumns}
        />
      </div>

      {/* Shift Comparison Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {shifts.map((shiftName) => {
          const shiftPickers = pickers.filter((p: any) => p.shift === shiftName);
          const avgPick =
            shiftPickers.length > 0
              ? Math.round(
                  shiftPickers.reduce((acc: number, p: any) => acc + p.avgPickSeconds, 0) /
                    shiftPickers.length
                )
              : 0;
          const avgOrdersHr =
            shiftPickers.length > 0
              ? (
                  shiftPickers.reduce((acc: number, p: any) => acc + p.ordersPerHour, 0) /
                  shiftPickers.length
                ).toFixed(1)
              : '0';

          return (
            <div key={shiftName} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                {shiftName} Shift
              </div>
              <div className="text-2xl font-black text-gray-900">{avgPick}s</div>
              <div className="text-xs text-gray-500 mb-3">Avg pick time per order</div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs font-semibold">
                <span className="text-gray-500">Throughput:</span>
                <span className="text-emerald-700 font-extrabold">{avgOrdersHr} orders/hr</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-base font-extrabold text-gray-900 tracking-tight">
            Picker Efficiency Leaderboard
          </h3>
          <p className="text-xs text-gray-500">
            Ranked by fastest average pick seconds with shift-adjusted SLA breach rate
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Rank</th>
                <th className="px-4 py-3">Picker</th>
                <th className="px-4 py-3">Store</th>
                <th className="px-4 py-3">Shift</th>
                <th className="px-4 py-3">Experience</th>
                <th className="px-4 py-3">Orders Picked</th>
                <th className="px-4 py-3">Orders / Hr</th>
                <th className="px-4 py-3">Avg Pick Time</th>
                <th className="px-4 py-3">Breach Rate</th>
                <th className="px-4 py-3">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pickers.map((picker: any, idx: number) => {
                const isTop3 = idx < 3;
                return (
                  <tr key={picker.pickerId} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-4 py-3">
                      {isTop3 ? (
                        <span className="w-6 h-6 rounded-full bg-yellow-100 text-yellow-900 font-black flex items-center justify-center text-[11px] border border-yellow-300">
                          {idx + 1}
                        </span>
                      ) : (
                        <span className="font-bold text-gray-400 pl-2">#{idx + 1}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-900">{picker.name}</td>
                    <td className="px-4 py-3 text-gray-500 font-medium">{picker.storeId}</td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                        {picker.shift}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          picker.experienceLevel === 'SENIOR'
                            ? 'bg-emerald-50 text-emerald-800'
                            : picker.experienceLevel === 'MID'
                            ? 'bg-blue-50 text-blue-800'
                            : 'bg-amber-50 text-amber-800'
                        }`}
                      >
                        {picker.experienceLevel}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-800">{picker.totalOrders}</td>
                    <td className="px-4 py-3 font-extrabold text-blinkit-green">
                      {picker.ordersPerHour}/hr
                    </td>
                    <td className="px-4 py-3 font-black text-gray-900">{picker.avgPickSeconds}s</td>
                    <td className="px-4 py-3">
                      <span
                        className={`font-bold ${
                          picker.breachRate > 12 ? 'text-red-600' : 'text-gray-700'
                        }`}
                      >
                        {picker.breachRate}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 font-bold text-amber-600">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{picker.rating}</span>
                      </div>
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
