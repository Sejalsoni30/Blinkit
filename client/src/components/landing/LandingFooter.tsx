import React from 'react';
import { Link } from 'react-router-dom';
import { Github, ExternalLink } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-gray-950 text-gray-400 py-12 border-t border-gray-900 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blinkit-yellow flex items-center justify-center font-black text-lg text-gray-950">
              b
            </div>
            <div>
              <span className="font-extrabold text-base text-white tracking-tight">
                blink<span className="text-blinkit-green">it</span>
              </span>
              <span className="text-[10px] text-gray-400 ml-2 font-medium">Dark Store Ops Analyzer</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-gray-300 font-semibold">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#preview" className="hover:text-white transition-colors">Live Preview</a>
            <a href="#roles" className="hover:text-white transition-colors">Roles</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <a
              href="https://github.com/Sejalsoni30/Blinkit.git"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-gray-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} Blinkit Dark Store Fulfillment Analyzer. Built for 10-minute SLA quick-commerce.
          </div>
          <div>
            Open-source MIT License • High-Throughput Telemetry Architecture
          </div>
        </div>
      </div>
    </footer>
  );
};
