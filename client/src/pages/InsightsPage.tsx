import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client.js';
import { useStore } from '../context/StoreContext.js';
import { SmartInsight } from '../types/index.js';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton.js';
import { Lightbulb, TrendingUp, AlertTriangle, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

export const InsightsPage: React.FC = () => {
  const { selectedStoreId } = useStore();

  const queryParams = new URLSearchParams();
  if (selectedStoreId && selectedStoreId !== 'ALL') queryParams.append('storeId', selectedStoreId);

  const { data, isLoading } = useQuery({
    queryKey: ['smart-insights', selectedStoreId],
    queryFn: async () => {
      const res = await api.get(`/predict/insights?${queryParams.toString()}`);
      return res.data.data;
    },
  });

  if (isLoading) return <LoadingSkeleton />;

  const insights: SmartInsight[] = data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Smart Prescriptive Insights
          </h1>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-300">
            Ranked by Impact
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Rule-based operational recommendations generated automatically from telemetry bottlenecks.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {insights.map((ins, idx) => (
          <div
            key={ins.id}
            className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-yellow-100 text-yellow-900 px-2 py-0.5 rounded">
                  Priority #{idx + 1} • {ins.category.replace('_', ' ')}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    ins.severity === 'HIGH'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {ins.severity} IMPACT
                </span>
              </div>

              <h3 className="text-base font-extrabold text-gray-900">{ins.title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{ins.recommendation}</p>
            </div>

            <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 md:border-l border-gray-100 pt-3 md:pt-0 md:pl-6 shrink-0">
              <div className="text-left md:text-right">
                <div className="text-[10px] font-bold uppercase text-gray-400">Projected Recovery</div>
                <div className="text-sm font-black text-emerald-700 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>{ins.projectedSlaImpact}</span>
                </div>
              </div>

              <div className="mt-2 text-xs font-bold text-gray-400">
                Impact Score: <strong className="text-gray-900">{ins.impactScore}/100</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
