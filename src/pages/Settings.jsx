import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Moon,
  Sun,
  Database,
  Trash2,
  CheckCircle2,
  Lock,
  Layers,
  Cpu
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { indexingService } from '../services/indexingService.js';
import { getStoredMedia } from '../services/storageService.js';

export default function Settings() {
  const { user, role, isAdmin, changeRole } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();

  const [savedMsg, setSavedMsg] = useState('');
  const mediaCount = getStoredMedia().length;
  const indexStats = indexingService.getIndexStats();

  const handleClearCache = () => {
    if (window.confirm('Clear all search history and local temporary caches?')) {
      localStorage.removeItem('mediamine_search_history');
      localStorage.removeItem('mediamine_search_analytics');
      setSavedMsg('Temporary search history and analytics cache cleared.');
      setTimeout(() => setSavedMsg(''), 3000);
    }
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Title */}
      <div className="border-b border-indigo-950/40 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <SettingsIcon className="w-7 h-7 text-indigo-400" />
          <span>Platform Preferences & Settings</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure local session preferences, algorithmic parameters, and theme appearance.
        </p>
      </div>

      {savedMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{savedMsg}</span>
        </div>
      )}

      {/* Account Profile Card */}
      <div className="p-6 rounded-3xl glass-panel space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-400" />
          <span>Current Active User Profile</span>
        </h3>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/40"
          />
          <div className="space-y-1">
            <h4 className="text-base font-bold text-white">{user?.name}</h4>
            <p className="text-xs text-slate-400">{user?.email}</p>
            <div className="flex items-center gap-2 pt-1">
              <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                isAdmin ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
              }`}>
                {role} Role Active
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                ID: {user?.id}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Role Switching Control Card */}
      <div className="p-6 rounded-3xl glass-panel space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Simulated Role Interface Switcher</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Toggle between User and Admin perspectives to preview capabilities without reloading.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => changeRole('USER')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              role === 'USER'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-navy-900 text-slate-400 hover:text-white border border-indigo-950/40'
            }`}
          >
            User Mode
          </button>
          <button
            onClick={() => changeRole('ADMIN')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              role === 'ADMIN'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30'
                : 'bg-navy-900 text-slate-400 hover:text-white border border-indigo-950/40'
            }`}
          >
            Admin Mode
          </button>
        </div>

        <p className="text-[11px] text-slate-400 italic">
          * Note: Client-side role switching is provided for demo testing. In production systems, authorization must be validated by a cryptographically secure backend.
        </p>
      </div>

      {/* Theme Setting */}
      <div className="p-6 rounded-3xl glass-panel space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Visual Theme Appearance</span>
        </h3>

        <div className="flex items-center justify-between pt-1">
          <div>
            <p className="text-xs font-medium text-slate-200">Selected Theme: <span className="capitalize font-bold text-indigo-400">{theme}</span></p>
            <p className="text-[11px] text-slate-400">Deep Navy & Indigo by default, with optional high-contrast Light mode.</p>
          </div>

          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-900 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            <span>Switch to {isDark ? 'Light' : 'Dark'} Mode</span>
          </button>
        </div>
      </div>

      {/* Local Storage & Cache Telemetry */}
      <div className="p-6 rounded-3xl glass-panel space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-400" />
          <span>Storage & Index Telemetry</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-navy-900/60 border border-indigo-950/40">
            <span className="text-[10px] text-slate-400">Stored Records:</span>
            <p className="text-lg font-bold text-white font-mono">{mediaCount}</p>
          </div>
          <div className="p-3 rounded-xl bg-navy-900/60 border border-indigo-950/40">
            <span className="text-[10px] text-slate-400">Vocabulary Size:</span>
            <p className="text-lg font-bold text-cyan-400 font-mono">{indexStats.uniqueTokens} tokens</p>
          </div>
          <div className="p-3 rounded-xl bg-navy-900/60 border border-indigo-950/40">
            <span className="text-[10px] text-slate-400">Storage Backend:</span>
            <p className="text-xs font-bold text-emerald-400 font-mono mt-1">Browser localStorage</p>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={handleClearCache}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Search History & Cache</span>
          </button>
        </div>
      </div>
    </div>
  );
}
