import React from 'react';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle2, Warehouse } from 'lucide-react';

export const StatsStrip: React.FC = () => {
  const stats = [
    {
      label: 'Orders Analyzed',
      value: '10,000+',
      sub: 'Simulated 30-day realistic telemetry',
      icon: Package,
    },
    {
      label: 'Avg Fulfillment Time',
      value: '440s',
      sub: '7m 20s (well inside 600s SLA)',
      icon: Clock,
    },
    {
      label: 'SLA Compliance Rate',
      value: '91.2%',
      sub: 'Target: >90% national benchmark',
      icon: CheckCircle2,
    },
    {
      label: 'Dark Stores Monitored',
      value: '5 Hubs',
      sub: 'Bengaluru, Delhi, Mumbai, GGN, HYD',
      icon: Warehouse,
    },
  ];

  return (
    <section className="py-12 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-5 rounded-2xl bg-gray-50/70 border border-gray-100 hover:border-gray-200 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {stat.label}
                  </span>
                  <Icon className="w-4 h-4 text-blinkit-green" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500 mt-1">{stat.sub}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
