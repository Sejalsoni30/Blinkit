import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Store, LineChart, CheckCircle2 } from 'lucide-react';

export const RolesSection: React.FC = () => {
  const roles = [
    {
      title: 'City Ops Head (Admin)',
      badge: 'Full Fleet Scope',
      description:
        'Oversees national operations across all dark store hubs with fleet comparison leaderboards, global staffing parameters, and What-If simulation modeling.',
      icon: ShieldCheck,
      color: 'bg-yellow-50 text-yellow-900 border-yellow-200',
      capabilities: [
        'National store comparison leaderboard',
        'What-If capacity & rush hour simulation',
        'Bulk CSV order telemetry import',
        'Fleet-wide rule-based smart insights',
      ],
    },
    {
      title: 'Dark Store Manager',
      badge: 'Store-Scoped Scope',
      description:
        'Focuses on immediate shift staffing, local inventory stockout alerts, and aisle bottleneck fixes scoped strictly to their assigned dark store.',
      icon: Store,
      color: 'bg-emerald-50 text-emerald-900 border-emerald-200',
      capabilities: [
        'Real-time picker shift leaderboard',
        'Hourly demand vs staffing risk alerts',
        'Stockout risk & substitution run-rates',
        'Socket.IO live incident resolution',
      ],
    },
    {
      title: 'Operations Analyst',
      badge: 'Read-Only Exploration',
      description:
        'Performs deep retrospective audits on SLA breaches, isolates slowest-to-pick SKUs, evaluates ML predictor accuracy, and exports PDF/CSV summaries.',
      icon: LineChart,
      color: 'bg-blue-50 text-blue-900 border-blue-200',
      capabilities: [
        'Order lifecycle millisecond timelines',
        '2D Aisle × Hour heatmaps',
        'One-click PDF scorecard generation',
        'Data exports for external BI tooling',
      ],
    },
  ];

  return (
    <section id="roles" className="py-20 bg-slate-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-black uppercase tracking-wider text-purple-700 bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
            Tailored User Roles
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Role-Based Access Control Built for Scale
          </h2>
          <p className="text-sm text-gray-600">
            Custom views and permission scopes designed for the exact operational needs of leadership, store managers, and analysts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role, idx) => {
            const Icon = role.icon;
            return (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gray-50 text-gray-800 rounded-2xl border border-gray-100">
                      <Icon className="w-5 h-5 text-blinkit-green" />
                    </div>
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${role.color}`}
                    >
                      {role.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-gray-900 mb-2">{role.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-5">{role.description}</p>

                  <div className="space-y-2 pt-4 border-t border-gray-100">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Key Capabilities
                    </div>
                    {role.capabilities.map((cap) => (
                      <div key={cap} className="flex items-start gap-2 text-xs text-gray-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blinkit-green shrink-0 mt-0.5" />
                        <span>{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
