import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Bookmark,
  ExternalLink,
  Clock,
  Sparkles,
  ArrowRight,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  FileText,
  Video,
  FileCode,
  GraduationCap,
  Newspaper,
  BookOpen,
  Info
} from 'lucide-react';
import { executeSearch } from '../services/searchService.js';
import { toggleBookmark, isBookmarked, getBookmarks } from '../services/storageService.js';

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const queryParam = searchParams.get('q') || '';
  const typeParam = searchParams.get('type') || 'all';
  const topicParam = searchParams.get('topic') || 'all';
  const sortParam = searchParams.get('sort') || 'relevance';
  const minSimParam = parseInt(searchParams.get('min') || '0', 10);
  const forceParam = searchParams.get('force') === 'true';

  const [searchInput, setSearchInput] = useState(queryParam);
  const [searchResult, setSearchResult] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    setSearchInput(queryParam);
    runSearch(queryParam, typeParam, topicParam, sortParam, minSimParam, forceParam);
    setBookmarkedIds(getBookmarks());
  }, [queryParam, typeParam, topicParam, sortParam, minSimParam, forceParam]);

  const runSearch = (q, type, topic, sort, minSim, force) => {
    const res = executeSearch(q, {
      typeFilter: type,
      topicFilter: topic,
      sortBy: sort,
      minSimilarity: minSim,
      forceOriginal: force
    });
    setSearchResult(res);
    setCurrentPage(1);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('q', searchInput.trim());
    updateParam('force', null); // reset forced original on fresh submission
  };

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'all' || value === '0') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
  };

  const filterTabs = [
    { label: 'All Media', value: 'all' },
    { label: 'Articles', value: 'article' },
    { label: 'Videos', value: 'video' },
    { label: 'Transcripts', value: 'transcript' },
    { label: 'Captions', value: 'caption' },
    { label: 'Courses', value: 'course' },
    { label: 'News', value: 'news' },
    { label: 'Research', value: 'research' }
  ];

  const topicsList = [
    'all',
    'Artificial Intelligence',
    'Machine Learning',
    'Deep Learning',
    'Neural Networks',
    'Generative AI',
    'Large Language Models',
    'Natural Language Processing',
    'Computer Vision',
    'Python',
    'Java',
    'Data Structures and Algorithms',
    'Cloud Computing',
    'Cybersecurity',
    'Software Engineering',
    'Data Science',
    'Science',
    'Technology industry news'
  ];

  const handleToggleBookmark = (id) => {
    toggleBookmark(id);
    setBookmarkedIds(getBookmarks());
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4 text-pink-400" />;
      case 'transcript': return <FileCode className="w-4 h-4 text-purple-400" />;
      case 'caption': return <FileText className="w-4 h-4 text-cyan-400" />;
      case 'course': return <GraduationCap className="w-4 h-4 text-emerald-400" />;
      case 'news': return <Newspaper className="w-4 h-4 text-amber-400" />;
      case 'research': return <BookOpen className="w-4 h-4 text-blue-400" />;
      default: return <FileText className="w-4 h-4 text-indigo-400" />;
    }
  };

  const highlightMatches = (text, keywords = []) => {
    if (!text || keywords.length === 0) return text;
    // Regex safely escapes keywords
    const pattern = keywords
      .map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .filter(k => k.length > 2)
      .join('|');

    if (!pattern) return text;
    const regex = new RegExp(`(${pattern})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="highlight-match">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // Pagination slice
  const results = searchResult?.results || [];
  const totalPages = Math.ceil(results.length / itemsPerPage);
  const paginatedResults = results.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Search Header Bar */}
      <div className="p-4 sm:p-6 rounded-2xl glass-panel space-y-4">
        <form onSubmit={handleSearchSubmit} className="relative flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search articles, videos, transcripts, captions, courses, news..."
              className="w-full bg-navy-900/90 text-sm text-slate-100 placeholder-slate-400 pl-10 pr-10 py-3 rounded-xl border border-indigo-900/60 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => { setSearchInput(''); updateParam('q', ''); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                Clear
              </button>
            )}
          </div>
          <button
            type="submit"
            className="py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 shrink-0"
          >
            <span>Search</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Content Type Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {filterTabs.map((tab) => {
            const isSelected = typeParam === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => updateParam('type', tab.value)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'bg-navy-900/60 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Secondary Controls: Topic filter, Sort, Min similarity, Active Algorithms */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-navy-900/60 border border-indigo-950/40 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Topic Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Topic:</span>
            <select
              value={topicParam}
              onChange={(e) => updateParam('topic', e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            >
              {topicsList.map((t, idx) => (
                <option key={idx} value={t}>{t === 'all' ? 'All Topics' : t}</option>
              ))}
            </select>
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Sort By:</span>
            <select
              value={sortParam}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="relevance">Relevance Score</option>
              <option value="newest">Most Recent</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>

          {/* Min Similarity Slider */}
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Min Match:</span>
            <input
              type="range"
              min="0"
              max="90"
              step="10"
              value={minSimParam}
              onChange={(e) => updateParam('min', e.target.value)}
              className="w-20 accent-indigo-500 cursor-pointer"
            />
            <span className="text-slate-400 font-mono text-[10px]">{minSimParam}%</span>
          </div>
        </div>

        {/* Algorithm execution telemetry */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono text-cyan-300">{searchResult?.timeMs || 0} ms</span>
          </div>
          <div className="hidden md:flex items-center gap-1">
            {(searchResult?.algorithmsUsed || []).map((alg, idx) => (
              <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                {alg}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Spelling Correction Notice Banner */}
      {searchResult?.spellingInfo && (
        <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-between text-xs animate-in slide-in-from-top-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="text-slate-300">
              Showing results for:{' '}
              <strong className="text-white underline decoration-indigo-400">
                {searchResult.spellingInfo.suggestedQuery}
              </strong>
            </span>
          </div>
          <button
            onClick={() => updateParam('force', 'true')}
            className="text-xs text-indigo-400 hover:text-indigo-300 underline font-medium"
          >
            Search instead for: "{searchResult.spellingInfo.originalQuery}"
          </button>
        </div>
      )}

      {/* Match Count Header */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>
          Found <strong className="text-white font-mono">{results.length}</strong> matching records
          {queryParam ? ` for "${queryParam}"` : ''}
        </span>
        {totalPages > 1 && (
          <span>Page {currentPage} of {totalPages}</span>
        )}
      </div>

      {/* Results List */}
      {results.length > 0 ? (
        <div className="space-y-3.5">
          {paginatedResults.map(({ item, relevanceScore, matchSignals, matchedKeywords, snippet }) => (
            <div
              key={item.id}
              onClick={() => navigate(`/media/${item.id}`)}
              className="p-5 rounded-2xl glass-card hover:border-indigo-500/40 hover:bg-navy-900/80 transition-all cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group"
            >
              <div className="space-y-2 flex-1">
                {/* Type & Topic Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {getTypeIcon(item.type)}
                    <span>{item.type}</span>
                  </span>
                  <span className="text-xs font-semibold text-slate-300">
                    {item.topic}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-xs text-slate-400">
                    {item.author || item.source}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-xs text-slate-400 font-mono">
                    {item.publishedAt}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {highlightMatches(item.title, matchedKeywords)}
                </h3>

                {/* Highlighted Snippet */}
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {highlightMatches(snippet, matchedKeywords)}
                </p>

                {/* Tags & Why this result matched */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 font-medium">Signals:</span>
                  {(matchSignals || []).map((sig, sIdx) => (
                    <span key={sIdx} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {sig}
                    </span>
                  ))}
                  {(item.tags || []).slice(0, 3).map((tag, tIdx) => (
                    <span key={tIdx} className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-950/60 text-indigo-300 font-mono">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Side: Relevance Score Gauge & Action Buttons */}
              <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/60">
                <div className="text-right">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-400">Relevance:</span>
                    <span className={`text-sm font-bold font-mono px-2 py-0.5 rounded-lg ${
                      relevanceScore >= 80 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      relevanceScore >= 50 ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {relevanceScore}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleBookmark(item.id);
                    }}
                    title="Bookmark this media item"
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-400 border border-slate-800 transition-colors"
                  >
                    <Bookmark className={`w-4 h-4 ${bookmarkedIds.includes(item.id) ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/media/${item.id}`);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-semibold transition-all"
                  >
                    <span>Inspect</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="px-3 py-1.5 rounded-lg bg-navy-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white disabled:opacity-40"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-8 h-8 rounded-lg text-xs font-mono font-medium transition-colors ${
                    currentPage === idx + 1
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-navy-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="px-3 py-1.5 rounded-lg bg-navy-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 rounded-3xl glass-panel text-center space-y-4 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">No Matching Media Records Found</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            We couldn't find any documents matching your current query and filter constraints.
            Try adjusting your spelling or selecting from suggested topics below.
          </p>

          <div className="pt-2">
            <p className="text-xs font-semibold text-slate-300 mb-2">Recommended Queries:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['machine learning', 'artificial intelligence', 'neural networks', 'python', 'cloud computing'].map((sq, i) => (
                <button
                  key={i}
                  onClick={() => updateParam('q', sq)}
                  className="px-3 py-1 rounded-lg bg-navy-900 border border-indigo-900/50 text-indigo-300 hover:bg-indigo-600/20 text-xs font-mono"
                >
                  {sq}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
