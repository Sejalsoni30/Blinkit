import React from 'react';
import { motion } from 'framer-motion';
import {
  GitCommit,
  AlertTriangle,
  Grid,
  Users,
  Clock,
  Boxes,
  Zap,
  Sliders,
  Bell,
  Download,
} from 'lucide-react';

export const FeaturesGrid: React.FC = () => {
  const features = [
    {
      title: '5-Stage Fulfillment Funnel',
      description:
        'End-to-end telemetry measuring Assign, Pick, Pack, Handover, and Ride with real-time average and P90 latency tracking against benchmarks.',
      icon: GitCommit,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Root-Cause Pareto Analysis',
      description:
        'Decompose SLA breaches by cause: slow picking, packing queues, rider wait, or stockouts, complete with drill-down sample orders and prescribed fixes.',
      icon: AlertTriangle,
      color: 'bg-red-50 text-red-600',
    },
    {
      title: '2D Aisle × Hour Heatmap',
      description:
        'Interactive 8-Aisle by 24-Hour matrix mapping picker foot-traffic and pick duration, pinpointing evening warehouse congestion in real time.',
      icon: Grid,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      title: 'Picker Efficiency Leaderboard',
      description:
        'Shift-adjusted fair comparison of pickers across Morning, Afternoon, Evening, and Night shifts, tracking orders/hour and SLA breach rates.',
      icon: Users,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Demand vs. Staffing Risk',
      description:
        'Correlate customer order intake against on-duty picker rosters, automatically flagging understaffed hours when orders/picker/hr exceeds 14.',
      icon: Clock,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      title: 'Inventory & Stockout Predictor',
      description:
        'Track products below reorder thresholds, calculate days of cover velocity, and isolate order delays caused by customer substitution calls.',
      icon: Boxes,
      color: 'bg-rose-50 text-rose-600',
    },
    {
      title: 'Delay AI Breach Classifier',
      description:
        'Supervised machine learning ensemble predicting breach probability for incoming orders based on basket size, aisle spread, load, and weather.',
      icon: Zap,
      color: 'bg-yellow-50 text-yellow-700',
    },
    {
      title: 'What-If Capacity Simulator',
      description:
        'Mathematical queuing simulator allowing store managers to test adjustments to picker counts, pick speed, or handover times before peak shifts.',
      icon: Sliders,
      color: 'bg-indigo-50 text-indigo-600',
    },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-black uppercase tracking-wider text-blinkit-green bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Platform Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Engineered for Dark Store Precision
          </h2>
          <p className="text-sm text-gray-600">
            A comprehensive suite of analytics, prediction, and simulation tools built specifically for 10-minute micro-warehouses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="bg-gray-50/70 border border-gray-200 hover:border-yellow-400 hover:bg-white rounded-3xl p-6 shadow-xs hover:shadow-xl transition-all group"
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${feat.color} group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-extrabold text-gray-900 mb-2">{feat.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{feat.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
