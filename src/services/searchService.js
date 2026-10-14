/**
 * Intelligent Media Search Service
 * Orchestrates KMP, Rabin-Karp, Aho-Corasick, Token Indexing, and Damerau-Levenshtein spelling correction.
 * Computes multi-signal relevance scoring and generates snippet highlights.
 */

import { getStoredMedia, recordSearchHistory, recordAnalyticsEvent } from './storageService.js';
import { indexingService } from './indexingService.js';
import { spellingService } from './spellingService.js';
import { kmpSearch } from '../algorithms/string/kmp.js';
import { rabinKarpSearch } from '../algorithms/string/rabinKarp.js';
import { ahoCorasickMultiSearch } from '../algorithms/string/ahoCorasick.js';
import { tokenize } from '../algorithms/similarity/documentSimilarity.js';

export function executeSearch(query, options = {}) {
  const startTime = performance.now();
  const rawQuery = (query || '').trim();

  const {
    typeFilter = 'all',
    topicFilter = 'all',
    sortBy = 'relevance', // 'relevance', 'newest', 'oldest', 'title'
    minSimilarity = 0,    // 0 to 100
    forceOriginal = false // if user clicked "Search instead for: <original>"
  } = options;

  const allMedia = getStoredMedia();

  if (!rawQuery) {
    // If query is empty, apply filters and return default list sorted by date
    let filtered = filterMedia(allMedia, typeFilter, topicFilter);
    filtered = sortMedia(filtered, sortBy);
    return {
      query: '',
      correctedQuery: null,
      wasCorrected: false,
      results: filtered.map(item => ({ item, relevanceScore: 100, matchSignals: ['Browse View'], algorithmsUsed: ['Default Index'] })),
      totalResults: filtered.length,
      timeMs: parseFloat((performance.now() - startTime).toFixed(2)),
      algorithmsUsed: ['Catalog Index']
    };
  }

  // Check spelling correction unless user clicked "Search instead for original"
  let effectiveQuery = rawQuery;
  let spellingInfo = null;

  if (!forceOriginal) {
    const correctionResult = spellingService.suggestQuery(rawQuery);
    if (correctionResult.wasCorrected && correctionResult.suggestedQuery.toLowerCase() !== rawQuery.toLowerCase()) {
      effectiveQuery = correctionResult.suggestedQuery;
      spellingInfo = {
        originalQuery: rawQuery,
        suggestedQuery: effectiveQuery,
        editDistance: correctionResult.editDistance,
        algorithm: correctionResult.algorithm
      };
    }
  }

  const queryTokens = tokenize(effectiveQuery);
  const queryLower = effectiveQuery.toLowerCase();
  const algorithmsUsed = new Set();

  // 1. Inverted Index Lookup
  const tokenMatches = indexingService.searchTokens(queryTokens);
  algorithmsUsed.add('Inverted Token Index');

  // 2. Multi-pattern scan via Aho-Corasick on query tokens
  if (queryTokens.length > 1) {
    algorithmsUsed.add('Aho-Corasick Multi-Pattern');
  }

  // 3. Exact phrase match with KMP or Rabin-Karp if multi-word
  const checkExactPhrase = effectiveQuery.includes(' ') || effectiveQuery.length >= 5;
  if (checkExactPhrase) {
    algorithmsUsed.add('Knuth-Morris-Pratt (KMP)');
    algorithmsUsed.add('Rabin-Karp Rolling Hash');
  }

  // Score each media item
  const scoredItems = [];

  allMedia.forEach(item => {
    let score = 0;
    const matchSignals = [];
    const matchedKeywords = new Set();

    // Check type and topic filter early
    if (typeFilter !== 'all' && item.type.toLowerCase() !== typeFilter.toLowerCase()) {
      return;
    }
    if (topicFilter !== 'all' && item.topic.toLowerCase() !== topicFilter.toLowerCase()) {
      return;
    }

    const titleLower = item.title.toLowerCase();
    const topicLower = (item.topic || '').toLowerCase();
    const tagsLower = (item.tags || []).map(t => t.toLowerCase());
    const descLower = (item.description || item.headline || '').toLowerCase();
    const contentLower = (item.content || '').toLowerCase();
    const transcriptLower = (item.transcript || '').toLowerCase();

    // Full text container for KMP / Rabin-Karp searches
    const fullText = `${item.title} ${item.topic} ${(item.tags || []).join(' ')} ${descLower} ${contentLower} ${transcriptLower}`;

    // Signal A: Exact Full Phrase Match in Title (Massive boost: +60)
    if (titleLower.includes(queryLower)) {
      score += 60;
      matchSignals.push('Exact Title Match');
      matchedKeywords.add(effectiveQuery);
    } else if (checkExactPhrase) {
      // Use KMP to test exact phrase in fullText
      const kmpRes = kmpSearch(fullText, effectiveQuery);
      if (kmpRes.count > 0) {
        score += 35 * Math.min(3, kmpRes.count);
        matchSignals.push(`Exact Phrase Match (${kmpRes.count}x via KMP)`);
        matchedKeywords.add(effectiveQuery);
      } else {
        // Double-check with Rabin-Karp rolling hash for verification
        const rkRes = rabinKarpSearch(fullText, effectiveQuery);
        if (rkRes.count > 0) {
          score += 35;
          matchSignals.push('Rabin-Karp Substring Verification');
          matchedKeywords.add(effectiveQuery);
        }
      }
    }

    // Signal B: Topic Match (+30)
    if (topicLower.includes(queryLower) || queryTokens.some(qt => topicLower.includes(qt))) {
      score += 30;
      matchSignals.push('Category Topic Match');
      matchedKeywords.add(item.topic);
    }

    // Signal C: Tag Matches (+20 per tag)
    tagsLower.forEach(tag => {
      if (tag.includes(queryLower)) {
        score += 25;
        matchSignals.push(`Direct Tag Match: "${tag}"`);
        matchedKeywords.add(tag);
      } else if (queryTokens.some(qt => tag.includes(qt))) {
        score += 15;
        matchSignals.push(`Related Tag: "${tag}"`);
        matchedKeywords.add(tag);
      }
    });

    // Signal D: Inverted Token Index Score
    if (tokenMatches.has(item.id)) {
      const idxData = tokenMatches.get(item.id);
      score += idxData.score * 3.5;
      idxData.matchedTokens.forEach(t => matchedKeywords.add(t));
      const fieldList = Array.from(idxData.matchedFields).join(', ');
      matchSignals.push(`Token matches in: ${fieldList}`);
    }

    // Signal E: Query intent type boost (e.g. "course" boosts course type, "news" boosts news type)
    if (queryLower.includes('course') && item.type === 'course') {
      score += 30;
      matchSignals.push('Intent Match: Educational Course');
    }
    if ((queryLower.includes('news') || queryLower.includes('latest')) && item.type === 'news') {
      score += 30;
      matchSignals.push('Intent Match: Industry News');
    }
    if ((queryLower.includes('video') || queryLower.includes('watch')) && item.type === 'video') {
      score += 30;
      matchSignals.push('Intent Match: Video Media');
    }
    if ((queryLower.includes('research') || queryLower.includes('paper') || queryLower.includes('proof')) && item.type === 'research') {
      score += 30;
      matchSignals.push('Intent Match: Scholarly Research');
    }

    // Signal F: Aho-Corasick multi-tag detection in item text
    if (queryTokens.length > 1) {
      const ahoRes = ahoCorasickMultiSearch(item.title + ' ' + (item.description || ''), queryTokens);
      if (ahoRes.matchCount > 0) {
        score += ahoRes.matchCount * 8;
      }
    }

    if (score > 0) {
      // Normalize score between 0 and 100 for display
      const normalizedScore = Math.min(100, Math.max(15, Math.round(score * 1.4)));
      if (normalizedScore >= minSimilarity) {
        // Extract snippet with matched context
        const snippet = extractSnippet(item, Array.from(matchedKeywords));

        scoredItems.push({
          item,
          relevanceScore: normalizedScore,
          matchSignals: matchSignals.slice(0, 4),
          matchedKeywords: Array.from(matchedKeywords).slice(0, 6),
          snippet,
          algorithmsUsed: Array.from(algorithmsUsed)
        });
      }
    }
  });

  // Sort results
  const sorted = sortScoredResults(scoredItems, sortBy);

  const durationMs = parseFloat((performance.now() - startTime).toFixed(2));

  // Record history & analytics
  recordSearchHistory(rawQuery, sorted.length);
  recordAnalyticsEvent({
    query: rawQuery,
    results: sorted.length,
    hadCorrection: !!spellingInfo,
    correctedTo: spellingInfo ? effectiveQuery : null,
    timeMs: durationMs
  });

  return {
    query: rawQuery,
    effectiveQuery,
    spellingInfo,
    results: sorted,
    totalResults: sorted.length,
    timeMs: durationMs,
    algorithmsUsed: Array.from(algorithmsUsed)
  };
}

// Helpers
function filterMedia(mediaList, typeFilter, topicFilter) {
  return mediaList.filter(item => {
    if (typeFilter !== 'all' && item.type.toLowerCase() !== typeFilter.toLowerCase()) return false;
    if (topicFilter !== 'all' && item.topic.toLowerCase() !== topicFilter.toLowerCase()) return false;
    return true;
  });
}

function sortMedia(mediaList, sortBy) {
  const list = [...mediaList];
  if (sortBy === 'newest') {
    return list.sort((a, b) => new Date(b.publishedAt || b.createdAt || 0) - new Date(a.publishedAt || a.createdAt || 0));
  }
  if (sortBy === 'oldest') {
    return list.sort((a, b) => new Date(a.publishedAt || a.createdAt || 0) - new Date(b.publishedAt || b.createdAt || 0));
  }
  if (sortBy === 'title') {
    return list.sort((a, b) => a.title.localeCompare(b.title));
  }
  return list;
}

function sortScoredResults(scoredList, sortBy) {
  const list = [...scoredList];
  if (sortBy === 'newest') {
    return list.sort((a, b) => new Date(b.item.publishedAt || 0) - new Date(a.item.publishedAt || 0));
  }
  if (sortBy === 'oldest') {
    return list.sort((a, b) => new Date(a.item.publishedAt || 0) - new Date(b.item.publishedAt || 0));
  }
  if (sortBy === 'title') {
    return list.sort((a, b) => a.item.title.localeCompare(b.item.title));
  }
  // Default: by relevance score descending
  return list.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

function extractSnippet(item, keywords) {
  const text = item.description || item.content || item.transcript || item.headline || '';
  if (!text) return '';
  if (keywords.length === 0) {
    return text.length > 160 ? text.substring(0, 160) + '...' : text;
  }

  // Find index of first matched keyword
  let bestIdx = -1;
  const lowerText = text.toLowerCase();
  for (const kw of keywords) {
    const idx = lowerText.indexOf(kw.toLowerCase());
    if (idx !== -1) {
      bestIdx = idx;
      break;
    }
  }

  if (bestIdx === -1) {
    return text.length > 160 ? text.substring(0, 160) + '...' : text;
  }

  const start = Math.max(0, bestIdx - 60);
  const end = Math.min(text.length, bestIdx + 120);
  const prefix = start > 0 ? '...' : '';
  const suffix = end < text.length ? '...' : '';

  return prefix + text.substring(start, end).trim() + suffix;
}
