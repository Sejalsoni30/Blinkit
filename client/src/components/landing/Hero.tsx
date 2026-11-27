import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Play,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
} from 'lucide-react';

export const Hero: React.FC = () => {
  const { user } = useAuth();

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-yellow-50/50 via-white to-slate-50">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-yellow-200/30 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-100/80 border border-yellow-300 text-yellow-900 text-xs font-extrabold shadow-2xs"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>10-Minute SLA Intelligence for Quick-Commerce</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.12]"
          >
            See where every second of fulfillment goes.
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-gray-600 font-medium leading-relaxed max-w-2xl mx-auto"
          >
            Dark stores promise a 10-minute delivery. When orders breach SLA, stop guessing.
            Instrument every milestone: <strong>assign</strong>, <strong>pick</strong>, <strong>pack</strong>, <strong>handover</strong>, and <strong>ride</strong> in real time.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
          >
            <Link
              to={user ? '/dashboard' : '/login'}
              className="w-full sm:w-auto px-7 py-3.5 bg-yellow-400 hover:bg-yellow-500 text-gray-950 font-black text-sm rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
            >
              <span>{user ? 'Go to Dashboard' : 'Get Started Free'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#preview"
              className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-gray-50 text-gray-800 font-extrabold text-sm rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-gray-800 text-gray-800" />
              <span>View Live Preview</span>
            </a>
          </motion.div>

          <div className="flex items-center justify-center gap-6 pt-2 text-[11px] text-gray-500 font-semibold">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blinkit-green" />
              10,000+ Orders Seeded
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blinkit-green" />
              Machine Learning Predictor
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blinkit-green" />
              Socket.IO Live Alerts
            </span>
          </div>
        </div>

        {/* Dashboard Mockup Component */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 lg:mt-16 max-w-5xl mx-auto bg-white rounded-3xl p-4 sm:p-6 shadow-2xl border border-gray-200 ring-1 ring-black/5"
        >
          {/* Mock Browser Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-3 text-xs font-mono text-gray-400">
                blinkit-ops.internal/dashboard
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Feed Active
              </span>
            </div>
          </div>

          {/* Mock KPI Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
              <div className="text-[10px] font-bold text-gray-400 uppercase">10m SLA Compliance</div>
              <div className="text-xl sm:text-2xl font-black text-blinkit-green">91.2%</div>
              <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">+1.4% vs prev week</div>
            </div>
            <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
              <div className="text-[10px] font-bold text-gray-400 uppercase">Avg Delivery Time</div>
              <div className="text-xl sm:text-2xl font-black text-gray-900">7m 20s</div>
              <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">-14s faster</div>
            </div>
            <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
              <div className="text-[10px] font-bold text-gray-400 uppercase">Peak Hourly Intake</div>
              <div className="text-xl sm:text-2xl font-black text-amber-600">54 orders/hr</div>
              <div className="text-[10px] text-gray-500 font-semibold mt-0.5">Evening rush (19:00)</div>
            </div>
            <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
              <div className="text-[10px] font-bold text-gray-400 uppercase">Avg Pick Latency</div>
              <div className="text-xl sm:text-2xl font-black text-gray-900">155s</div>
              <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">Benchmark: &lt;180s</div>
            </div>
          </div>

          {/* Mock Funnel Preview */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-extrabold text-gray-800">5-Stage Fulfillment Funnel Telemetry</span>
              <span className="text-[11px] font-bold text-emerald-700">Target: &lt;600s (10m)</span>
            </div>
            <div className="grid grid-cols-5 gap-2 text-center text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-gray-200 shadow-2xs">
                <div className="text-[9px] font-bold text-gray-400 uppercase">1. Assign</div>
                <div className="font-black text-gray-900">22s</div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-gray-200 shadow-2xs">
                <div className="text-[9px] font-bold text-blue-600 uppercase">2. Pick</div>
                <div className="font-black text-blue-900">155s</div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-gray-200 shadow-2xs">
                <div className="text-[9px] font-bold text-amber-600 uppercase">3. Pack</div>
                <div className="font-black text-amber-900">42s</div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-gray-200 shadow-2xs">
                <div className="text-[9px] font-bold text-purple-600 uppercase">4. Handover</div>
                <div className="font-black text-purple-900">38s</div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-gray-200 shadow-2xs">
                <div className="text-[9px] font-bold text-emerald-600 uppercase">5. Ride</div>
                <div className="font-black text-emerald-900">183s</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
