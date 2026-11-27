import React from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { ArrowRight, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPreview: React.FC = () => {
  // Sample realistic chart data for landing preview
  const hourlySample = [
    { hour: '08:00', Orders: 38, SLA: 92.5 },
    { hour: '10:00', Orders: 46, SLA: 89.2 },
    { hour: '12:00', Orders: 32, SLA: 94.0 },
    { hour: '14:00', Orders: 28, SLA: 95.1 },
    { hour: '16:00', Orders: 35, SLA: 93.4 },
    { hour: '18:00', Orders: 52, SLA: 87.8 },
    { hour: '20:00', Orders: 58, SLA: 86.4 },
    { hour: '22:00', Orders: 42, SLA: 91.0 },
  ];

  const causeSample = [
    { cause: 'Slow Pick', count: 48, color: '#E53935' },
    { cause: 'Pack Queue', count: 32, color: '#FB8C00' },
    { cause: 'Rider Wait', count: 28, color: '#F8CB46' },
    { cause: 'Stockouts', count: 18, color: '#8E24AA' },
    { cause: 'Rain/Traffic', count: 14, color: '#1E88E5' },
  ];

  return (
    <section id="preview" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Interactive Telemetry
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Live Dashboard Preview
          </h2>
          <p className="text-sm text-gray-600">
            Explore sample telemetry graphs rendered by the exact same engine powering production operations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart 1: Hourly Intake vs SLA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 bg-gray-50/70 border border-gray-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
              <div>
                <h3 className="text-sm font-extrabold text-gray-900">
                  Hourly Intake vs. SLA Compliance %
                </h3>
                <p className="text-[11px] text-gray-500">Peak hour degradation monitoring</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Live Recharts Feed
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={hourlySample} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="hour" stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <YAxis yAxisId="left" stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" domain={[80, 100]} stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      fontSize: '11px',
                    }}
                  />
                  <Area yAxisId="left" type="monotone" dataKey="Orders" fill="#FEF4D6" stroke="#F8CB46" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="SLA" stroke="#0C831F" strokeWidth={2.5} dot={{ r: 3 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 text-[11px] text-gray-500 bg-white p-2.5 rounded-xl border border-gray-100">
              <strong className="text-gray-800">Insight:</strong> Notice the dip to 86.4% SLA during the 20:00 dinner rush when order intake peaks at 58 orders/hr.
            </div>
          </motion.div>

          {/* Chart 2: Pareto Breach Causes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-gray-50/70 border border-gray-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
              <div>
                <h3 className="text-sm font-extrabold text-gray-900">Pareto Breach Drivers</h3>
                <p className="text-[11px] text-gray-500">Root-cause occurrences</p>
              </div>
              <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                140 Breaches
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={causeSample} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="cause" stroke="#94A3B8" fontSize={9} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      fontSize: '11px',
                    }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {causeSample.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 text-[11px] text-gray-500 bg-white p-2.5 rounded-xl border border-gray-100">
              <strong className="text-gray-800">Pareto rule:</strong> Slow picking accounts for 34% of all breach events.
            </div>
          </motion.div>
        </div>

        {/* CTA to Enter Full App */}
        <div className="mt-10 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-md transition-colors"
          >
            <span>Launch Full Operations Console</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
