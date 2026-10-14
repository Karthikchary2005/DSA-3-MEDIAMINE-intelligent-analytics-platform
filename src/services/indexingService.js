/**
 * In-Browser Indexing Service
 * Constructs and maintains inverted indexes, token postings lists,
 * and an Aho-Corasick multi-keyword automaton over media tags and topics.
 */

import { getStoredMedia } from './storageService.js';
import { AhoCorasick } from '../algorithms/string/ahoCorasick.js';
import { tokenize } from '../algorithms/similarity/documentSimilarity.js';

class IndexingService {
  constructor() {
    this.invertedIndex = new Map(); // token -> Map(mediaId -> { score, fields: [] })
    this.allTagsAndTopics = [];
    this.ahoCorasickAutomaton = null;
    this.indexedCount = 0;
    this.lastIndexedTime = null;
    this.buildIndex();
  }

  buildIndex() {
    const startTime = performance.now();
    const mediaList = getStoredMedia();
    this.invertedIndex.clear();

    const tagTopicSet = new Set();

    mediaList.forEach(item => {
      // 1. Index Title (weight: 5.0)
      this.indexText(item.id, item.title, 'title', 5.0);

      // 2. Index Topic (weight: 4.0)
      if (item.topic) {
        this.indexText(item.id, item.topic, 'topic', 4.0);
        tagTopicSet.add(item.topic.toLowerCase());
      }

      // 3. Index Tags (weight: 3.5)
      if (item.tags && Array.isArray(item.tags)) {
        item.tags.forEach(tag => {
          this.indexText(item.id, tag, 'tag', 3.5);
          tagTopicSet.add(tag.toLowerCase());
        });
      }

      // 4. Index Description / Headline (weight: 2.0)
      if (item.description || item.headline) {
        this.indexText(item.id, (item.description || '') + ' ' + (item.headline || ''), 'description', 2.0);
      }

      // 5. Index Author & Source (weight: 2.5)
      if (item.author) this.indexText(item.id, item.author, 'author', 2.5);
      if (item.source) this.indexText(item.id, item.source, 'source', 2.0);

      // 6. Index Main Content (weight: 1.0)
      if (item.content) {
        this.indexText(item.id, item.content, 'content', 1.0);
      }

      // 7. Index Transcript & Captions (weight: 1.5)
      if (item.transcript) {
        this.indexText(item.id, item.transcript, 'transcript', 1.5);
      }
      if (item.captions && Array.isArray(item.captions)) {
        const captionText = item.captions.map(c => c.text).join(' ');
        this.indexText(item.id, captionText, 'captions', 1.5);
      }
    });

    this.allTagsAndTopics = Array.from(tagTopicSet);
    this.ahoCorasickAutomaton = new AhoCorasick(this.allTagsAndTopics);
    this.indexedCount = mediaList.length;
    this.lastIndexedTime = new Date().toISOString();

    const elapsed = (performance.now() - startTime).toFixed(2);
    console.log(`[MediaMine IndexingService] Indexed ${this.indexedCount} media items in ${elapsed}ms. Vocabulary tokens: ${this.invertedIndex.size}`);
  }

  indexText(mediaId, text, fieldName, weight) {
    if (!text) return;
    const tokens = tokenize(text);

    tokens.forEach(token => {
      if (!this.invertedIndex.has(token)) {
        this.invertedIndex.set(token, new Map());
      }
      const postings = this.invertedIndex.get(token);
      if (!postings.has(mediaId)) {
        postings.set(mediaId, { score: 0, fields: new Set() });
      }
      const record = postings.get(mediaId);
      record.score += weight;
      record.fields.add(fieldName);
    });
  }

  // Lookup documents matching tokens
  searchTokens(tokens) {
    const docScores = new Map(); // mediaId -> { score, matchedTokens: Set, matchedFields: Set }

    tokens.forEach(token => {
      const cleanToken = token.toLowerCase();

      // Exact token lookup
      if (this.invertedIndex.has(cleanToken)) {
        const postings = this.invertedIndex.get(cleanToken);
        postings.forEach((data, mediaId) => {
          if (!docScores.has(mediaId)) {
            docScores.set(mediaId, { score: 0, matchedTokens: new Set(), matchedFields: new Set() });
          }
          const entry = docScores.get(mediaId);
          entry.score += data.score;
          entry.matchedTokens.add(cleanToken);
          data.fields.forEach(f => entry.matchedFields.add(f));
        });
      }

      // Prefix / Partial match lookup if token length >= 4
      if (cleanToken.length >= 4) {
        for (const [indexedToken, postings] of this.invertedIndex.entries()) {
          if (indexedToken !== cleanToken && indexedToken.startsWith(cleanToken)) {
            postings.forEach((data, mediaId) => {
              if (!docScores.has(mediaId)) {
                docScores.set(mediaId, { score: 0, matchedTokens: new Set(), matchedFields: new Set() });
              }
              const entry = docScores.get(mediaId);
              entry.score += data.score * 0.5; // partial match discount
              entry.matchedTokens.add(indexedToken);
              data.fields.forEach(f => entry.matchedFields.add(f));
            });
          }
        }
      }
    });

    return docScores;
  }

  getIndexStats() {
    return {
      indexedDocuments: this.indexedCount,
      uniqueTokens: this.invertedIndex.size,
      allTopicsAndTags: this.allTagsAndTopics.length,
      lastIndexedTime: this.lastIndexedTime
    };
  }
}

export const indexingService = new IndexingService();

// Auto-rebuild on data updates
if (typeof window !== 'undefined') {
  window.addEventListener('mediamine:data-updated', () => {
    indexingService.buildIndex();
  });
}
