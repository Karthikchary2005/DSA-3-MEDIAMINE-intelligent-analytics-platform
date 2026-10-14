import React, { useState } from 'react';
import {
  Database,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileText,
  FileCode,
  ShieldAlert
} from 'lucide-react';
import { getStoredMedia, saveStoredMedia, resetStoredMediaToDefault } from '../services/storageService.js';

export default function DataManagement() {
  const [feedback, setFeedback] = useState({ type: '', msg: '' });
  const [importText, setImportText] = useState('');

  const currentMedia = getStoredMedia();

  const showFeedback = (type, msg) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback({ type: '', msg: '' }), 4000);
  };

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentMedia, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `mediamine_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showFeedback('success', `Exported ${currentMedia.length} media records as JSON.`);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['id', 'type', 'title', 'topic', 'author', 'source', 'publishedAt'];
    const rows = currentMedia.map(m => [
      m.id,
      m.type,
      `"${(m.title || '').replace(/"/g, '""')}"`,
      `"${(m.topic || '').replace(/"/g, '""')}"`,
      `"${(m.author || '').replace(/"/g, '""')}"`,
      `"${(m.source || '').replace(/"/g, '""')}"`,
      m.publishedAt
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `mediamine_records_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    showFeedback('success', `Exported ${currentMedia.length} media records as CSV.`);
  };

  // Import JSON via Paste or Upload
  const handleImportJSON = () => {
    try {
      if (!importText.trim()) {
        showFeedback('error', 'Please paste a valid JSON array of media records.');
        return;
      }
      const parsed = JSON.parse(importText);
      if (!Array.isArray(parsed)) {
        showFeedback('error', 'Import payload must be a JSON array of records.');
        return;
      }

      // Merge or overwrite
      const updated = [...parsed, ...currentMedia.filter(c => !parsed.some(p => p.id === c.id))];
      saveStoredMedia(updated);
      setImportText('');
      showFeedback('success', `Successfully imported ${parsed.length} media records!`);
    } catch (err) {
      showFeedback('error', `JSON parse error: ${err.message}`);
    }
  };

  // Reset to Factory Samples
  const handleFactoryReset = () => {
    if (window.confirm('Reset local media collection to default 52+ records? This will clear any custom records.')) {
      resetStoredMediaToDefault();
      showFeedback('success', 'Factory demo dataset restored successfully.');
    }
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-indigo-950/40 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Database className="w-7 h-7 text-cyan-400" />
          <span>Data Operations & Management</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Export your entire media corpus, import external collections, or restore the baseline sample dataset.
        </p>
      </div>

      {feedback.msg && (
        <div className={`p-3.5 rounded-xl border flex items-center gap-2 text-xs ${
          feedback.type === 'error'
            ? 'bg-red-500/10 border-red-500/30 text-red-300'
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
        }`}>
          {feedback.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0 text-red-400" /> : <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />}
          <span>{feedback.msg}</span>
        </div>
      )}

      {/* Export Section */}
      <div className="p-6 rounded-3xl glass-panel space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Export Local Media Corpus</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Download all {currentMedia.length} records stored in your browser's persistent storage.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <button
            onClick={handleExportJSON}
            className="p-4 rounded-2xl bg-navy-900/60 hover:bg-navy-900 border border-indigo-950/50 hover:border-indigo-500/40 flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
                <FileCode className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white">Export as JSON</p>
                <p className="text-[11px] text-slate-400">Complete schema with transcripts & captions</p>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
          </button>

          <button
            onClick={handleExportCSV}
            className="p-4 rounded-2xl bg-navy-900/60 hover:bg-navy-900 border border-indigo-950/50 hover:border-indigo-500/40 flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white">Export as CSV</p>
                <p className="text-[11px] text-slate-400">Spreadsheet-compatible metadata table</p>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
          </button>
        </div>
      </div>

      {/* Bulk Import Section */}
      <div className="p-6 rounded-3xl glass-panel space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white">Bulk Import Media Records (JSON)</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Paste a JSON array of records to merge into your browser catalog.
          </p>
        </div>

        <textarea
          rows={6}
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          placeholder={`[
  {
    "id": "med-art-new-1",
    "type": "article",
    "title": "Autonomous AI Agents in Cloud Workflows",
    "topic": "Artificial Intelligence",
    "content": "Full example content...",
    "tags": ["AI", "agents", "cloud"]
  }
]`}
          className="w-full bg-navy-950 border border-slate-700 rounded-2xl p-3 text-xs text-slate-200 font-mono"
        />

        <div className="flex justify-end">
          <button
            onClick={handleImportJSON}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/30 flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span>Process & Index Payload</span>
          </button>
        </div>
      </div>

      {/* Danger Zone: Factory Reset */}
      <div className="p-6 rounded-3xl bg-red-950/20 border border-red-900/40 space-y-4">
        <div className="flex items-center gap-2.5 text-red-400">
          <ShieldAlert className="w-5 h-5" />
          <h3 className="text-sm font-bold text-white">Factory Data Reset</h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Resetting will replace all modified or custom records with the pristine, initial 52+ sample media records.
        </p>
        <button
          onClick={handleFactoryReset}
          className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-all flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Restore Factory Samples (52+ Records)</span>
        </button>
      </div>
    </div>
  );
}
