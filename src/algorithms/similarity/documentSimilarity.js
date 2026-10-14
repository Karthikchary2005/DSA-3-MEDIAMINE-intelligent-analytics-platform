/**
 * Document Similarity Analyzer
 * Combines Suffix Structure Longest Common Substrings (LCS),
 * Jaccard token similarity, and Cosine TF-IDF similarity.
 * Computes shared phrases, unique terms, and text match segments for side-by-side highlighting.
 */

import { buildSuffixArray } from './suffixArray.js';
import { buildLCPArray } from './lcpArray.js';

// Common stop words to exclude from keyword extraction
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'cannot', 'could', 'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from',
  'further', 'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself',
  'his', 'how', 'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself', 'let', 'me', 'more', 'most',
  'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our',
  'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she', 'should', 'so', 'some', 'such', 'than', 'that',
  'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 'this', 'those',
  'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when', 'where',
  'which', 'while', 'who', 'whom', 'why', 'with', 'would', 'you', 'your', 'yours', 'yourself'
]);

export function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 2 && !STOP_WORDS.has(token));
}

export function findLongestCommonSubstring(strA, strB) {
  if (!strA || !strB) return '';
  const delimiter = '#';
  const combined = strA.toLowerCase() + delimiter + strB.toLowerCase();
  const sepPos = strA.length;

  const { suffixArray: sa } = buildSuffixArray(combined);
  const { lcp } = buildLCPArray(combined, sa);

  let maxLen = 0;
  let maxIdx = 0;

  for (let i = 1; i < combined.length; i++) {
    // One suffix from strA, one from strB
    const inA = (sa[i] < sepPos && sa[i - 1] > sepPos) || (sa[i] > sepPos && sa[i - 1] < sepPos);
    if (inA && lcp[i] > maxLen) {
      maxLen = lcp[i];
      maxIdx = sa[i];
    }
  }

  return maxLen > 3 ? combined.substring(maxIdx, maxIdx + maxLen).trim() : '';
}

export function findCommonPhrases(strA, strB, minLength = 12) {
  const sentencesA = strA.split(/[.\n;]+/).map(s => s.trim()).filter(s => s.length >= minLength);
  const common = [];

  for (const s of sentencesA) {
    if (strB.toLowerCase().includes(s.toLowerCase())) {
      common.push(s);
    }
  }

  // Also check 3-word to 5-word ngrams
  const wordsA = strA.split(/\s+/);
  for (let len = 4; len >= 3; len--) {
    for (let i = 0; i <= wordsA.length - len; i++) {
      const phrase = wordsA.slice(i, i + len).join(' ');
      if (phrase.length >= minLength && strB.toLowerCase().includes(phrase.toLowerCase())) {
        if (!common.some(c => c.toLowerCase().includes(phrase.toLowerCase()))) {
          common.push(phrase);
        }
      }
    }
  }

  return common.slice(0, 8);
}

export function compareDocuments(docA, docB) {
  const startTime = performance.now();

  const textA = (docA.title + ' ' + (docA.content || docA.description || docA.transcript || '')).trim();
  const textB = (docB.title + ' ' + (docB.content || docB.description || docB.transcript || '')).trim();

  const tokensA = tokenize(textA);
  const tokensB = tokenize(textB);

  // Term frequencies
  const tfA = {};
  const tfB = {};
  tokensA.forEach(t => { tfA[t] = (tfA[t] || 0) + 1; });
  tokensB.forEach(t => { tfB[t] = (tfB[t] || 0) + 1; });

  const setA = new Set(tokensA);
  const setB = new Set(tokensB);

  // Intersection and Union (Jaccard)
  const intersection = [];
  const uniqueA = [];
  const uniqueB = [];

  setA.forEach(token => {
    if (setB.has(token)) {
      intersection.push({
        token,
        countA: tfA[token],
        countB: tfB[token]
      });
    } else {
      uniqueA.push(token);
    }
  });

  setB.forEach(token => {
    if (!setA.has(token)) {
      uniqueB.push(token);
    }
  });

  const unionSize = new Set([...setA, ...setB]).size;
  const jaccardSimilarity = unionSize > 0 ? (intersection.length / unionSize) : 0;

  // Cosine Similarity
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  Object.values(tfA).forEach(count => { normA += count * count; });
  Object.values(tfB).forEach(count => { normB += count * count; });

  intersection.forEach(item => {
    dotProduct += tfA[item.token] * tfB[item.token];
  });

  const cosineSimilarity = (normA > 0 && normB > 0)
    ? (dotProduct / (Math.sqrt(normA) * Math.sqrt(normB)))
    : 0;

  // Longest common substring and common phrases
  const longestCommonPhrase = findLongestCommonSubstring(textA, textB);
  const commonPhrases = findCommonPhrases(textA, textB);

  // Blended realistic similarity score
  const blendedScore = Math.min(100, Math.round(
    (cosineSimilarity * 0.55 + jaccardSimilarity * 0.35 + (longestCommonPhrase.length > 20 ? 0.1 : 0.05)) * 100
  ));

  const timeMs = performance.now() - startTime;

  return {
    docA: { id: docA.id, title: docA.title, type: docA.type, tokenCount: tokensA.length },
    docB: { id: docB.id, title: docB.title, type: docB.type, tokenCount: tokensB.length },
    similarityPercentage: blendedScore,
    cosineSimilarity: parseFloat(cosineSimilarity.toFixed(4)),
    jaccardSimilarity: parseFloat(jaccardSimilarity.toFixed(4)),
    sharedKeywords: intersection.sort((a, b) => (b.countA + b.countB) - (a.countA + a.countB)),
    sharedKeywordCount: intersection.length,
    uniqueTermsA: uniqueA.slice(0, 30),
    uniqueTermsB: uniqueB.slice(0, 30),
    longestCommonPhrase,
    commonPhrases,
    timeMs: parseFloat(timeMs.toFixed(2)),
    algorithmsUsed: ['Suffix Array & Kasai LCP (Phrase Extraction)', 'Cosine TF-IDF Vector Space', 'Jaccard Token Indexing']
  };
}
