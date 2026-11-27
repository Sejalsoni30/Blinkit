import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import { ArrowRight, Zap, ShieldCheck } from 'lucide-react';

export const CtaBanner: React.FC = () => {
  const { user } = useAuth();

  return (
    <section className="py-20 bg-gradient-to-r from-yellow-400 via-yellow-400 to-amber-400 text-gray-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="w-12 h-12 rounded-2xl bg-gray-950 text-yellow-400 flex items-center justify-center font-black text-2xl mx-auto shadow-md">
          b
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-gray-950">
          Ready to eliminate dark store fulfillment bottlenecks?
        </h2>

        <p className="text-sm sm:text-base font-semibold text-gray-900/80 max-w-2xl mx-auto leading-relaxed">
          Join store managers and city operations heads using real-time telemetry to protect the 10-minute promise.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to={user ? '/dashboard' : '/login'}
            className="w-full sm:w-auto px-8 py-3.5 bg-gray-950 hover:bg-black text-white font-black text-sm rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 group"
          >
            <span>{user ? 'Open Operations Console' : 'Start Analyzing Now'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <a
            href="https://github.com/Sejalsoni30/Blinkit.git"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 bg-white/70 hover:bg-white text-gray-900 font-extrabold text-sm rounded-2xl shadow-xs transition-all"
          >
            View on GitHub
          </a>
        </div>
      </div>
    </section>
  );
};
