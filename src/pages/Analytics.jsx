import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Search,
  Activity,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Layers,
  Calendar,
  Compass
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from 'recharts';
import { getComprehensiveAnalytics } from '../services/analyticsService.js';
import { getStoredMedia } from '../services/storageService.js';

export default function Analytics() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadAnalytics();
    window.addEventListener('mediamine:data-updated', loadAnalytics);
    return () => window.removeEventListener('mediamine:data-updated', loadAnalytics);
  }, []);

  const loadAnalytics = () => {
    setStats(getComprehensiveAnalytics());
  };

  if (!stats) return null;

  const COLORS = ['#6366F1', '#EC4899', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#3B82F6'];

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-950/40 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-7 h-7 text-indigo-400" />
            <span>Search & Platform Analytics</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry and query intelligence derived from in-browser search event streams.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-medium">Local Analytics Engine Active</span>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-card space-y-1">
          <span className="text-xs font-semibold uppercase text-slate-400">Total Search Queries</span>
          <p className="text-3xl font-extrabold text-white font-mono">{stats.totalSearches}</p>
          <p className="text-[11px] text-cyan-400 mt-1">Recorded in browser session</p>
        </div>

        <div className="p-5 rounded-2xl glass-card space-y-1">
          <span className="text-xs font-semibold uppercase text-slate-400">Successful Resolutions</span>
          <p className="text-3xl font-extrabold text-emerald-400 font-mono">{stats.successfulSearches}</p>
          <p className="text-[11px] text-emerald-300 mt-1">{stats.successRate}% Success Rate</p>
        </div>

        <div className="p-5 rounded-2xl glass-card space-y-1">
          <span className="text-xs font-semibold uppercase text-slate-400">Zero-Result Queries</span>
          <p className="text-3xl font-extrabold text-amber-400 font-mono">{stats.zeroResultSearches}</p>
          <p className="text-[11px] text-slate-400 mt-1">Fallback to spelling suggestion</p>
        </div>

        <div className="p-5 rounded-2xl glass-card space-y-1">
          <span className="text-xs font-semibold uppercase text-slate-400">Avg Results Per Search</span>
          <p className="text-3xl font-extrabold text-indigo-400 font-mono">{stats.avgResultsPerSearch}</p>
          <p className="text-[11px] text-slate-400 mt-1">High document recall</p>
        </div>
      </div>

      {/* Charts Row 1: Search Activity & Media Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Search Timeline Chart */}
        <div className="p-5 rounded-2xl glass-panel space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Search Operations Over Time</span>
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="time" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B132B', borderColor: '#4338CA', borderRadius: '0.75rem', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="searches" stroke="#6366F1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-400">Hourly breakdown of algorithmic search executions.</p>
        </div>

        {/* Media Distribution Pie */}
        <div className="p-5 rounded-2xl glass-panel space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-pink-400" />
            <span>Media Type Distribution</span>
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.mediaTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  innerRadius={45}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {stats.mediaTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B132B', borderColor: '#4338CA', borderRadius: '0.75rem', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-400">Calculated directly from the {stats.totalMediaRecords} local records.</p>
        </div>
      </div>

      {/* Row 2: Popular Queries & Spelling Corrections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Frequent Queries */}
        <div className="p-5 rounded-2xl glass-panel space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Search className="w-4 h-4 text-indigo-400" />
            <span>Popular Search Queries</span>
          </h3>
          <div className="space-y-2">
            {stats.popularQueries.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-navy-900/50 border border-slate-800 text-xs">
                <span className="font-mono text-slate-200">"{item.query}"</span>
                <span className="font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {item.count} search{item.count > 1 ? 'es' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Spelling Corrections Detected */}
        <div className="p-5 rounded-2xl glass-panel space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Damerau-Levenshtein Corrections</span>
          </h3>
          <div className="space-y-2">
            {stats.commonSpellingCorrections.length > 0 ? (
              stats.commonSpellingCorrections.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-navy-900/50 border border-slate-800 text-xs">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-red-400 line-through">"{item.from}"</span>
                    <span className="text-slate-400">→</span>
                    <span className="text-emerald-400 font-bold">"{item.to}"</span>
                  </div>
                  <span className="font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    {item.count} triggered
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400">No spelling corrections recorded yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
