/**
 * Rabin-Karp Algorithm
 * Uses rolling hash with base 256 and prime modulus 1,000,000,007.
 * Includes collision verification to guarantee no false positives.
 */

export function rabinKarpSearch(text, pattern, caseSensitive = false) {
  if (!pattern || !text) return { matches: [], count: 0, steps: [], timeMs: 0 };
  const startTime = performance.now();

  const t = caseSensitive ? text : text.toLowerCase();
  const p = caseSensitive ? pattern : pattern.toLowerCase();
  const n = t.length;
  const m = p.length;

  if (m > n) return { matches: [], count: 0, steps: [], timeMs: 0 };

  const d = 256; // alphabet radix
  const q = 1000000007; // large prime
  let pHash = 0;
  let tHash = 0;
  let h = 1;

  // h = d^(m-1) % q
  for (let i = 0; i < m - 1; i++) {
    h = (h * d) % q;
  }

  // Initial pattern hash and first text window hash
  for (let i = 0; i < m; i++) {
    pHash = (d * pHash + p.charCodeAt(i)) % q;
    tHash = (d * tHash + t.charCodeAt(i)) % q;
  }

  const matches = [];
  const steps = [];
  let spuriousHits = 0;

  for (let i = 0; i <= n - m; i++) {
    const isHashMatch = pHash === tHash;
    let isExactMatch = false;

    if (isHashMatch) {
      // Verification step to prevent hash collision false positives
      isExactMatch = true;
      for (let j = 0; j < m; j++) {
        if (t[i + j] !== p[j]) {
          isExactMatch = false;
          spuriousHits++;
          break;
        }
      }
      if (isExactMatch) {
        matches.push(i);
      }
    }

    if (i < 50) { // Keep step logs manageable
      steps.push({
        windowIndex: i,
        windowSubstring: text.substring(i, i + m),
        patternHash: pHash,
        textWindowHash: tHash,
        hashMatch: isHashMatch,
        exactMatch: isExactMatch,
        explanation: isHashMatch
          ? (isExactMatch ? `Hash match (${tHash}) verified: exact match at index ${i}` : `Hash collision detected! Spurious hit.`)
          : `Hash mismatch (${tHash} !== ${pHash})`
      });
    }

    // Compute next rolling hash
    if (i < n - m) {
      tHash = (d * (tHash - t.charCodeAt(i) * h) + t.charCodeAt(i + m)) % q;
      if (tHash < 0) {
        tHash = (tHash + q) % q;
      }
    }
  }

  const timeMs = performance.now() - startTime;
  return {
    algorithm: 'Rabin-Karp Rolling Hash',
    pattern,
    patternHash: pHash,
    primeModulus: q,
    spuriousHits,
    matches,
    count: matches.length,
    steps,
    timeMs: parseFloat(timeMs.toFixed(3))
  };
}
