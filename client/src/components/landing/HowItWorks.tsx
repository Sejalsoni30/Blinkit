import React from 'react';
import { motion } from 'framer-motion';
import { Database, SearchCheck, AlertOctagon, Sparkles } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Collect Milestones',
      description:
        'Barcode scans, RFID cart readers, and app events capture exact timestamps across assign, pick, pack, handover, and transit.',
      icon: Database,
    },
    {
      num: '02',
      title: 'Analyze Telemetry',
      description:
        'High-performance MongoDB aggregation pipelines calculate average and P90 latencies, filtering out noise and indexing by store.',
      icon: SearchCheck,
    },
    {
      num: '03',
      title: 'Detect Bottlenecks',
      description:
        'Automated diagnostics isolate why SLA breached: aisle walking distance, bagging queues, or delivery rider wait times.',
      icon: AlertOctagon,
    },
    {
      num: '04',
      title: 'Act on Prescriptions',
      description:
        'Plain-English smart recommendations and What-If simulations empower ops managers to dynamically re-roster staff and re-zone aisles.',
      icon: Sparkles,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-black uppercase tracking-wider text-yellow-900 bg-yellow-100 px-3 py-1 rounded-full border border-yellow-300">
            Fulfillment Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            How Telemetry Turns into SLA Recovery
          </h2>
          <p className="text-sm text-gray-600">
            From raw warehouse barcode scans to actionable staffing decisions in four streamlined steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative bg-white border border-gray-200 rounded-3xl p-6 shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="text-3xl font-black text-gray-200 mb-4">{step.num}</div>
                <div className="w-10 h-10 rounded-xl bg-yellow-100 text-yellow-800 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{step.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
