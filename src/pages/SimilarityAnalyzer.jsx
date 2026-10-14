import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  GitCompare,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileText,
  Clock,
  Layers,
  Info,
  Sliders,
  ChevronDown
} from 'lucide-react';
import { getStoredMedia } from '../services/storageService.js';
import { compareDocuments } from '../algorithms/similarity/documentSimilarity.js';

export default function SimilarityAnalyzer() {
  const [searchParams] = useSearchParams();
  const initialDocA = searchParams.get('docA') || '';
  const initialDocB = searchParams.get('docB') || '';

  const [mediaList, setMediaList] = useState([]);
  const [docAId, setDocAId] = useState(initialDocA);
  const [docBId, setDocBId] = useState(initialDocB);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [isComputing, setIsComputing] = useState(false);

  useEffect(() => {
    const media = getStoredMedia();
    setMediaList(media);

    if (media.length >= 2) {
      const a = initialDocA || media[0].id;
      // Pick a related document for interesting initial comparison
      const b = initialDocB || (media.find(m => m.id !== a && m.topic === media.find(x => x.id === a)?.topic)?.id || media[1].id);
      setDocAId(a);
      setDocBId(b);
      runComparison(a, b, media);
    }
  }, [initialDocA, initialDocB]);

  const runComparison = (idA, idB, list = mediaList) => {
    const docA = list.find(m => m.id === idA);
    const docB = list.find(m => m.id === idB);

    if (!docA || !docB) return;

    setIsComputing(true);
    setTimeout(() => {
      const res = compareDocuments(docA, docB);
      setComparisonResult(res);
      setIsComputing(false);
    }, 150);
  };

  const handleRunClick = () => {
    if (docAId === docBId) {
      alert('Please select two distinct media records for comparison.');
      return;
    }
    runComparison(docAId, docBId);
  };

  const docA = mediaList.find(m => m.id === docAId);
  const docB = mediaList.find(m => m.id === docBId);

  // Text highlighting for common phrases
  const highlightPhrases = (text, phrases = []) => {
    if (!text || phrases.length === 0) return text;
    const safePhrases = phrases.filter(p => p.length >= 4).map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    if (safePhrases.length === 0) return text;

    const regex = new RegExp(`(${safePhrases.join('|')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="highlight-match bg-indigo-500/30 text-indigo-200 px-1 py-0.5 rounded font-medium">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-indigo-950/40 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-xs uppercase font-semibold text-indigo-400 tracking-wider">Module 2 Algorithm</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <GitCompare className="w-7 h-7 text-indigo-400" />
          <span>Document Similarity Analyzer</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Perform rigorous structural and token-level comparison between any two media documents using Suffix Arrays, Kasai LCP, and Vector Space Cosine Similarity.
        </p>
      </div>

      {/* Selector Controls Card */}
      <div className="p-5 rounded-2xl glass-panel space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Document A Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">Document A</label>
            <select
              value={docAId}
              onChange={(e) => setDocAId(e.target.value)}
              className="w-full bg-navy-900 border border-indigo-900/50 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {mediaList.map(m => (
                <option key={m.id} value={m.id}>
                  [{m.type.toUpperCase()}] {m.title.substring(0, 50)}... ({m.topic})
                </option>
              ))}
            </select>
          </div>

          {/* Document B Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">Document B</label>
            <select
              value={docBId}
              onChange={(e) => setDocBId(e.target.value)}
              className="w-full bg-navy-900 border border-indigo-900/50 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {mediaList.map(m => (
                <option key={m.id} value={m.id}>
                  [{m.type.toUpperCase()}] {m.title.substring(0, 50)}... ({m.topic})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-[11px] text-slate-400 font-mono">
            Comparing <span className="text-indigo-300">{docA?.title?.substring(0, 30)}...</span> with <span className="text-cyan-300">{docB?.title?.substring(0, 30)}...</span>
          </div>

          <button
            onClick={handleRunClick}
            disabled={isComputing}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/30 flex items-center gap-2"
          >
            {isComputing ? (
              <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
            ) : (
              <GitCompare className="w-4 h-4" />
            )}
            <span>Run Comparison</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      {comparisonResult && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in">
          {/* Blended Similarity */}
          <div className="p-4 rounded-2xl glass-card space-y-1">
            <span className="text-[11px] font-semibold uppercase text-slate-400">Blended Similarity</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-cyan-400 font-mono">
                {comparisonResult.similarityPercentage}%
              </span>
              <span className="text-xs text-slate-400">Overall Match</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-1.5 rounded-full transition-all duration-700"
                style={{ width: `${comparisonResult.similarityPercentage}%` }}
              />
            </div>
          </div>

          {/* Cosine Vector Similarity */}
          <div className="p-4 rounded-2xl glass-card space-y-1">
            <span className="text-[11px] font-semibold uppercase text-slate-400">Cosine Score</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-indigo-400 font-mono">
                {comparisonResult.cosineSimilarity}
              </span>
              <span className="text-xs text-slate-400">TF-IDF Vector</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Normalized Euclidean dot product</p>
          </div>

          {/* Jaccard Similarity */}
          <div className="p-4 rounded-2xl glass-card space-y-1">
            <span className="text-[11px] font-semibold uppercase text-slate-400">Jaccard Score</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-emerald-400 font-mono">
                {comparisonResult.jaccardSimilarity}
              </span>
              <span className="text-xs text-slate-400">Set Overlap</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Intersection over union of terms</p>
          </div>

          {/* Shared Term Count */}
          <div className="p-4 rounded-2xl glass-card space-y-1">
            <span className="text-[11px] font-semibold uppercase text-slate-400">Shared Vocabulary</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-amber-400 font-mono">
                {comparisonResult.sharedKeywordCount}
              </span>
              <span className="text-xs text-slate-400">Common words</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Computed in {comparisonResult.timeMs}ms</p>
          </div>
        </div>
      )}

      {/* Longest Common Phrase & Suffix Structure Insights */}
      {comparisonResult && (
        <div className="p-5 rounded-2xl glass-panel space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Extracted Substring & Phrase Invariants</span>
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              Suffix Array & Kasai LCP
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-navy-950/60 border border-indigo-900/40 space-y-1">
            <p className="text-[11px] font-semibold text-slate-400">Longest Common Substring (LCS):</p>
            <p className="text-xs font-mono text-cyan-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
              "{comparisonResult.longestCommonPhrase || 'No extended exact substring detected beyond 4 characters.'}"
            </p>
          </div>

          {comparisonResult.commonPhrases.length > 0 && (
            <div className="space-y-1 pt-1">
              <p className="text-[11px] font-semibold text-slate-400">Co-occurring Phrases:</p>
              <div className="flex flex-wrap gap-1.5">
                {comparisonResult.commonPhrases.map((phrase, pIdx) => (
                  <span key={pIdx} className="text-xs font-mono px-2.5 py-1 rounded-lg bg-indigo-900/30 text-indigo-300 border border-indigo-800/40">
                    "{phrase}"
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Shared and Unique Keywords Breakdown */}
      {comparisonResult && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Unique to Doc A */}
          <div className="p-4 rounded-2xl glass-panel space-y-2">
            <h4 className="text-xs font-bold text-slate-300">
              Unique to Document A ({comparisonResult.uniqueTermsA.length})
            </h4>
            <div className="flex flex-wrap gap-1 max-h-40 overflow-y-auto">
              {comparisonResult.uniqueTermsA.map((term, i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  {term}
                </span>
              ))}
            </div>
          </div>

          {/* Shared Terms with Counts */}
          <div className="p-4 rounded-2xl glass-panel space-y-2">
            <h4 className="text-xs font-bold text-cyan-400">
              Shared Intersecting Terms ({comparisonResult.sharedKeywordCount})
            </h4>
            <div className="flex flex-wrap gap-1 max-h-40 overflow-y-auto">
              {comparisonResult.sharedKeywords.slice(0, 30).map((item, i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/40 text-cyan-300 border border-cyan-800/40 font-mono">
                  {item.token} ({item.countA + item.countB})
                </span>
              ))}
            </div>
          </div>

          {/* Unique to Doc B */}
          <div className="p-4 rounded-2xl glass-panel space-y-2">
            <h4 className="text-xs font-bold text-slate-300">
              Unique to Document B ({comparisonResult.uniqueTermsB.length})
            </h4>
            <div className="flex flex-wrap gap-1 max-h-40 overflow-y-auto">
              {comparisonResult.uniqueTermsB.map((term, i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  {term}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side Content Comparison with Highlights */}
      {docA && docB && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white tracking-wide">Side-by-Side Content Comparison</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Document A Body */}
            <div className="p-5 rounded-2xl glass-panel space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-indigo-950/40">
                <span className="text-xs font-bold text-indigo-400 truncate max-w-[200px]">{docA.title}</span>
                <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-mono">
                  Doc A ({docA.type})
                </span>
              </div>
              <div className="text-xs text-slate-300 leading-relaxed font-sans max-h-96 overflow-y-auto whitespace-pre-line pr-2">
                {highlightPhrases(
                  docA.content || docA.transcript || docA.description,
                  [comparisonResult?.longestCommonPhrase, ...(comparisonResult?.commonPhrases || [])]
                )}
              </div>
            </div>

            {/* Document B Body */}
            <div className="p-5 rounded-2xl glass-panel space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-indigo-950/40">
                <span className="text-xs font-bold text-cyan-400 truncate max-w-[200px]">{docB.title}</span>
                <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono">
                  Doc B ({docB.type})
                </span>
              </div>
              <div className="text-xs text-slate-300 leading-relaxed font-sans max-h-96 overflow-y-auto whitespace-pre-line pr-2">
                {highlightPhrases(
                  docB.content || docB.transcript || docB.description,
                  [comparisonResult?.longestCommonPhrase, ...(comparisonResult?.commonPhrases || [])]
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
