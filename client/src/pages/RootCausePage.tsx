import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client.js';
import { useStore } from '../context/StoreContext.js';
import { RootCauseItem } from '../types/index.js';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton.js';
import { ExportButton } from '../components/common/ExportButton.js';
import {
  AlertTriangle,
  Clock,
  Layers,
  Bike,
  Repeat,
  CloudRain,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from 'recharts';

export const RootCausePage: React.FC = () => {
  const { selectedStoreId, startDate, endDate } = useStore();

  const queryParams = new URLSearchParams();
  if (selectedStoreId && selectedStoreId !== 'ALL') queryParams.append('storeId', selectedStoreId);
  if (startDate) queryParams.append('startDate', startDate);
  if (endDate) queryParams.append('endDate', endDate);

  const { data, isLoading } = useQuery({
    queryKey: ['root-causes', selectedStoreId, startDate, endDate],
    queryFn: async () => {
      const res = await api.get(`/analytics/root-causes?${queryParams.toString()}`);
      return res.data.data;
    },
  });

  if (isLoading) return <LoadingSkeleton />;

  const causes: RootCauseItem[] = data?.causes || [];
  const totalBreaches = data?.totalBreaches || 0;

  const chartData = causes.map((c) => ({
    name: c.cause.replace('_', ' '),
    count: c.count,
    percentage: c.percentage,
    avgDelay: `${c.avgDuration}s`,
  }));

  const COLORS = ['#E53935', '#FB8C00', '#F8CB46', '#8E24AA', '#1E88E5', '#607D8B'];

  const exportColumns = [
    { header: 'Breach Cause', key: 'name' },
    { header: 'Breach Count', key: 'count' },
    { header: 'Share of Breaches (%)', key: 'percentage' },
    { header: 'Avg Delay Duration', key: 'avgDelay' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              Root-Cause Analysis
            </h1>
            <span className="bg-red-100 text-red-800 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-red-300">
              {totalBreaches} Breaches Audited
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Pareto decomposition of 10-minute SLA breaches with root-cause drill-downs and prescribed actions.
          </p>
        </div>

        <ExportButton
          data={chartData}
          filename="blinkit_root_causes"
          title="SLA Breach Root Cause Audit"
          columns={exportColumns}
        />
      </div>

      {/* Pareto Chart */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
        <div className="pb-4 border-b border-gray-100 mb-4">
          <h3 className="text-base font-extrabold text-gray-900 tracking-tight">
            Pareto Distribution of SLA Breaches by Root Cause
          </h3>
          <p className="text-xs text-gray-500">
            Rank-ordered frequency of delay drivers across picking, bagging queues, and transit
          </p>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  border: '1px solid #E2E8F0',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cause Cards Grid with Operational Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {causes.map((cause, idx) => (
          <div
            key={cause.cause}
            className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Rank #{idx + 1}
                </span>
                <span className="text-xs font-extrabold bg-red-50 text-red-700 px-2 py-0.5 rounded-full border border-red-200">
                  {cause.percentage}% of Breaches
                </span>
              </div>

              <h4 className="text-base font-extrabold text-gray-900 mb-1">{cause.label}</h4>
              <div className="flex items-baseline gap-2 mb-3 text-xs text-gray-500">
                <span>
                  Occurrences: <strong className="text-gray-900">{cause.count}</strong>
                </span>
                <span>•</span>
                <span>
                  Avg Duration: <strong className="text-red-600">{cause.avgDuration}s</strong>
                </span>
              </div>

              {/* Recommended Operational Action */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 mb-4">
                <div className="font-bold text-[11px] text-amber-800 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                  Prescribed Fix
                </div>
                <p className="text-[11px] leading-relaxed">{cause.recommendedAction}</p>
              </div>
            </div>

            {/* Sample Breached Orders */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Sample Breached Orders
              </div>
              <div className="flex flex-wrap gap-1.5">
                {cause.sampleOrders?.slice(0, 3).map((sample) => (
                  <span
                    key={sample.orderId}
                    className="text-[10px] font-mono bg-gray-100 hover:bg-yellow-100 text-gray-700 px-2 py-0.5 rounded cursor-default border border-gray-200"
                    title={`Items: ${sample.itemCount} • Total: ${sample.totalDuration}s`}
                  >
                    {sample.orderId} ({sample.totalDuration}s)
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
