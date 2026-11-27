import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client.js';
import { useStore } from '../context/StoreContext.js';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton.js';
import { ExportButton } from '../components/common/ExportButton.js';
import { Clock, AlertTriangle, Users, ShieldAlert, CheckCircle2 } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ComposedChart,
} from 'recharts';

export const StaffingPage: React.FC = () => {
  const { selectedStoreId } = useStore();

  const queryParams = new URLSearchParams();
  if (selectedStoreId && selectedStoreId !== 'ALL') queryParams.append('storeId', selectedStoreId);

  const { data, isLoading } = useQuery({
    queryKey: ['hourly-staffing', selectedStoreId],
    queryFn: async () => {
      const res = await api.get(`/analytics/hourly-demand?${queryParams.toString()}`);
      return res.data.data;
    },
  });

  if (isLoading) return <LoadingSkeleton />;

  const hourly = data || [];

  // Model staffing capacity: on-shift pickers by hour (e.g., Morning 8, Afternoon 6, Evening 10, Night 4)
  const staffingData = hourly.map((h: any) => {
    let pickersOnShift = 6;
    if (h.hour >= 8 && h.hour <= 11) pickersOnShift = 10;
    else if (h.hour >= 12 && h.hour <= 17) pickersOnShift = 7;
    else if (h.hour >= 18 && h.hour <= 22) pickersOnShift = 11;
    else pickersOnShift = 4;

    const ordersPerPicker = Number((h.orderCount / pickersOnShift).toFixed(1));
    const isUnderstaffed = ordersPerPicker > 14.0 || h.slaCompliance < 88.0;

    return {
      hour: `${String(h.hour).padStart(2, '0')}:00`,
      Orders: h.orderCount,
      'Pickers on Shift': pickersOnShift,
      'Orders / Picker / Hr': ordersPerPicker,
      'SLA Compliance (%)': h.slaCompliance,
      isUnderstaffed,
    };
  });

  const exportColumns = [
    { header: 'Hour', key: 'hour' },
    { header: 'Orders Volume', key: 'Orders' },
    { header: 'Pickers on Shift', key: 'Pickers on Shift' },
    { header: 'Ratio (Orders/Picker/Hr)', key: 'Orders / Picker / Hr' },
    { header: 'SLA Compliance (%)', key: 'SLA Compliance (%)' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              Demand & Staffing Optimization
            </h1>
            <span className="bg-amber-100 text-amber-900 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-amber-300">
              Capacity Planning
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Correlate hourly customer order influx against picker roster to detect understaffed windows.
          </p>
        </div>

        <ExportButton
          data={staffingData}
          filename="blinkit_staffing_analysis"
          title="Staffing vs Demand Analysis"
          columns={exportColumns}
        />
      </div>

      {/* Primary Chart: Order Intake vs Pickers on Shift */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2 mb-4">
          <div>
            <h3 className="text-base font-extrabold text-gray-900 tracking-tight">
              Hourly Order Intake vs. Active Pickers on Shift
            </h3>
            <p className="text-xs text-gray-500">
              Healthy benchmark ratio is 10-12 orders per picker per hour
            </p>
          </div>
          <div className="text-xs font-semibold text-gray-500">
            Target ratio: &lt;12 orders/picker/hr
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={staffingData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="hour" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis
                yAxisId="left"
                stroke="#94A3B8"
                fontSize={11}
                tickLine={false}
                label={{ value: 'Orders', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#64748B' }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#94A3B8"
                fontSize={11}
                tickLine={false}
                label={{ value: 'Staff Count', angle: 90, position: 'insideRight', fontSize: 10, fill: '#64748B' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  border: '1px solid #E2E8F0',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar yAxisId="left" dataKey="Orders" fill="#F8CB46" radius={[6, 6, 0, 0]} />
              <Line
                yAxisId="right"
                type="stepAfter"
                dataKey="Pickers on Shift"
                stroke="#0C831F"
                strokeWidth={3}
                dot={{ r: 4, fill: '#0C831F' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Hourly Understaffing Breakdown Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-base font-extrabold text-gray-900 tracking-tight">
            Hourly Capacity Risk Matrix
          </h3>
          <p className="text-xs text-gray-500">
            Hours where picker-to-order ratio exceeds safe fulfillment capacity thresholds
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Time Window</th>
                <th className="px-4 py-3">Order Volume</th>
                <th className="px-4 py-3">Pickers Scheduled</th>
                <th className="px-4 py-3">Orders/Picker/Hr</th>
                <th className="px-4 py-3">SLA Compliance</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action Required</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {staffingData.map((row: any) => (
                <tr
                  key={row.hour}
                  className={`transition-colors ${
                    row.isUnderstaffed ? 'bg-rose-50/60 font-semibold' : 'hover:bg-gray-50/80'
                  }`}
                >
                  <td className="px-4 py-3 font-bold text-gray-900">{row.hour}</td>
                  <td className="px-4 py-3 text-gray-800">{row.Orders}</td>
                  <td className="px-4 py-3 text-gray-800">{row['Pickers on Shift']}</td>
                  <td className="px-4 py-3 font-extrabold">
                    <span className={row['Orders / Picker / Hr'] > 14 ? 'text-rose-600' : 'text-gray-900'}>
                      {row['Orders / Picker / Hr']}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold">
                    <span className={row['SLA Compliance (%)'] < 88 ? 'text-rose-600' : 'text-emerald-700'}>
                      {row['SLA Compliance (%)']}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {row.isUnderstaffed ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-300">
                        <AlertTriangle className="w-3 h-3" />
                        Understaffed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        Optimal
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500 font-medium">
                    {row.isUnderstaffed
                      ? 'Add 2 floating pickers during this surge'
                      : 'Maintain current staffing'}
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
