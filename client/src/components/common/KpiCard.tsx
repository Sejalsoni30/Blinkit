import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: number; // delta vs previous period
  trendUnit?: string;
  isPositiveGood?: boolean; // true if positive trend is good (e.g. SLA rate), false if positive trend is bad (e.g. breach count, delay sec)
  whatThisMeans: string;
  colorScheme?: 'yellow' | 'green' | 'blue' | 'purple' | 'red';
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendUnit = '%',
  isPositiveGood = true,
  whatThisMeans,
  colorScheme = 'yellow',
}) => {
  const isGood =
    trend !== undefined
      ? isPositiveGood
        ? trend > 0
        : trend < 0
      : null;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
            {title}
          </span>
          <div className="p-2 rounded-xl bg-gray-50 border border-gray-100 text-gray-700">
            <Icon className="w-4 h-4 text-blinkit-green" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {value}
          </span>
          {subtitle && <span className="text-xs text-gray-400 font-medium">{subtitle}</span>}
        </div>

        {trend !== undefined && (
          <div className="flex items-center gap-1.5 mt-2">
            <span
              className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                isGood
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {trend > 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : trend < 0 ? (
                <TrendingDown className="w-3 h-3" />
              ) : (
                <Minus className="w-3 h-3" />
              )}
              {trend > 0 ? `+${trend}` : trend}
              {trendUnit}
            </span>
            <span className="text-[11px] text-gray-400">vs prev period</span>
          </div>
        )}
      </div>

      {/* One-line "What this means" explanation */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-start gap-1.5 text-[11px] text-gray-500">
        <span className="font-bold text-gray-700 shrink-0">Insight:</span>
        <span className="truncate">{whatThisMeans}</span>
      </div>
    </div>
  );
};
