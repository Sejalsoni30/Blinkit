import React from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { useStore } from '../../context/StoreContext.js';
import { useSocket } from '../../context/SocketContext.js';
import { Bell, MapPin, Calendar, UserCheck, LogOut, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { user, logout, switchUser } = useAuth();
  const { stores, selectedStoreId, setSelectedStoreId, datePreset, setDatePreset } = useStore();
  const { unreadAlertCount } = useSocket();

  const isManager = user?.role === 'MANAGER';

  return (
    <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-40 px-6 flex items-center justify-between shadow-xs">
      {/* Brand & Store Selector */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blinkit-yellow flex items-center justify-center font-black text-xl text-blinkit-black shadow-inner">
            b
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-gray-900">blink<span className="text-blinkit-green">it</span></span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full border border-yellow-300">
                Dark Store Ops
              </span>
            </div>
            <p className="text-[11px] text-gray-500 font-medium">10-Minute SLA Fulfillment Analyzer</p>
          </div>
        </div>

        {/* Store Selector */}
        <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700">
          <MapPin className="w-3.5 h-3.5 text-blinkit-green" />
          <span className="font-medium text-gray-500">Store:</span>
          {isManager ? (
            <span className="font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">
              {stores.find((s) => s.storeId === user.storeId)?.name || user.storeId}
            </span>
          ) : (
            <select
              aria-label="Filter by Dark Store"
              value={selectedStoreId}
              onChange={(e) => setSelectedStoreId(e.target.value)}
              className="bg-transparent font-semibold text-gray-900 focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Stores (National Fleet)</option>
              {stores.map((s) => (
                <option key={s.storeId} value={s.storeId}>
                  {s.name} ({s.city})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Date Filter */}
        <div className="hidden lg:flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg p-1 text-xs">
          <Calendar className="w-3.5 h-3.5 ml-2 text-gray-400" />
          {(['TODAY', '7D', '30D'] as const).map((preset) => (
            <button
              key={preset}
              onClick={() => setDatePreset(preset)}
              className={`px-2.5 py-1 rounded font-semibold transition-all ${
                datePreset === preset
                  ? 'bg-white text-gray-900 shadow-xs border border-gray-200'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {preset === 'TODAY' ? 'Today' : preset === '7D' ? 'Last 7 Days' : 'Last 30 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Right Controls: Persona Switcher & Live Alert Badge */}
      <div className="flex items-center gap-4">
        {/* Live Socket Status */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-700 font-medium bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Live Ops Feed</span>
        </div>

        {/* Alerts Bell */}
        <Link
          to="/alerts"
          className="relative p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          title="Active Live Alerts"
        >
          <Bell className="w-5 h-5" />
          {unreadAlertCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
              {unreadAlertCount}
            </span>
          )}
        </Link>

        {/* Quick Demo Persona Switcher */}
        <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-gray-900">{user?.name}</div>
            <div className="text-[10px] text-gray-500 font-medium">
              Role: <span className="font-bold text-blinkit-green">{user?.role}</span>
            </div>
          </div>

          <div className="relative group">
            <button 
              className="flex items-center gap-1.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-900 border border-yellow-300 text-xs font-bold px-2.5 py-1.5 rounded-lg transition-colors"
              title="Switch Demo Persona"
            >
              <UserCheck className="w-3.5 h-3.5 text-yellow-700" />
              <span>Switch Role</span>
            </button>

            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl p-2 hidden group-hover:block z-50">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1">
                Demo Switcher
              </div>
              <button
                onClick={() => switchUser('ADMIN')}
                className={`w-full text-left px-2.5 py-2 text-xs rounded-lg flex items-center justify-between ${
                  user?.role === 'ADMIN' ? 'bg-yellow-50 text-yellow-900 font-bold' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div>
                  <div className="font-bold">City Ops Head (Admin)</div>
                  <div className="text-[10px] text-gray-500">All stores, leaderboard, rules</div>
                </div>
                {user?.role === 'ADMIN' && <CheckCircle2 className="w-4 h-4 text-blinkit-green" />}
              </button>

              <button
                onClick={() => switchUser('MANAGER', 'BLR-KOR-01')}
                className={`w-full text-left px-2.5 py-2 text-xs rounded-lg flex items-center justify-between ${
                  user?.role === 'MANAGER' && user.storeId === 'BLR-KOR-01'
                    ? 'bg-yellow-50 text-yellow-900 font-bold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div>
                  <div className="font-bold">Store Manager (BLR Hub)</div>
                  <div className="text-[10px] text-gray-500">Scoped to Koramangala store</div>
                </div>
                {user?.role === 'MANAGER' && user.storeId === 'BLR-KOR-01' && (
                  <CheckCircle2 className="w-4 h-4 text-blinkit-green" />
                )}
              </button>

              <button
                onClick={() => switchUser('ANALYST')}
                className={`w-full text-left px-2.5 py-2 text-xs rounded-lg flex items-center justify-between ${
                  user?.role === 'ANALYST' ? 'bg-yellow-50 text-yellow-900 font-bold' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div>
                  <div className="font-bold">Operations Analyst</div>
                  <div className="text-[10px] text-gray-500">Read-only analytics & reports</div>
                </div>
                {user?.role === 'ANALYST' && <CheckCircle2 className="w-4 h-4 text-blinkit-green" />}
              </button>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
