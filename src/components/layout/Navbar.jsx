import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  Sun,
  Moon,
  Shield,
  User,
  Bell,
  Menu,
  X,
  Sparkles,
  LogOut,
  Settings as SettingsIcon,
  Layers,
  ChevronDown,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

export default function Navbar({ onToggleSidebar, isSidebarCollapsed }) {
  const { user, role, isAdmin, changeRole, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Global search shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const input = document.getElementById('global-search-input');
        if (input) input.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-indigo-950/40 dark:border-indigo-950/60 bg-navy-950/80 dark:bg-navy-950/90 backdrop-blur-md px-4 lg:px-6 h-16 flex items-center justify-between transition-colors">
      {/* Left: Mobile hamburger & Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle Navigation Sidebar"
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div
          onClick={() => navigate(isAdmin ? '/admin' : '/dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent dark:from-white dark:to-indigo-200">
                MediaMine
              </span>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                DSA Core
              </span>
            </div>
            <p className="text-[10px] text-slate-400 -mt-1 hidden md:block">Intelligent Analytics</p>
          </div>
        </div>
      </div>

      {/* Center: Global Search Input */}
      <div className="hidden md:flex flex-1 max-w-md mx-6">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles, videos, transcripts, courses... (Ctrl+K)"
            className="w-full bg-slate-900/80 dark:bg-navy-900/90 text-sm text-slate-200 placeholder-slate-400 pl-10 pr-16 py-2 rounded-xl border border-slate-700/60 dark:border-indigo-900/40 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-inner"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="hidden lg:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              ⌘K
            </kbd>
          </div>
        </form>
      </div>

      {/* Right controls: Role switcher, Theme toggle, Notifications, User Menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Role Switcher Segmented Control */}
        <div className="flex items-center bg-slate-900/90 dark:bg-navy-900/90 border border-indigo-900/50 rounded-xl p-0.5 shadow-sm">
          <button
            onClick={() => changeRole('USER')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              role === 'USER'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">User</span>
          </button>
          <button
            onClick={() => changeRole('ADMIN')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              role === 'ADMIN'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm shadow-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Admin</span>
          </button>
        </div>

        {/* Animated Day/Night Theme Switch */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Color Theme"
          className="relative p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900/70 dark:bg-navy-900/80 border border-slate-800 dark:border-indigo-900/40 hover:border-indigo-500/40 transition-all group overflow-hidden"
        >
          {isDark ? (
            <Moon className="w-4 h-4 text-indigo-400 group-hover:rotate-12 transition-transform" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500 group-hover:rotate-45 transition-transform" />
          )}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900/70 dark:bg-navy-900/80 border border-slate-800 dark:border-indigo-900/40 hover:border-indigo-500/40 transition-colors relative"
          >
            <Bell className="w-4 h-4 text-slate-400" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl glass-panel p-4 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 border border-indigo-500/20">
              <div className="flex items-center justify-between pb-2 border-b border-indigo-950/40">
                <span className="font-semibold text-xs tracking-wide uppercase text-slate-300">Live Notifications</span>
                <span className="text-[10px] text-cyan-400 font-mono">3 updates</span>
              </div>
              <div className="mt-3 space-y-2.5 text-xs">
                <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-200">Index Synced</p>
                    <p className="text-slate-400 text-[11px]">52 records indexed in browser memory via Inverted Postings.</p>
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-200">Aho-Corasick Ready</p>
                    <p className="text-slate-400 text-[11px]">Multi-pattern string dictionary initialized with failure links.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 pl-2 rounded-xl bg-slate-900/70 dark:bg-navy-900/80 border border-slate-800 dark:border-indigo-900/40 hover:border-indigo-500/40 transition-all"
          >
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
              alt={user?.name || "User"}
              className="w-7 h-7 rounded-lg object-cover ring-1 ring-indigo-500/30"
            />
            <span className="hidden md:inline text-xs font-medium text-slate-200 max-w-[100px] truncate">
              {user?.name?.split(' ')[0] || "User"}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 border border-indigo-500/20">
              <div className="px-3 py-2 border-b border-indigo-950/40">
                <p className="font-semibold text-xs text-slate-200 truncate">{user?.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    isAdmin ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  }`}>
                    {role} Role
                  </span>
                </div>
              </div>

              <div className="py-1 text-xs">
                <button
                  onClick={() => { setShowProfileMenu(false); navigate('/settings'); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-indigo-600/20 transition-colors"
                >
                  <SettingsIcon className="w-4 h-4 text-slate-400" />
                  <span>Preferences & Settings</span>
                </button>
                <button
                  onClick={() => { setShowProfileMenu(false); navigate('/bookmarks'); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-indigo-600/20 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-slate-400" />
                  <span>Saved Bookmarks</span>
                </button>
              </div>

              <div className="pt-1 border-t border-indigo-950/40 text-xs">
                <button
                  onClick={() => { setShowProfileMenu(false); logout(); navigate('/signin'); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
