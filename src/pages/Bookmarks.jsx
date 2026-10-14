import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, ArrowRight, Trash2, ExternalLink, Sparkles, Layers } from 'lucide-react';
import { getStoredMedia, getBookmarks, toggleBookmark } from '../services/storageService.js';

export default function Bookmarks() {
  const navigate = useNavigate();
  const [bookmarkedItems, setBookmarkedItems] = useState([]);

  useEffect(() => {
    loadBookmarks();
    window.addEventListener('mediamine:bookmarks-updated', loadBookmarks);
    return () => window.removeEventListener('mediamine:bookmarks-updated', loadBookmarks);
  }, []);

  const loadBookmarks = () => {
    const allMedia = getStoredMedia();
    const ids = getBookmarks();
    const items = allMedia.filter(m => ids.includes(m.id));
    setBookmarkedItems(items);
  };

  const handleRemove = (id) => {
    toggleBookmark(id);
    loadBookmarks();
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <div className="flex items-center justify-between border-b border-indigo-950/40 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Bookmark className="w-6 h-6 text-amber-400 fill-amber-400" />
            <span>Saved Bookmarks</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Your locally bookmarked articles, transcripts, and research documents.</p>
        </div>
        <span className="text-xs font-mono px-3 py-1 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30">
          {bookmarkedItems.length} Saved
        </span>
      </div>

      {bookmarkedItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookmarkedItems.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/media/${item.id}`)}
              className="p-5 rounded-2xl glass-card hover:border-indigo-500/40 hover:bg-navy-900 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {item.type}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(item.id);
                    }}
                    title="Remove Bookmark"
                    className="text-slate-400 hover:text-red-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">
                  {item.description || item.headline || item.content?.substring(0, 100)}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-indigo-950/40 flex items-center justify-between text-[11px] text-slate-400">
                <span>{item.topic}</span>
                <span className="flex items-center gap-1 text-indigo-400 group-hover:translate-x-0.5 transition-transform font-medium">
                  <span>View</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 rounded-3xl glass-panel text-center space-y-4 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No Bookmarked Media Yet</h3>
          <p className="text-xs text-slate-400">
            Click the bookmark icon on any search result or media details page to save records for offline reference.
          </p>
          <button
            onClick={() => navigate('/search')}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
          >
            Explore Media Catalog
          </button>
        </div>
      )}
    </div>
  );
}
