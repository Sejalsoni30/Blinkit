import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client.js';
import { useStore } from '../context/StoreContext.js';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton.js';
import { ExportButton } from '../components/common/ExportButton.js';
import { Boxes, AlertOctagon, Repeat, ShoppingCart } from 'lucide-react';

export const InventoryPage: React.FC = () => {
  const { selectedStoreId } = useStore();

  const queryParams = new URLSearchParams();
  if (selectedStoreId && selectedStoreId !== 'ALL') queryParams.append('storeId', selectedStoreId);

  const { data, isLoading } = useQuery({
    queryKey: ['inventory-risk', selectedStoreId],
    queryFn: async () => {
      const res = await api.get(`/products/inventory-risk?${queryParams.toString()}`);
      return res.data.data;
    },
  });

  if (isLoading) return <LoadingSkeleton />;

  const items = data?.items || [];
  const totalLowStock = data?.totalLowStockItems || 0;
  const criticalCount = data?.criticalStockoutRiskCount || 0;

  const exportColumns = [
    { header: 'SKU', key: 'sku' },
    { header: 'Product Name', key: 'name' },
    { header: 'Category', key: 'category' },
    { header: 'Location', key: 'aisle' },
    { header: 'Current Stock', key: 'currentStock' },
    { header: 'Reorder Level', key: 'reorderLevel' },
    { header: 'Days of Cover', key: 'daysOfCover' },
    { header: 'Risk Level', key: 'riskLevel' },
    { header: 'Suggested Reorder', key: 'suggestedReorderQty' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              Inventory & Stockout Risk
            </h1>
            <span className="bg-rose-100 text-rose-800 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-rose-300">
              {criticalCount} Critical Stockouts
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Real-time stock depletion tracker, days of cover run-rate & substitution delay triggers.
          </p>
        </div>

        <ExportButton
          data={items}
          filename="blinkit_inventory_risk"
          title="Inventory Risk & Reorder List"
          columns={exportColumns}
        />
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            Items Below Reorder Threshold
          </div>
          <div className="text-3xl font-black text-gray-900">{totalLowStock}</div>
          <p className="text-xs text-gray-400 mt-1">Requires immediate supplier purchase order</p>
        </div>

        <div className="bg-white border border-rose-200 rounded-2xl p-5 shadow-xs bg-rose-50/30">
          <div className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">
            Critical Stockout Risk (&lt;12 hrs cover)
          </div>
          <div className="text-3xl font-black text-rose-600">{criticalCount}</div>
          <p className="text-xs text-rose-500 mt-1">Imminent risk of order cancellations</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            Avg Substitution Delay Penalty
          </div>
          <div className="text-3xl font-black text-amber-600">+165s</div>
          <p className="text-xs text-gray-400 mt-1">Delay added when item is substituted</p>
        </div>
      </div>

      {/* Low Stock Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-base font-extrabold text-gray-900 tracking-tight">
            Depleted Inventory & Reorder Recommendations
          </h3>
          <p className="text-xs text-gray-500">
            Ranked by days of cover remaining based on recent dark store run-rate velocity
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Item Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Current Stock</th>
                <th className="px-4 py-3">Reorder Point</th>
                <th className="px-4 py-3">Days of Cover</th>
                <th className="px-4 py-3">Risk Level</th>
                <th className="px-4 py-3">Suggested Reorder</th>
                <th className="px-4 py-3">Alternative SKU</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item: any) => (
                <tr key={item.sku} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-gray-900">{item.sku}</td>
                  <td className="px-4 py-3 font-bold text-gray-800">{item.name}</td>
                  <td className="px-4 py-3 text-gray-500">{item.category}</td>
                  <td className="px-4 py-3 text-gray-600 font-semibold">
                    {item.aisle} • {item.rack}
                  </td>
                  <td className="px-4 py-3 font-extrabold text-red-600">{item.currentStock} units</td>
                  <td className="px-4 py-3 text-gray-500">{item.reorderLevel} units</td>
                  <td className="px-4 py-3 font-bold text-gray-900">{item.daysOfCover} days</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        item.riskLevel === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}
                    >
                      {item.riskLevel}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-extrabold text-blinkit-green">
                    +{item.suggestedReorderQty} units
                  </td>
                  <td className="px-4 py-3 text-gray-400 font-mono text-[10px]">
                    {item.substitutionSku}
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
