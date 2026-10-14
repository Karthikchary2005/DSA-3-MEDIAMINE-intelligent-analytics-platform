/**
 * Local Storage Management Service
 * Handles persistence for media records, bookmarks, search history, user sessions, and analytics.
 * Fully safe with in-memory fallback for headless or node test environments.
 */

import { INITIAL_MEDIA } from '../data/initialMedia.js';
import { DEMO_USERS } from '../data/demoUsers.js';

const STORAGE_KEYS = {
  MEDIA: 'mediamine_media_records',
  BOOKMARKS: 'mediamine_bookmarks',
  HISTORY: 'mediamine_search_history',
  ANALYTICS: 'mediamine_search_analytics',
  SESSION: 'mediamine_user_session',
  THEME: 'mediamine_theme'
};

// Memory fallback store for non-browser environments
const memoryStore = new Map();

function safeGetItem(key) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
    return memoryStore.get(key) || null;
  } catch (e) {
    return memoryStore.get(key) || null;
  }
}

function safeSetItem(key, value) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
      return;
    }
    memoryStore.set(key, value);
  } catch (e) {
    memoryStore.set(key, value);
  }
}

function safeRemoveItem(key) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
      return;
    }
    memoryStore.delete(key);
  } catch (e) {
    memoryStore.delete(key);
  }
}

function dispatchCustomEvent(name) {
  if (typeof window !== 'undefined' && window.dispatchEvent) {
    window.dispatchEvent(new CustomEvent(name));
  }
}

// Initialize media records if not already populated
export function getStoredMedia() {
  try {
    const raw = safeGetItem(STORAGE_KEYS.MEDIA);
    if (!raw) {
      safeSetItem(STORAGE_KEYS.MEDIA, JSON.stringify(INITIAL_MEDIA));
      return INITIAL_MEDIA;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_MEDIA;
  } catch (err) {
    return INITIAL_MEDIA;
  }
}

export function saveStoredMedia(records) {
  try {
    safeSetItem(STORAGE_KEYS.MEDIA, JSON.stringify(records));
    dispatchCustomEvent('mediamine:data-updated');
  } catch (err) {
    console.error('Error saving media to storage:', err);
  }
}

export function resetStoredMediaToDefault() {
  safeSetItem(STORAGE_KEYS.MEDIA, JSON.stringify(INITIAL_MEDIA));
  dispatchCustomEvent('mediamine:data-updated');
  return INITIAL_MEDIA;
}

// Bookmarks
export function getBookmarks() {
  try {
    const raw = safeGetItem(STORAGE_KEYS.BOOKMARKS);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

export function toggleBookmark(mediaId) {
  const current = getBookmarks();
  let updated;
  if (current.includes(mediaId)) {
    updated = current.filter(id => id !== mediaId);
  } else {
    updated = [mediaId, ...current];
  }
  safeSetItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
  dispatchCustomEvent('mediamine:bookmarks-updated');
  return updated;
}

export function isBookmarked(mediaId) {
  return getBookmarks().includes(mediaId);
}

// Search History
export function getSearchHistory() {
  try {
    const raw = safeGetItem(STORAGE_KEYS.HISTORY);
    return raw ? JSON.parse(raw) : [
      { query: 'artificial intelligence', timestamp: new Date(Date.now() - 3600000).toISOString(), count: 12 },
      { query: 'machine learning', timestamp: new Date(Date.now() - 7200000).toISOString(), count: 15 },
      { query: 'neural networks', timestamp: new Date(Date.now() - 14400000).toISOString(), count: 8 },
      { query: 'python programming course', timestamp: new Date(Date.now() - 86400000).toISOString(), count: 6 },
      { query: 'deep learning', timestamp: new Date(Date.now() - 172800000).toISOString(), count: 10 }
    ];
  } catch (err) {
    return [];
  }
}

export function recordSearchHistory(query, resultsCount = 0) {
  if (!query || !query.trim()) return;
  const history = getSearchHistory();
  const clean = query.trim();
  const filtered = history.filter(h => h.query.toLowerCase() !== clean.toLowerCase());
  const updated = [
    { query: clean, timestamp: new Date().toISOString(), count: resultsCount },
    ...filtered
  ].slice(0, 30);
  safeSetItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
}

export function clearSearchHistory() {
  safeRemoveItem(STORAGE_KEYS.HISTORY);
  dispatchCustomEvent('mediamine:history-updated');
}

// Analytics Events
export function getAnalyticsEvents() {
  try {
    const raw = safeGetItem(STORAGE_KEYS.ANALYTICS);
    return raw ? JSON.parse(raw) : [
      { query: 'artificial intelligence', results: 14, timestamp: new Date(Date.now() - 1000000).toISOString(), hadCorrection: false },
      { query: 'machin lerning', results: 12, timestamp: new Date(Date.now() - 2000000).toISOString(), hadCorrection: true, correctedTo: 'machine learning' },
      { query: 'deep lerning', results: 11, timestamp: new Date(Date.now() - 3000000).toISOString(), hadCorrection: true, correctedTo: 'deep learning' },
      { query: 'neural networks', results: 9, timestamp: new Date(Date.now() - 4000000).toISOString(), hadCorrection: false },
      { query: 'python programming course', results: 7, timestamp: new Date(Date.now() - 5000000).toISOString(), hadCorrection: false },
      { query: 'computer vision and deep learning', results: 8, timestamp: new Date(Date.now() - 6000000).toISOString(), hadCorrection: false }
    ];
  } catch (err) {
    return [];
  }
}

export function recordAnalyticsEvent(event) {
  const events = getAnalyticsEvents();
  events.unshift({
    ...event,
    timestamp: new Date().toISOString()
  });
  safeSetItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(events.slice(0, 200)));
}

// User Session
export function getCurrentSession() {
  try {
    const raw = safeGetItem(STORAGE_KEYS.SESSION);
    if (raw) return JSON.parse(raw);
    const defaultUser = DEMO_USERS[0];
    safeSetItem(STORAGE_KEYS.SESSION, JSON.stringify(defaultUser));
    return defaultUser;
  } catch (err) {
    return DEMO_USERS[0];
  }
}

export function setCurrentSession(user) {
  safeSetItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
  dispatchCustomEvent('mediamine:session-updated');
}

export function clearSession() {
  safeRemoveItem(STORAGE_KEYS.SESSION);
  dispatchCustomEvent('mediamine:session-updated');
}
