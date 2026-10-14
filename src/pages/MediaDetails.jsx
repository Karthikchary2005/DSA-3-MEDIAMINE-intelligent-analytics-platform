import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bookmark,
  Copy,
  Check,
  Search,
  GitCompare,
  Share2,
  Calendar,
  User,
  ExternalLink,
  Video,
  FileText,
  FileCode,
  GraduationCap,
  Newspaper,
  BookOpen,
  Sparkles,
  Clock,
  Layers,
  ChevronRight
} from 'lucide-react';
import { getStoredMedia, isBookmarked, toggleBookmark } from '../services/storageService.js';
import { kmpSearch } from '../algorithms/string/kmp.js';

export default function MediaDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [mediaItem, setMediaItem] = useState(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [inPageSearch, setInPageSearch] = useState('');
  const [inPageMatches, setInPageMatches] = useState(0);
  const [relatedItems, setRelatedItems] = useState([]);

  useEffect(() => {
    const allMedia = getStoredMedia();
    const item = allMedia.find(m => m.id === id);

    if (item) {
      setMediaItem(item);
      setBookmarked(isBookmarked(item.id));

      // Find related items by topic or shared tags
      const related = allMedia.filter(m =>
        m.id !== item.id && (
          m.topic === item.topic ||
          (m.tags && item.tags && m.tags.some(t => item.tags.includes(t)))
        )
      ).slice(0, 4);
      setRelatedItems(related);
    }
  }, [id]);

  useEffect(() => {
    if (!inPageSearch.trim() || !mediaItem) {
      setInPageMatches(0);
      return;
    }
    const fullText = [
      mediaItem.title,
      mediaItem.content,
      mediaItem.transcript,
      mediaItem.description,
      (mediaItem.captions || []).map(c => c.text).join(' ')
    ].join(' ');

    const kmpRes = kmpSearch(fullText, inPageSearch.trim());
    setInPageMatches(kmpRes.count);
  }, [inPageSearch, mediaItem]);

  const handleCopy = () => {
    const textToCopy = `${mediaItem.title}\n\n${mediaItem.content || mediaItem.transcript || mediaItem.description || ''}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleBookmark = () => {
    if (!mediaItem) return;
    toggleBookmark(mediaItem.id);
    setBookmarked(!bookmarked);
  };

  if (!mediaItem) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Media Record Not Found</h2>
        <p className="text-xs text-slate-400">The requested media document does not exist in the local dataset.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const highlightInPage = (text) => {
    if (!text || !inPageSearch.trim()) return text;
    const term = inPageSearch.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${term})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="highlight-match bg-amber-400/30 text-amber-200 px-1 py-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Top Breadcrumb & Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-950/40 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to previous view</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Compare Document Shortcut */}
          <button
            onClick={() => navigate(`/similarity?docA=${mediaItem.id}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-semibold transition-all"
          >
            <GitCompare className="w-3.5 h-3.5 text-cyan-400" />
            <span>Compare with Doc B</span>
          </button>

          {/* Copy Full Text */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>

          {/* Bookmark Toggle */}
          <button
            onClick={handleToggleBookmark}
            className={`p-2 rounded-xl border transition-all ${
              bookmarked
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Full Document Body */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Metadata Card */}
          <div className="p-6 rounded-3xl glass-panel space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30">
                {mediaItem.type}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-medium">
                {mediaItem.topic}
              </span>
              {mediaItem.difficulty && (
                <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Level: {mediaItem.difficulty}
                </span>
              )}
              {mediaItem.duration && (
                <span className="text-xs px-2.5 py-1 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{mediaItem.duration}</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
              {highlightInPage(mediaItem.title)}
            </h1>

            {mediaItem.description && (
              <p className="text-sm text-slate-300 leading-relaxed italic border-l-2 border-indigo-500 pl-3">
                {highlightInPage(mediaItem.description)}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400 border-t border-indigo-950/40">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span>{mediaItem.author || 'Editorial'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>{mediaItem.publishedAt || '2026'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>{mediaItem.source}</span>
              </div>
            </div>
          </div>

          {/* In-Page Search Bar */}
          <div className="p-3 rounded-2xl bg-navy-900/60 border border-indigo-950/40 flex items-center justify-between gap-3 text-xs">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={inPageSearch}
                onChange={(e) => setInPageSearch(e.target.value)}
                placeholder="Find in this document using KMP pattern matching..."
                className="w-full bg-slate-950/80 text-xs text-slate-100 placeholder-slate-400 pl-9 pr-4 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
              />
            </div>
            {inPageSearch && (
              <span className="text-[11px] font-mono text-cyan-400 shrink-0">
                {inPageMatches} occurrence{inPageMatches !== 1 ? 's' : ''} found
              </span>
            )}
          </div>

          {/* Specific Type Display Section */}

          {/* A. Video Display */}
          {mediaItem.type === 'video' && (
            <div className="space-y-4">
              <div className="relative aspect-video rounded-3xl overflow-hidden border border-indigo-900/40 shadow-2xl bg-slate-950 group">
                <img
                  src={mediaItem.thumbnail || "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80"}
                  alt={mediaItem.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/30 to-transparent flex items-center justify-center">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-600/90 hover:bg-indigo-500 text-white flex items-center justify-center shadow-xl cursor-pointer hover:scale-110 transition-all">
                    <Video className="w-8 h-8 ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                  <span className="px-2 py-1 rounded bg-black/70 font-mono">{mediaItem.duration || 'Video Preview'}</span>
                  <span className="text-[11px] text-slate-300">Synchronized Transcript Available Below</span>
                </div>
              </div>

              {/* Timestamped Transcript Segments */}
              {mediaItem.captions && mediaItem.captions.length > 0 && (
                <div className="p-5 rounded-2xl glass-panel space-y-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span>Video Timestamp Chapters</span>
                  </h3>
                  <div className="space-y-2">
                    {mediaItem.captions.map((cap, cIdx) => (
                      <div
                        key={cIdx}
                        className="p-3 rounded-xl bg-navy-900/50 border border-indigo-950/40 flex items-start gap-3 text-xs"
                      >
                        <span className="font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded shrink-0">
                          {cap.start} - {cap.end}
                        </span>
                        <p className="text-slate-200 leading-relaxed">
                          {highlightInPage(cap.text)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* B. Course Display */}
          {mediaItem.type === 'course' && mediaItem.syllabus && (
            <div className="p-5 rounded-2xl glass-panel space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                <span>Course Curriculum & Learning Modules</span>
              </h3>
              <div className="space-y-2">
                {mediaItem.syllabus.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-navy-900/40 border border-slate-800 flex items-center gap-3 text-xs">
                    <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-slate-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* C. Research Abstract */}
          {mediaItem.type === 'research' && mediaItem.abstract && (
            <div className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-800/40 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">Scholarly Abstract</span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {highlightInPage(mediaItem.abstract)}
              </p>
              {mediaItem.citations && (
                <div className="pt-2 text-[11px] text-cyan-400 font-mono">
                  {mediaItem.citations} Peer-reviewed Citations
                </div>
              )}
            </div>
          )}

          {/* D. Main Article / Document Body Text */}
          <div className="p-6 rounded-3xl glass-panel space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              {mediaItem.type === 'transcript' ? 'Verbatim Transcript Text' :
               mediaItem.type === 'caption' ? 'Synchronized Caption Stream' :
               'Document Body'}
            </h3>

            <div className="text-sm text-slate-200 leading-relaxed space-y-4 font-sans whitespace-pre-line">
              {highlightInPage(
                mediaItem.content || mediaItem.transcript || mediaItem.description || 'No extended content available.'
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Metadata, Tags, & Related Media */}
        <div className="space-y-6">
          {/* Metadata Sidebar Card */}
          <div className="p-5 rounded-2xl glass-panel space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Document Information</h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-indigo-950/40">
                <span className="text-slate-400">Document ID:</span>
                <span className="font-mono text-cyan-400">{mediaItem.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-indigo-950/40">
                <span className="text-slate-400">Content Type:</span>
                <span className="font-medium text-slate-200 capitalize">{mediaItem.type}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-indigo-950/40">
                <span className="text-slate-400">Primary Topic:</span>
                <span className="font-medium text-slate-200">{mediaItem.topic}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-indigo-950/40">
                <span className="text-slate-400">Published:</span>
                <span className="font-mono text-slate-300">{mediaItem.publishedAt || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-indigo-950/40">
                <span className="text-slate-400">Origin / Source:</span>
                <span className="text-slate-300">{mediaItem.source}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="pt-2 space-y-2">
              <span className="text-xs font-semibold text-slate-400">Indexed Tags:</span>
              <div className="flex flex-wrap gap-1.5">
                {(mediaItem.tags || []).map((tag, idx) => (
                  <button
                    key={idx}
                    onClick={() => navigate(`/search?q=${encodeURIComponent(tag)}`)}
                    className="text-[11px] px-2 py-0.5 rounded-lg bg-navy-900 hover:bg-indigo-600/20 text-indigo-300 border border-indigo-900/50 font-mono transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Related Content Recommendations */}
          <div className="p-5 rounded-2xl glass-panel space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Related Media In Corpus</span>
            </h3>

            <div className="space-y-2.5">
              {relatedItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/media/${item.id}`)}
                  className="p-3 rounded-xl bg-navy-900/50 hover:bg-navy-900 border border-indigo-950/40 hover:border-indigo-500/30 transition-all cursor-pointer group"
                >
                  <span className="text-[9px] font-bold uppercase text-indigo-400">{item.type}</span>
                  <p className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 line-clamp-1">
                    {item.title}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{item.topic}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
