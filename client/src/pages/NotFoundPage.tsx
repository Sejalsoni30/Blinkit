import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { Home, LayoutDashboard, ArrowLeft, AlertCircle } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-gray-200 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-yellow-100 text-yellow-800 flex items-center justify-center font-black text-2xl mx-auto">
          404
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-xs text-gray-500 leading-relaxed">
            The requested operations route does not exist or has been relocated in the fulfillment pipeline.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Public Home</span>
          </Link>

          <Link
            to={user ? '/dashboard' : '/login'}
            className="w-full sm:w-auto px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-gray-950 font-black text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>{user ? 'Go to Dashboard' : 'Sign In'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
