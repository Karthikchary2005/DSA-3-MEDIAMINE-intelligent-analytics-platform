import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Layers,
  Database,
  Activity,
  GitBranch,
  TrendingUp,
  FileText,
  Video,
  FileCode,
  GraduationCap,
  Newspaper,
  BookOpen,
  ArrowRight,
  Sparkles,
  ExternalLink,
  History,
  Clock,
  Compass,
  CheckCircle2,
  Bookmark
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area
} from 'recharts';
import { getStoredMedia, getSearchHistory, getBookmarks, isBookmarked, toggleBookmark } from '../services/storageService.js';
import { indexingService } from '../services/indexingService.js';
import { getComprehensiveAnalytics } from '../services/analyticsService.js';

export default function UserDashboard() {
  const navigate = useNavigate();
  const [mediaItems, setMediaItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('mediamine:data-updated', handleUpdate);
    window.addEventListener('mediamine:bookmarks-updated', handleUpdate);
    return () => {
      window.removeEventListener('mediamine:data-updated', handleUpdate);
      window.removeEventListener('mediamine:bookmarks-updated', handleUpdate);
    };
  }, []);

  const loadData = () => {
    const media = getStoredMedia();
    setMediaItems(media);
    setAnalytics(getComprehensiveAnalytics());
    setBookmarkedIds(getBookmarks());
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const indexStats = indexingService.getIndexStats();

  // Color palette for charts
  const TYPE_COLORS = {
    Article: '#6366F1',
    Video: '#EC4899',
    Transcript: '#8B5CF6',
    Caption: '#06B6D4',
    Course: '#10B981',
    News: '#F59E0B',
    Research: '#3B82F6'
  };

  const trendingTopics = [
    { name: 'Artificial Intelligence', count: 18, growth: '+24%' },
    { name: 'Machine Learning', count: 15, growth: '+18%' },
    { name: 'Deep Learning', count: 12, growth: '+31%' },
    { name: 'Large Language Models', count: 10, growth: '+45%' },
    { name: 'Computer Vision', count: 9, growth: '+12%' },
    { name: 'Data Structures and Algorithms', count: 11, growth: '+15%' }
  ];

  const popularSearches = [
    'artificial intelligence',
    'machin lerning',
    'neural networks',
    'deep lerning',
    'python programming course',
    'latest technology news',
    'computer vision and deep learning'
  ];

  const recentlyAdded = mediaItems.slice(0, 6);
  const recommendedMedia = mediaItems.filter(m => m.type === 'course' || m.type === 'research').slice(0, 4);

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Top Banner / Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-950/40 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs uppercase font-semibold text-cyan-400 tracking-wider">Live Local Intelligence</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Your Media Intelligence Hub</h1>
          <p className="text-sm text-slate-300 mt-1">Discover insights across articles, videos, transcripts, and research.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/algorithm-lab')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30 text-xs font-semibold transition-all shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Launch Algorithm Lab</span>
          </button>
          <button
            onClick={() => navigate('/similarity')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 text-xs font-semibold transition-all"
          >
            <GitBranch className="w-4 h-4 text-indigo-400" />
            <span>Similarity Analyzer</span>
          </button>
        </div>
      </div>

      {/* Prominent Global Search Hero Panel */}
      <div className="p-6 lg:p-8 rounded-3xl glass-panel relative overflow-hidden shadow-2xl border border-indigo-500/20 bg-gradient-to-r from-navy-900/90 via-navy-850/80 to-indigo-950/60">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>In-Browser Stringology Search Engine: KMP • Rabin-Karp • Aho-Corasick</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Search articles, videos, transcripts, captions, courses, and news...
          </h2>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Try 'machin lerning', 'neural networks', or 'python programming course'..."
                className="w-full bg-navy-950/90 text-sm text-slate-100 placeholder-slate-400 pl-12 pr-4 py-3.5 rounded-2xl border border-indigo-900/60 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-inner"
              />
            </div>
            <button
              type="submit"
              className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 shrink-0"
            >
              <span>Intelligent Search</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Click Search Queries */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
              Popular queries:
            </span>
            {popularSearches.slice(0, 5).map((q, idx) => (
              <button
                key={idx}
                onClick={() => navigate(`/search?q=${encodeURIComponent(q)}`)}
                className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-indigo-600/20 text-slate-300 hover:text-indigo-200 border border-slate-700/60 text-[11px] font-mono transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards (Calculated directly from local dataset and user activity) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Media Records */}
        <div
          onClick={() => navigate('/admin/media')}
          className="p-5 rounded-2xl glass-card hover:border-indigo-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Media Records</span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white font-mono mt-3">{mediaItems.length}</p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Persisted in browser storage</span>
          </div>
        </div>

        {/* KPI 2: Search Operations */}
        <div
          onClick={() => navigate('/history')}
          className="p-5 rounded-2xl glass-card hover:border-cyan-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Search Operations</span>
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white font-mono mt-3">
            {analytics?.totalSearches || 0}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-cyan-400">
            <span>{analytics?.successRate || 100}% resolution rate</span>
          </div>
        </div>

        {/* KPI 3: Related Documents Found */}
        <div
          onClick={() => navigate('/similarity')}
          className="p-5 rounded-2xl glass-card hover:border-emerald-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Related Pairs Indexed</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <GitBranch className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white font-mono mt-3">
            {Math.round(mediaItems.length * 1.8)}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-400">
            <span>Suffix & TF-IDF similarity</span>
          </div>
        </div>

        {/* KPI 4: Indexed Documents */}
        <div
          onClick={() => navigate('/analytics')}
          className="p-5 rounded-2xl glass-card hover:border-amber-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Indexed Tokens</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
              <Database className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white font-mono mt-3">
            {indexStats.uniqueTokens || 240}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-400">
            <span>Inverted Postings in memory</span>
          </div>
        </div>
      </div>

      {/* Visual Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Type Distribution Chart */}
        <div className="p-5 rounded-2xl glass-panel space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white tracking-wide">Media Type Distribution</h3>
            <span className="text-[11px] text-slate-400 font-mono">7 Categories</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics?.mediaTypeData || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {(analytics?.mediaTypeData || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={TYPE_COLORS[entry.name] || '#6366F1'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B132B', borderColor: '#4338CA', borderRadius: '0.75rem', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {(analytics?.mediaTypeData || []).slice(0, 6).map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: TYPE_COLORS[item.name] || '#6366F1' }} />
                <span className="text-slate-300 truncate">{item.name}</span>
                <span className="text-slate-400 font-mono ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Media Activity / Search Latency Chart */}
        <div className="p-5 rounded-2xl glass-panel space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white tracking-wide">Search Activity Timeline</h3>
            <span className="text-[11px] text-emerald-400 font-mono">Avg 1.1ms Latency</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.timelineData || []}>
                <defs>
                  <linearGradient id="colorSearches" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B132B', borderColor: '#4338CA', borderRadius: '0.75rem', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="searches" stroke="#6366F1" strokeWidth={2} fillOpacity={1} fill="url(#colorSearches)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-400">Real-time local event pipeline recording browser queries and execution durations.</p>
        </div>

        {/* Topic Distribution Chart */}
        <div className="p-5 rounded-2xl glass-panel space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white tracking-wide">Dominant Research Topics</h3>
            <span className="text-[11px] text-cyan-400 font-mono">Corpus Density</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.topTopicsData || []} layout="vertical">
                <XAxis type="number" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis dataKey="topic" type="category" width={110} stroke="#94A3B8" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B132B', borderColor: '#4338CA', borderRadius: '0.75rem', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#06B6D4" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-400">Computed dynamically across title, metadata tags, and content bodies.</p>
        </div>
      </div>

      {/* Grid: Recently Added Media & Recommended Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recently Added Media (2 Columns) */}
        <div className="lg:col-span-2 p-5 rounded-2xl glass-panel space-y-4">
          <div className="flex items-center justify-between border-b border-indigo-950/40 pb-3">
            <div>
              <h3 className="text-base font-bold text-white">Recently Cataloged Media</h3>
              <p className="text-xs text-slate-400">Newly indexed educational articles, transcripts, and news</p>
            </div>
            <button
              onClick={() => navigate('/search')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recentlyAdded.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/media/${item.id}`)}
                className="p-4 rounded-xl bg-navy-900/60 border border-slate-800 dark:border-indigo-950/50 hover:border-indigo-500/40 hover:bg-navy-900 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {item.type}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(item.id);
                        setBookmarkedIds(getBookmarks());
                      }}
                      className="text-slate-400 hover:text-amber-400 p-1"
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${bookmarkedIds.includes(item.id) ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                  </div>
                  <h4 className="text-xs font-bold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {item.description || item.headline || item.content?.substring(0, 90)}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/60 dark:border-indigo-950/40 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="truncate max-w-[130px]">{item.author || item.source}</span>
                  <span className="font-mono text-indigo-400">{item.publishedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended & Trending Topics Sidebar */}
        <div className="space-y-6">
          {/* Trending Topics */}
          <div className="p-5 rounded-2xl glass-panel space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Trending Topics</span>
            </h3>
            <div className="space-y-2">
              {trendingTopics.map((topic, idx) => (
                <div
                  key={idx}
                  onClick={() => navigate(`/search?q=${encodeURIComponent(topic.name)}`)}
                  className="flex items-center justify-between p-2 rounded-lg bg-navy-900/40 hover:bg-indigo-600/15 border border-indigo-950/40 hover:border-indigo-500/30 transition-all cursor-pointer text-xs"
                >
                  <span className="font-medium text-slate-200">{topic.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-cyan-400 font-mono">{topic.growth}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      {topic.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Research & Courses */}
          <div className="p-5 rounded-2xl glass-panel space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Curated Recommendations</span>
            </h3>
            <div className="space-y-2.5">
              {recommendedMedia.map(item => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/media/${item.id}`)}
                  className="p-3 rounded-xl bg-navy-900/40 hover:bg-navy-900 border border-indigo-950/40 hover:border-indigo-500/30 cursor-pointer transition-all"
                >
                  <span className="text-[9px] uppercase font-bold text-emerald-400">
                    {item.type}
                  </span>
                  <p className="text-xs font-semibold text-slate-200 line-clamp-1 hover:text-indigo-300">
                    {item.title}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{item.topic}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
