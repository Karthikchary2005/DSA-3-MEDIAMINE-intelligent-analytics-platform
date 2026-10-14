import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Search, Trash2, ArrowRight, Clock, CheckCircle2 } from 'lucide-react';
import { getSearchHistory, clearSearchHistory } from '../services/storageService.js';

export default function SearchHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
    window.addEventListener('mediamine:history-updated', loadHistory);
    return () => window.removeEventListener('mediamine:history-updated', loadHistory);
  }, []);

  const loadHistory = () => {
    setHistory(getSearchHistory());
  };

  const handleClear = () => {
    if (window.confirm('Clear all local search history?')) {
      clearSearchHistory();
      setHistory([]);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <div className="flex items-center justify-between border-b border-indigo-950/40 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <History className="w-6 h-6 text-cyan-400" />
            <span>Search History</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browser-persisted record of your search queries and result resolutions.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {history.length > 0 ? (
        <div className="p-4 rounded-2xl glass-panel space-y-2">
          {history.map((item, idx) => (
            <div
              key={idx}
              onClick={() => navigate(`/search?q=${encodeURIComponent(item.query)}`)}
              className="flex items-center justify-between p-3.5 rounded-xl bg-navy-900/40 hover:bg-indigo-600/15 border border-indigo-950/40 hover:border-indigo-500/30 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
                  <Search className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {item.query}
                  </p>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(item.timestamp).toLocaleString()}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {item.count} results
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 rounded-3xl glass-panel text-center space-y-4 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No Search Queries Recorded</h3>
          <p className="text-xs text-slate-400">
            Execute queries via global search to automatically build your local analytical timeline.
          </p>
        </div>
      )}
    </div>
  );
}
