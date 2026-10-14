import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  GitCompare,
  Cpu,
  BarChart3,
  Bookmark,
  History,
  Settings,
  Shield,
  FilePlus,
  Database,
  Layers,
  RotateCcw,
  Sparkles,
  ExternalLink,
  SlidersHorizontal,
  Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { resetStoredMediaToDefault } from '../../services/storageService.js';

export default function Sidebar({ isCollapsed, onToggleCollapse, isMobileOpen, onCloseMobile }) {
  const { role, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleResetData = () => {
    if (window.confirm('Reset local media collection to the default 52+ sample records? Any newly added records will be replaced.')) {
      resetStoredMediaToDefault();
      alert('Demo media library reset successfully!');
      navigate(isAdmin ? '/admin' : '/dashboard');
    }
  };

  const userNavLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Intelligent Search', path: '/search', icon: Search, badge: 'KMP/AC' },
    { name: 'Similarity Analyzer', path: '/similarity', icon: GitCompare, badge: 'Suffix' },
    { name: 'Algorithm Lab', path: '/algorithm-lab', icon: Cpu, badge: '6 M' },
    { name: 'Search Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Bookmarks', path: '/bookmarks', icon: Bookmark },
    { name: 'Search History', path: '/history', icon: History },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const adminNavLinks = [
    { name: 'Admin Hub', path: '/admin', icon: Shield },
    { name: 'Media Library', path: '/admin/media', icon: Layers },
    { name: 'Add Media Record', path: '/admin/add', icon: FilePlus },
    { name: 'Data Management', path: '/admin/data-management', icon: Database },
    { name: 'Search Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Algorithm Lab', path: '/admin/algorithms', icon: Cpu },
  ];

  const currentLinks = isAdmin ? adminNavLinks : userNavLinks;

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 border-r border-indigo-950/40 dark:border-indigo-950/60 bg-navy-950/95 dark:bg-navy-950/95 backdrop-blur-xl flex flex-col transition-all duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {/* Role Indicator Banner */}
        <div className="px-4 py-3 border-b border-indigo-950/40 dark:border-indigo-950/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-amber-400' : 'bg-cyan-400'} animate-ping`} />
              {!isCollapsed && (
                <span className="text-xs font-semibold tracking-wider uppercase text-slate-300">
                  {isAdmin ? 'Admin Control' : 'User Platform'}
                </span>
              )}
            </div>
            {!isCollapsed && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Local DSA
              </span>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
          {!isCollapsed && (
            <p className="px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">
              {isAdmin ? 'Management Modules' : 'Core Analytics'}
            </p>
          )}

          {currentLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path || (link.path !== '/admin' && link.path !== '/dashboard' && location.pathname.startsWith(link.path));

            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={onCloseMobile}
                className={({ isActive: exactActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                    exactActive || isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 dark:hover:bg-navy-900/60'
                  }`
                }
              >
                <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'}`} />
                {!isCollapsed && (
                  <span className="flex-1 truncate">{link.name}</span>
                )}
                {!isCollapsed && link.badge && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800/80 text-cyan-300 border border-cyan-500/30">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Section: Reset Dataset & Demo Label */}
        <div className="p-3 border-t border-indigo-950/40 dark:border-indigo-950/60 space-y-2">
          {!isCollapsed ? (
            <div className="p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-900/40 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Dataset Status</span>
                <span className="text-cyan-400 font-mono text-[11px]">52+ Records</span>
              </div>
              <button
                onClick={handleResetData}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-colors border border-slate-700"
              >
                <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
                <span>Reset Demo Dataset</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleResetData}
              title="Reset Demo Dataset"
              className="w-full flex items-center justify-center p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300"
            >
              <RotateCcw className="w-4 h-4 text-indigo-400" />
            </button>
          )}

          {!isCollapsed && (
            <div className="text-center">
              <span className="text-[10px] text-slate-400">
                100% In-Browser Execution
              </span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
