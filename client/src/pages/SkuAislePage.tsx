import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client.js';
import { useStore } from '../context/StoreContext.js';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton.js';
import { ExportButton } from '../components/common/ExportButton.js';
import { Grid, Clock, AlertTriangle, Layers, TrendingUp } from 'lucide-react';

export const SkuAislePage: React.FC = () => {
  const { selectedStoreId } = useStore();

  const queryParams = new URLSearchParams();
  if (selectedStoreId && selectedStoreId !== 'ALL') queryParams.append('storeId', selectedStoreId);

  // Fetch Slowest SKUs
  const { data: skusData, isLoading: loadingSkus } = useQuery({
    queryKey: ['slow-skus', selectedStoreId],
    queryFn: async () => {
      const res = await api.get(`/analytics/sku-pick-times?${queryParams.toString()}`);
      return res.data.data;
    },
  });

  // Fetch Aisle Heatmap
  const { data: heatmapData, isLoading: loadingHeatmap } = useQuery({
    queryKey: ['aisle-heatmap', selectedStoreId],
    queryFn: async () => {
      const res = await api.get(`/analytics/aisle-heatmap?${queryParams.toString()}`);
      return res.data.data;
    },
  });

  if (loadingSkus || loadingHeatmap) return <LoadingSkeleton />;

  const slowestSkus = skusData || [];
  const heatmap = heatmapData || [];

  // 2D Matrix Preparation: Aisles 1 to 8 across 24 Hours
  const aisles = ['Aisle 1', 'Aisle 2', 'Aisle 3', 'Aisle 4', 'Aisle 5', 'Aisle 6', 'Aisle 7', 'Aisle 8'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Map lookup: aisle_hour -> { picksCount, avgPickSeconds }
  const heatMapLookup = new Map<string, { picksCount: number; avgPickSeconds: number }>();
  let maxPicks = 1;

  heatmap.forEach((entry: any) => {
    const key = `${entry.aisle}_${entry.hour}`;
    heatMapLookup.set(key, {
      picksCount: entry.picksCount,
      avgPickSeconds: entry.avgPickSeconds,
    });
    if (entry.picksCount > maxPicks) {
      maxPicks = entry.picksCount;
    }
  });

  const getHeatmapColor = (count: number) => {
    if (!count || count === 0) return 'bg-gray-100 text-gray-400';
    const intensity = count / maxPicks;
    if (intensity > 0.75) return 'bg-red-500 text-white font-bold';
    if (intensity > 0.5) return 'bg-orange-400 text-white font-bold';
    if (intensity > 0.25) return 'bg-yellow-300 text-gray-900 font-semibold';
    return 'bg-emerald-100 text-emerald-800';
  };

  const exportColumns = [
    { header: 'SKU', key: 'sku' },
    { header: 'Product Name', key: 'name' },
    { header: 'Aisle', key: 'aisle' },
    { header: 'Avg Pick Seconds', key: 'avgOrderPickSeconds' },
    { header: 'Units Ordered', key: 'totalUnits' },
    { header: 'Breach Rate (%)', key: 'breachRate' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              SKU & Aisle Analytics
            </h1>
            <span className="bg-yellow-100 text-yellow-900 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-yellow-300">
              Warehouse Telemetry
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Detect picking bottlenecks, slow-moving physical locations, and hourly aisle congestion heatmaps.
          </p>
        </div>

        <ExportButton
          data={slowestSkus}
          filename="blinkit_slowest_skus"
          title="Slowest SKUs Telemetry"
          columns={exportColumns}
        />
      </div>

      {/* 2D Aisle Heatmap Matrix */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2 mb-4">
          <div>
            <h3 className="text-base font-extrabold text-gray-900 tracking-tight">
              2D Aisle × Hour Congestion Heatmap
            </h3>
            <p className="text-xs text-gray-500">
              Color intensity indicates pick volume and picker foot-traffic congestion
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-400 font-semibold">Intensity:</span>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">Low</span>
            <span className="px-2 py-0.5 rounded bg-yellow-300 text-gray-900 font-bold text-[10px]">Moderate</span>
            <span className="px-2 py-0.5 rounded bg-orange-400 text-white font-bold text-[10px]">Elevated</span>
            <span className="px-2 py-0.5 rounded bg-red-500 text-white font-bold text-[10px]">Peak Congestion</span>
          </div>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="min-w-[760px]">
            {/* Hour Header */}
            <div className="grid grid-cols-[100px_repeat(24,_1fr)] gap-1 text-[10px] font-bold text-gray-400 text-center mb-1">
              <div>Aisle</div>
              {hours.map((h) => (
                <div key={h}>{String(h).padStart(2, '0')}</div>
              ))}
            </div>

            {/* Aisle Rows */}
            {aisles.map((aisle) => (
              <div key={aisle} className="grid grid-cols-[100px_repeat(24,_1fr)] gap-1 mb-1 items-center">
                <div className="text-xs font-bold text-gray-700 truncate pr-2">{aisle}</div>
                {hours.map((h) => {
                  const entry = heatMapLookup.get(`${aisle}_${h}`);
                  const count = entry?.picksCount || 0;
                  const avgTime = entry?.avgPickSeconds || 0;

                  return (
                    <div
                      key={h}
                      title={`${aisle} @ ${h}:00 - ${count} picks, avg ${avgTime}s`}
                      className={`h-7 rounded flex items-center justify-center text-[10px] cursor-pointer hover:ring-2 hover:ring-black transition-all ${getHeatmapColor(
                        count
                      )}`}
                    >
                      {count > 0 ? count : ''}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 text-[11px] text-gray-500 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
          <strong className="text-gray-700">Actionable insight:</strong> Aisle 2 (Fruits & Veg) and Aisle 3 (Snacks) experience intense concurrency bottlenecks between 18:00 and 21:00. Recommend zoning pickers by aisle rather than per-order routing during evening surges.
        </div>
      </div>

      {/* Slowest to Pick SKUs Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-base font-extrabold text-gray-900 tracking-tight">
            Top 10 Slowest-to-Pick SKUs
          </h3>
          <p className="text-xs text-gray-500">
            Products that consistently add excessive latency to fulfillment pipelines
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Product Name</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Units Picked</th>
                <th className="px-4 py-3">Avg Pick Time</th>
                <th className="px-4 py-3">Breach Correlation</th>
                <th className="px-4 py-3">Recommended Layout Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {slowestSkus.map((sku: any) => (
                <tr key={sku.sku} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-gray-900">{sku.sku}</td>
                  <td className="px-4 py-3 font-bold text-gray-800">{sku.name}</td>
                  <td className="px-4 py-3 text-gray-600 font-semibold">{sku.aisle}</td>
                  <td className="px-4 py-3 text-gray-600">{sku.totalUnits}</td>
                  <td className="px-4 py-3 font-extrabold text-rose-600">{sku.avgOrderPickSeconds}s</td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {sku.breachRate}% of orders
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    Relocate to front-of-rack R-01 near packing station
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
