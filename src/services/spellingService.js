/**
 * Spelling Correction and Query Suggestion Service
 * Uses Damerau-Levenshtein distance to detect transpositions, insertions, deletions,
 * and substitutions against a domain vocabulary extracted dynamically from the media corpus.
 */

import { damerauLevenshteinDistance } from '../algorithms/dynamicProgramming/damerauLevenshtein.js';
import { getStoredMedia } from './storageService.js';

// Canonical high-frequency domain phrases for multi-word spelling normalization
const CANONICAL_PHRASES = [
  'machine learning',
  'deep learning',
  'artificial intelligence',
  'neural networks',
  'large language models',
  'generative ai',
  'computer vision',
  'natural language processing',
  'data structures and algorithms',
  'cloud computing',
  'cybersecurity',
  'software engineering',
  'data science',
  'python programming course',
  'latest technology news',
  'ai applications in healthcare',
  'reinforcement learning',
  'suffix array',
  'network flow',
  'virtual threads'
];

class SpellingService {
  constructor() {
    this.vocabulary = new Set();
    this.wordFrequency = new Map();
    this.initVocabulary();
  }

  initVocabulary() {
    this.vocabulary.clear();
    this.wordFrequency.clear();

    const mediaList = getStoredMedia();

    // Add canonical phrases and their constituent words
    CANONICAL_PHRASES.forEach(phrase => {
      this.vocabulary.add(phrase.toLowerCase());
      phrase.split(/\s+/).forEach(word => {
        if (word.length > 2) {
          const w = word.toLowerCase();
          this.vocabulary.add(w);
          this.wordFrequency.set(w, (this.wordFrequency.get(w) || 0) + 10);
        }
      });
    });

    // Extract all tokens from stored media
    mediaList.forEach(item => {
      const textToExtract = [
        item.title,
        item.topic,
        ...(item.tags || []),
        item.description || '',
        item.author || '',
        item.source || ''
      ].join(' ').toLowerCase();

      // Extract words
      const words = textToExtract.replace(/[^\w\s-]/g, ' ').split(/\s+/);
      words.forEach(w => {
        if (w.length > 2) {
          this.vocabulary.add(w);
          this.wordFrequency.set(w, (this.wordFrequency.get(w) || 0) + 1);
        }
      });
    });
  }

  // Suggest correction for a single word
  suggestWord(word) {
    const clean = word.toLowerCase().trim();
    if (!clean || this.vocabulary.has(clean)) {
      return { word: clean, corrected: false };
    }

    let bestMatch = clean;
    let minDistance = Infinity;
    let maxFreq = -1;

    for (const vocabWord of this.vocabulary) {
      // Don't compare single words against long multi-word phrases here
      if (vocabWord.includes(' ')) continue;

      // Length filter heuristic: skip candidates that differ by more than 2 chars
      if (Math.abs(vocabWord.length - clean.length) > 2) continue;

      const { distance } = damerauLevenshteinDistance(clean, vocabWord);

      if (distance <= 2) {
        const freq = this.wordFrequency.get(vocabWord) || 0;
        if (distance < minDistance || (distance === minDistance && freq > maxFreq)) {
          minDistance = distance;
          maxFreq = freq;
          bestMatch = vocabWord;
        }
      }
    }

    if (minDistance <= 2 && bestMatch !== clean) {
      return { word: bestMatch, original: clean, distance: minDistance, corrected: true };
    }

    return { word: clean, corrected: false };
  }

  // Suggest correction for an entire query (multi-word phrase or tokens)
  suggestQuery(query) {
    if (!query || !query.trim()) return { suggestedQuery: query, wasCorrected: false };
    const cleanQuery = query.toLowerCase().trim();

    // Check if query exactly matches a canonical phrase or vocabulary entry
    if (this.vocabulary.has(cleanQuery)) {
      return { suggestedQuery: cleanQuery, wasCorrected: false };
    }

    // Check full-phrase similarity against canonical phrases first
    let bestPhrase = null;
    let minPhraseDist = Infinity;

    for (const phrase of CANONICAL_PHRASES) {
      // If length difference is small
      if (Math.abs(phrase.length - cleanQuery.length) <= 3) {
        const { distance } = damerauLevenshteinDistance(cleanQuery, phrase);
        if (distance <= 3 && distance < minPhraseDist) {
          minPhraseDist = distance;
          bestPhrase = phrase;
        }
      }
    }

    if (bestPhrase && minPhraseDist <= 3) {
      return {
        originalQuery: query,
        suggestedQuery: bestPhrase,
        wasCorrected: true,
        editDistance: minPhraseDist,
        algorithm: 'Damerau-Levenshtein Phrase Matching'
      };
    }

    // Otherwise, check token-by-token
    const tokens = cleanQuery.split(/\s+/);
    let anyCorrected = false;
    let totalDistance = 0;

    const correctedTokens = tokens.map(token => {
      const result = this.suggestWord(token);
      if (result.corrected) {
        anyCorrected = true;
        totalDistance += result.distance;
        return result.word;
      }
      return token;
    });

    const combinedSuggestion = correctedTokens.join(' ');

    return {
      originalQuery: query,
      suggestedQuery: anyCorrected ? combinedSuggestion : query,
      wasCorrected: anyCorrected,
      editDistance: totalDistance,
      algorithm: 'Damerau-Levenshtein Token Distance'
    };
  }
}

export const spellingService = new SpellingService();

// Re-initialize vocabulary when media items update
if (typeof window !== 'undefined') {
  window.addEventListener('mediamine:data-updated', () => {
    spellingService.initVocabulary();
  });
}
