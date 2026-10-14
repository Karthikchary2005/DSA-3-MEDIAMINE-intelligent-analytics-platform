import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  Search,
  Filter,
  FilePlus,
  Trash2,
  Edit,
  Copy,
  ExternalLink,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
  RotateCcw
} from 'lucide-react';
import { getStoredMedia, saveStoredMedia, resetStoredMediaToDefault } from '../services/storageService.js';

export default function MediaManagement() {
  const navigate = useNavigate();
  const [mediaList, setMediaList] = useState([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [editingItem, setEditingItem] = useState(null); // when modal open for edit
  const [feedbackMsg, setFeedbackMsg] = useState('');

  useEffect(() => {
    loadMedia();
    window.addEventListener('mediamine:data-updated', loadMedia);
    return () => window.removeEventListener('mediamine:data-updated', loadMedia);
  }, []);

  const loadMedia = () => {
    setMediaList(getStoredMedia());
  };

  const showFeedback = (msg) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  // Delete Record
  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      const updated = mediaList.filter(m => m.id !== id);
      saveStoredMedia(updated);
      setMediaList(updated);
      showFeedback('Media record successfully deleted.');
    }
  };

  // Duplicate Record
  const handleDuplicate = (item) => {
    const copy = {
      ...item,
      id: `med-${item.type.substring(0, 3)}-${Date.now()}`,
      title: `${item.title} (Copy)`,
      publishedAt: new Date().toISOString().split('T')[0]
    };
    const updated = [copy, ...mediaList];
    saveStoredMedia(updated);
    setMediaList(updated);
    showFeedback('Record duplicated successfully.');
  };

  // Save Edit
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingItem) return;

    const updated = mediaList.map(m => m.id === editingItem.id ? editingItem : m);
    saveStoredMedia(updated);
    setMediaList(updated);
    setEditingItem(null);
    showFeedback('Record updated and indexes refreshed.');
  };

  // Filter & Search
  const filteredMedia = mediaList.filter(item => {
    if (typeFilter !== 'all' && item.type !== typeFilter) return false;
    if (searchFilter.trim()) {
      const term = searchFilter.toLowerCase();
      const match = item.title.toLowerCase().includes(term) ||
                    (item.topic || '').toLowerCase().includes(term) ||
                    (item.tags || []).some(t => t.toLowerCase().includes(term));
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-950/40 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-indigo-400" />
            <span>Media Library Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage records, edit metadata, duplicate, and delete documents across the browser collection.
          </p>
        </div>

        <button
          onClick={() => navigate('/admin/add')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/30 shrink-0"
        >
          <FilePlus className="w-4 h-4" />
          <span>Add Media Record</span>
        </button>
      </div>

      {feedbackMsg && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl glass-panel flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search by title, topic, or tag..."
            className="w-full bg-navy-900 border border-indigo-900/50 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <span className="text-slate-400 font-medium">Type:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-navy-900 border border-indigo-900/50 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Content Types</option>
            <option value="article">Article</option>
            <option value="video">Video</option>
            <option value="transcript">Transcript</option>
            <option value="caption">Caption</option>
            <option value="course">Course</option>
            <option value="news">News</option>
            <option value="research">Research</option>
          </select>
          <span className="text-slate-400 font-mono text-[11px] whitespace-nowrap">
            {filteredMedia.length} / {mediaList.length} items
          </span>
        </div>
      </div>

      {/* Table of Media Records */}
      <div className="rounded-2xl glass-panel overflow-hidden border border-indigo-950/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-900/80 border-b border-indigo-950/60 text-slate-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Title & Description</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Topic</th>
                <th className="py-3 px-4">Author / Source</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-950/30">
              {filteredMedia.map((item) => (
                <tr key={item.id} className="hover:bg-indigo-600/5 transition-colors">
                  <td className="py-3 px-4 max-w-sm">
                    <p className="font-bold text-slate-100 hover:text-cyan-300 cursor-pointer line-clamp-1"
                       onClick={() => navigate(`/media/${item.id}`)}>
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {item.description || item.headline || item.content?.substring(0, 80)}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {item.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-medium whitespace-nowrap">
                    {item.topic}
                  </td>
                  <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                    {item.author || item.source}
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-mono whitespace-nowrap">
                    {item.publishedAt}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => navigate(`/media/${item.id}`)}
                        title="View Full Record"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setEditingItem(item)}
                        title="Edit Record"
                        className="p-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDuplicate(item)}
                        title="Duplicate Record"
                        className="p-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.title)}
                        title="Delete Record"
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal Dialog */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-navy-950 rounded-3xl border border-indigo-900/60 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-indigo-950/60">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit className="w-4 h-4 text-indigo-400" />
                <span>Edit Media Record ({editingItem.id})</span>
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Title</label>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full bg-navy-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Topic</label>
                  <input
                    type="text"
                    value={editingItem.topic}
                    onChange={(e) => setEditingItem({ ...editingItem, topic: e.target.value })}
                    className="w-full bg-navy-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Author / Source</label>
                  <input
                    type="text"
                    value={editingItem.author || editingItem.source || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, author: e.target.value, source: e.target.value })}
                    className="w-full bg-navy-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description / Summary</label>
                <textarea
                  rows={2}
                  value={editingItem.description || editingItem.headline || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full bg-navy-900 border border-slate-700 rounded-xl p-2.5 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Main Content / Transcript Text</label>
                <textarea
                  rows={6}
                  value={editingItem.content || editingItem.transcript || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value, transcript: e.target.value })}
                  className="w-full bg-navy-900 border border-slate-700 rounded-xl p-2.5 text-slate-100 font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-indigo-950/60">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
