import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does the 10-minute SLA fulfillment tracking work?',
      a: 'The analyzer splits every quick-commerce order into five measurable milestones: 1) Order Assignment, 2) Item Picking, 3) QC & Bagging, 4) Rider Handover, and 5) Last-Mile Transit. By calculating average and P90 latencies for each stage against predefined benchmarks, the system flags the exact bottleneck responsible for delays.',
    },
    {
      q: 'How does the Delay Prediction AI model calculate breach risk?',
      a: 'Our supervised machine learning model (trained on historical fulfillment data) evaluates basket size, hour of placement, warehouse concurrency load index, aisle spread count, picker experience tier, and weather conditions to output an exact breach probability (0% to 100%) and pinpoint the dominant contributing risk factors.',
    },
    {
      q: 'Can we import real dark store telemetry from our own warehouses?',
      a: 'Yes! The Order Explorer includes a built-in CSV ingestion engine and downloadable template. You can upload thousands of real historical or ongoing dark store order records to audit stage performance without modifying your production warehouse management system.',
    },
    {
      q: 'What is the What-If Capacity Simulator?',
      a: 'The What-If Simulator uses queuing theory to calculate projected changes to your SLA compliance % before you make staffing adjustments. Store managers can simulate adding pickers, boosting pick speeds, streamlining rider handovers, or handling sudden 30% order volume surges.',
    },
    {
      q: 'Are Store Managers restricted to viewing their own dark store?',
      a: 'Yes. The system enforces strict Role-Based Access Control (RBAC) at the middleware layer. When a Store Manager logs in, queries are automatically filtered to their assigned dark store (e.g. BLR-KOR-01 or DEL-IND-02). Only City Ops Heads (Admins) can view the national comparison leaderboard.',
    },
    {
      q: 'Is an external database required to run the application demo?',
      a: 'No! The application features an intelligent in-memory MongoDB fallback. If no external MongoDB URI is provided, it boots an in-memory database and auto-seeds all 5 stores, 300 products, pickers, riders, and 10,000 orders automatically on startup.',
    },
  ];

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-3">
          <span className="text-xs font-black uppercase tracking-wider text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Common Inquiries
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-gray-600">
            Everything you need to know about dark store SLA tracking, data simulation, and predictive analytics.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={faq.q}
                className="border border-gray-200 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-extrabold text-gray-900">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-gray-900' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 pt-2 text-xs text-gray-600 leading-relaxed border-t border-gray-100 bg-white">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
