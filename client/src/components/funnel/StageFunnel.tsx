import React from 'react';
import { StageFunnelItem } from '../../types/index.js';
import { AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';

interface StageFunnelProps {
  stages: StageFunnelItem[];
  avgTotalSeconds: number;
  p90TotalSeconds: number;
  slaTargetSeconds: number;
}

export const StageFunnel: React.FC<StageFunnelProps> = ({
  stages,
  avgTotalSeconds,
  p90TotalSeconds,
  slaTargetSeconds,
}) => {
  const isOverallBreached = avgTotalSeconds > slaTargetSeconds;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
        <div>
          <h3 className="text-base font-extrabold text-gray-900 tracking-tight">
            Stage-Wise Fulfillment Pipeline Funnel
          </h3>
          <p className="text-xs text-gray-500">
            End-to-end telemetry from order placement to doorstep handover (Target: &lt;600s)
          </p>
        </div>

        <div className="flex items-center gap-4 bg-gray-50 px-3.5 py-2 rounded-xl border border-gray-200">
          <div>
            <div className="text-[10px] text-gray-500 font-bold uppercase">Avg Total</div>
            <div className={`text-base font-extrabold ${isOverallBreached ? 'text-red-600' : 'text-gray-900'}`}>
              {Math.floor(avgTotalSeconds / 60)}m {avgTotalSeconds % 60}s
            </div>
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div>
            <div className="text-[10px] text-gray-500 font-bold uppercase">P90 Total</div>
            <div className="text-base font-extrabold text-gray-900">
              {Math.floor(p90TotalSeconds / 60)}m {p90TotalSeconds % 60}s
            </div>
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div>
            <div className="text-[10px] text-gray-500 font-bold uppercase">SLA Limit</div>
            <div className="text-base font-extrabold text-emerald-700">10m 00s</div>
          </div>
        </div>
      </div>

      {/* Visual Pipeline Funnel Flow */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-6">
        {stages.map((stage, idx) => {
          const ratio = stage.avgSeconds / stage.targetSeconds;
          const isBottleneck = stage.isBottleneck;

          return (
            <div
              key={stage.id}
              className={`relative rounded-xl p-4 border transition-all ${
                isBottleneck
                  ? 'bg-rose-50/70 border-rose-300 ring-2 ring-rose-200 ring-opacity-50'
                  : 'bg-gray-50 border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Stage {idx + 1}
                </span>
                {isBottleneck ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-300 animate-pulse">
                    <AlertCircle className="w-3 h-3" />
                    Bottleneck
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    <CheckCircle className="w-3 h-3" />
                    On Target
                  </span>
                )}
              </div>

              <div className="font-extrabold text-sm text-gray-900 mb-0.5 truncate">
                {stage.name}
              </div>
              <p className="text-[10px] text-gray-500 mb-3 truncate">{stage.description}</p>

              {/* Progress bar vs target */}
              <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    isBottleneck ? 'bg-rose-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, ratio * 100)}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-[10px] text-gray-400 font-bold">Avg Time</div>
                  <div className="font-bold text-gray-900">{stage.avgSeconds}s</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 font-bold">P90 Time</div>
                  <div className="font-bold text-gray-900">{stage.p90Seconds}s</div>
                </div>
              </div>

              <div className="mt-2 text-[10px] text-gray-400 font-medium">
                Benchmark: {stage.targetSeconds}s
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between text-xs text-amber-900">
        <div className="flex items-center gap-2">
          <span className="font-bold">Funnel Diagnostics:</span>
          <span>
            {stages.some((s) => s.isBottleneck)
              ? `Attention required on: ${stages
                  .filter((s) => s.isBottleneck)
                  .map((s) => s.name)
                  .join(', ')}.`
              : 'All 5 stages operating within the 10-minute target SLA allocation window.'}
          </span>
        </div>
        <div className="text-[11px] text-amber-700 font-semibold hidden sm:block">
          Pipeline efficiency: {isOverallBreached ? 'Degraded' : 'Nominal'}
        </div>
      </div>
    </div>
  );
};
