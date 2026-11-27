import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import {
  LayoutDashboard,
  GitCommit,
  PackageSearch,
  AlertTriangle,
  Grid,
  Users,
  Clock,
  Boxes,
  Zap,
  Lightbulb,
  Bell,
  Trophy,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const isAdminOrAnalyst = user?.role === 'ADMIN' || user?.role === 'ANALYST';

  const navItems = [
    { name: 'Executive Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Fulfillment Funnel', path: '/funnel', icon: GitCommit },
    { name: 'Order Explorer', path: '/orders', icon: PackageSearch },
    { name: 'Root-Cause Analysis', path: '/root-causes', icon: AlertTriangle },
    { name: 'SKU & Aisle Heatmap', path: '/sku-aisle', icon: Grid },
    { name: 'Picker Performance', path: '/pickers', icon: Users },
    { name: 'Demand & Staffing', path: '/staffing', icon: Clock },
    { name: 'Inventory & Stockouts', path: '/inventory', icon: Boxes },
    { name: 'Delay AI & What-If', path: '/predict', icon: Zap },
    { name: 'Smart Insights', path: '/insights', icon: Lightbulb },
    { name: 'Live Alerts Center', path: '/alerts', icon: Bell },
  ];

  if (isAdminOrAnalyst) {
    navItems.push({ name: 'Store Leaderboard', path: '/comparison', icon: Trophy });
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 shrink-0 shadow-xs">
      <div className="space-y-6">
        <div>
          <div className="text-[11px] font-bold tracking-wider uppercase text-gray-400 px-3 mb-2">
            Operations Pipeline
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-yellow-400 text-gray-950 font-bold shadow-xs'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* SLA Target Banner in Sidebar footer */}
      <div className="p-3 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-extrabold text-emerald-900">Blinkit 10m SLA</span>
        </div>
        <p className="text-[11px] text-emerald-800 leading-tight">
          Target: &gt;90% delivered under 600 seconds.
        </p>
      </div>
    </aside>
  );
};
