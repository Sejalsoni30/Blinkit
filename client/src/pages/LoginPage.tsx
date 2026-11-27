import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { useNavigate } from 'react-router-dom';
import { UserCheck, Shield, Lock, Mail, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, switchUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handlePersonaClick = async (role: any, storeId?: string) => {
    try {
      setLoading(true);
      setError(null);
      await switchUser(role, storeId);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-200 p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-yellow-400 flex items-center justify-center font-black text-2xl text-gray-950 mx-auto shadow-inner">
            b
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            blink<span className="text-blinkit-green">it</span> Dark Store Analyzer
          </h2>
          <p className="text-xs text-gray-500">
            Sign in to access 10-minute SLA fulfillment analytics and store telemetry
          </p>
        </div>

        {/* 1-Click Quick Demo Personas */}
        <div className="space-y-2 pt-2">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 text-center">
            One-Click Demo Personas
          </div>
          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => handlePersonaClick('ADMIN')}
              className="p-3 rounded-xl border border-yellow-300 bg-yellow-50/70 hover:bg-yellow-100/90 text-left transition-colors flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-yellow-950">City Ops Head (Admin)</div>
                <div className="text-[10px] text-yellow-800">admin@blinkit.com • All stores, comparisons</div>
              </div>
              <ArrowRight className="w-4 h-4 text-yellow-800" />
            </button>

            <button
              type="button"
              onClick={() => handlePersonaClick('MANAGER', 'BLR-KOR-01')}
              className="p-3 rounded-xl border border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-gray-100 text-left transition-colors flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-gray-900">Store Manager (BLR Hub)</div>
                <div className="text-[10px] text-gray-500">manager.blr@blinkit.com • Store-scoped view</div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </button>

            <button
              type="button"
              onClick={() => handlePersonaClick('ANALYST')}
              className="p-3 rounded-xl border border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-gray-100 text-left transition-colors flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-gray-900">Operations Analyst</div>
                <div className="text-[10px] text-gray-500">analyst@blinkit.com • Read-only telemetry</div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="grow border-t border-gray-200"></div>
          <span className="shrink mx-4 text-gray-400 text-[10px] font-bold uppercase">or manual login</span>
          <div className="grow border-t border-gray-200"></div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold">
            {error}
          </div>
        )}

        {/* Manual Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@blinkit.com"
                className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-hidden focus:border-yellow-400"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-hidden focus:border-yellow-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-yellow-400 hover:bg-yellow-500 text-gray-950 font-black text-xs rounded-xl shadow-xs transition-colors"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};
