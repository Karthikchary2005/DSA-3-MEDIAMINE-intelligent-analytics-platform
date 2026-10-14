import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Layers,
  FileText,
  Video,
  FileCode,
  GraduationCap,
  Newspaper,
  BookOpen,
  Database,
  FilePlus,
  BarChart3,
  Cpu,
  RotateCcw,
  Download,
  Upload,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { getStoredMedia, resetStoredMediaToDefault } from '../services/storageService.js';
import { indexingService } from '../services/indexingService.js';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [mediaList, setMediaList] = useState([]);

  useEffect(() => {
    loadMedia();
    window.addEventListener('mediamine:data-updated', loadMedia);
    return () => window.removeEventListener('mediamine:data-updated', loadMedia);
  }, []);

  const loadMedia = () => {
    setMediaList(getStoredMedia());
  };

  const countByType = (type) => mediaList.filter(m => m.type === type).length;
  const indexStats = indexingService.getIndexStats();

  const handleReset = () => {
    if (window.confirm('Reset all media records to the initial 52+ sample dataset? All admin changes will be refreshed.')) {
      resetStoredMediaToDefault();
      loadMedia();
      alert('Demo dataset reset to initial factory configuration.');
    }
  };

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-950/40 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs uppercase font-semibold text-amber-400 tracking-wider">
              Admin Control Center
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">System & Media Administration</h1>
          <p className="text-xs text-slate-400 mt-1">
            Full lifecycle control over the local media corpus, inverted indexing, and algorithmic pipelines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/admin/add')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/30"
          >
            <FilePlus className="w-4 h-4" />
            <span>Add New Media</span>
          </button>
          <button
            onClick={() => navigate('/admin/data-management')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold transition-all"
          >
            <Database className="w-4 h-4 text-cyan-400" />
            <span>Import / Export</span>
          </button>
        </div>
      </div>

      {/* KPI Cards (All 8 from Specification) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* Total Records */}
        <div className="p-3.5 rounded-2xl glass-card space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Records</span>
          <p className="text-2xl font-extrabold text-white font-mono">{mediaList.length}</p>
          <span className="text-[9px] text-emerald-400 font-mono">100% Synced</span>
        </div>

        {/* Articles */}
        <div className="p-3.5 rounded-2xl glass-card space-y-1">
          <span className="text-[10px] font-bold uppercase text-indigo-400">Articles</span>
          <p className="text-2xl font-extrabold text-indigo-400 font-mono">{countByType('article')}</p>
          <span className="text-[9px] text-slate-400">Full Text</span>
        </div>

        {/* Videos */}
        <div className="p-3.5 rounded-2xl glass-card space-y-1">
          <span className="text-[10px] font-bold uppercase text-pink-400">Videos</span>
          <p className="text-2xl font-extrabold text-pink-400 font-mono">{countByType('video')}</p>
          <span className="text-[9px] text-slate-400">With Timestamps</span>
        </div>

        {/* Transcripts */}
        <div className="p-3.5 rounded-2xl glass-card space-y-1">
          <span className="text-[10px] font-bold uppercase text-purple-400">Transcripts</span>
          <p className="text-2xl font-extrabold text-purple-400 font-mono">{countByType('transcript')}</p>
          <span className="text-[9px] text-slate-400">Verbatim</span>
        </div>

        {/* Captions */}
        <div className="p-3.5 rounded-2xl glass-card space-y-1">
          <span className="text-[10px] font-bold uppercase text-cyan-400">Captions</span>
          <p className="text-2xl font-extrabold text-cyan-400 font-mono">{countByType('caption')}</p>
          <span className="text-[9px] text-slate-400">Time-Coded</span>
        </div>

        {/* Courses */}
        <div className="p-3.5 rounded-2xl glass-card space-y-1">
          <span className="text-[10px] font-bold uppercase text-emerald-400">Courses</span>
          <p className="text-2xl font-extrabold text-emerald-400 font-mono">{countByType('course')}</p>
          <span className="text-[9px] text-slate-400">Curricula</span>
        </div>

        {/* News Items */}
        <div className="p-3.5 rounded-2xl glass-card space-y-1">
          <span className="text-[10px] font-bold uppercase text-amber-400">News Items</span>
          <p className="text-2xl font-extrabold text-amber-400 font-mono">{countByType('news')}</p>
          <span className="text-[9px] text-slate-400">Dispatches</span>
        </div>

        {/* Research / Indexed */}
        <div className="p-3.5 rounded-2xl glass-card space-y-1">
          <span className="text-[10px] font-bold uppercase text-blue-400">Research</span>
          <p className="text-2xl font-extrabold text-blue-400 font-mono">{countByType('research')}</p>
          <span className="text-[9px] text-slate-400">Scholarly</span>
        </div>
      </div>

      {/* Admin Action Hub Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => navigate('/admin/media')}
          className="p-6 rounded-2xl glass-panel hover:border-indigo-500/50 hover:bg-navy-900 transition-all cursor-pointer space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
            Media Library & CRUD Management
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Search, filter, view, edit, duplicate, and delete existing records. Immediately re-indexes in the browser.
          </p>
          <span className="text-xs text-indigo-400 font-semibold flex items-center gap-1">
            <span>Manage Records</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div
          onClick={() => navigate('/admin/add')}
          className="p-6 rounded-2xl glass-panel hover:border-emerald-500/50 hover:bg-navy-900 transition-all cursor-pointer space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <FilePlus className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
            Publish New Media
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Create any of the 7 supported media types with custom topics, author attribution, and rich metadata.
          </p>
          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
            <span>Open Creator Form</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div
          onClick={() => navigate('/admin/data-management')}
          className="p-6 rounded-2xl glass-panel hover:border-cyan-500/50 hover:bg-navy-900 transition-all cursor-pointer space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
            Bulk Import & Data Export
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Export the complete local library as JSON or CSV, import external data files, or reset to factory samples.
          </p>
          <span className="text-xs text-cyan-400 font-semibold flex items-center gap-1">
            <span>Data Operations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* Indexing Telemetry Banner */}
      <div className="p-6 rounded-3xl glass-panel bg-gradient-to-r from-navy-900 via-indigo-950/40 to-navy-900 border border-indigo-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Browser Inverted Index</span>
          <h3 className="text-lg font-bold text-white mt-0.5">
            {indexStats.indexedDocuments} Documents • {indexStats.uniqueTokens} Vocabulary Tokens • {indexStats.allTopicsAndTags} Topics & Tags
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Re-indexing happens synchronously upon every admin creation, edit, or deletion.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all self-start md:self-auto shrink-0"
        >
          <RotateCcw className="w-4 h-4 text-amber-400" />
          <span>Reset Factory Dataset</span>
        </button>
      </div>
    </div>
  );
}
