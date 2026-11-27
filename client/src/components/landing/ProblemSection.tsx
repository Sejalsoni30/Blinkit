import React from 'react';
import { motion } from 'framer-motion';
import { Navigation, Hourglass, Repeat, Bike } from 'lucide-react';

export const ProblemSection: React.FC = () => {
  const problems = [
    {
      title: 'Aisle Dispersion & Slow Picking',
      description:
        'When an order has items in Aisle 1, 4, and 7, pickers walk excessive warehouse meters. Junior pickers spend 40% longer locating non-standard SKUs.',
      icon: Navigation,
      penalty: '+150s to +300s',
      badge: '34% of Breaches',
    },
    {
      title: 'QC & Packing Bench Queues',
      description:
        'During evening prime hours (6:00 PM – 10:00 PM), packing tables congest with carts waiting for barcode scanning, bagging, and tamper-proof sealing.',
      icon: Hourglass,
      penalty: '+140s to +260s',
      badge: '22% of Breaches',
    },
    {
      title: 'Stockout Substitution Delays',
      description:
        'When a rack runs out of high-demand staples (e.g. fresh milk or curd), finding substitutes and obtaining customer approval stalls the cart.',
      icon: Repeat,
      penalty: '+120s to +240s',
      badge: '14% of Breaches',
    },
    {
      title: 'Staging Bay & Rider Handover Wait',
      description:
        'Packed bags sit waiting in disorganized staging bays while delivery riders search for their assigned bags or wait for order OTP verification.',
      icon: Bike,
      penalty: '+160s to +300s',
      badge: '20% of Breaches',
    },
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-black uppercase tracking-wider text-red-600 bg-red-100 px-3 py-1 rounded-full border border-red-200">
            The Fulfillment Dilemma
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Where does the 10-minute promise break?
          </h2>
          <p className="text-sm text-gray-600">
            Fulfillment latency doesn't happen by accident. In 10-minute quick commerce, seconds compound inside specific operational stages:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((prob, idx) => {
            const Icon = prob.icon;
            return (
              <motion.div
                key={prob.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-red-50 text-red-600 rounded-2xl border border-red-100">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                      {prob.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-gray-900 mb-2">{prob.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-4">{prob.description}</p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-400 font-semibold">Latency Penalty:</span>
                  <span className="font-extrabold text-red-600">{prob.penalty}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
