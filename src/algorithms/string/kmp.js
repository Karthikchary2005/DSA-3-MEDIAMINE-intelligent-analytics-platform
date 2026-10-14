/**
 * Knuth-Morris-Pratt (KMP) Algorithm
 * Computes the Longest Proper Prefix which is also Suffix (LPS) table
 * and performs exact keyword/phrase matching in O(N + M) time.
 */

export function computeLPS(pattern) {
  const m = pattern.length;
  const lps = new Array(m).fill(0);
  const steps = [];
  let len = 0;
  let i = 1;

  steps.push({ i: 0, char: pattern[0], len: 0, lps: [...lps], explanation: 'Initialize LPS[0] = 0' });

  while (i < m) {
    if (pattern[i].toLowerCase() === pattern[len].toLowerCase()) {
      len++;
      lps[i] = len;
      steps.push({
        i,
        char: pattern[i],
        len,
        lps: [...lps],
        explanation: `Match at pattern[${i}] and pattern[${len - 1}] ('${pattern[i]}'). Increment length to ${len}.`
      });
      i++;
    } else {
      if (len !== 0) {
        const prevLen = len;
        len = lps[len - 1];
        steps.push({
          i,
          char: pattern[i],
          len,
          lps: [...lps],
          explanation: `Mismatch at pattern[${i}] ('${pattern[i]}') with pattern[${prevLen}]. Fall back to LPS[${prevLen - 1}] = ${len}.`
        });
      } else {
        lps[i] = 0;
        steps.push({
          i,
          char: pattern[i],
          len: 0,
          lps: [...lps],
          explanation: `Mismatch at pattern[${i}] ('${pattern[i]}') and len is 0. Set LPS[${i}] = 0.`
        });
        i++;
      }
    }
  }

  return { lps, steps };
}

export function kmpSearch(text, pattern, caseSensitive = false) {
  if (!pattern || !text) return { matches: [], steps: [], count: 0, timeMs: 0 };
  const startTime = performance.now();

  const t = caseSensitive ? text : text.toLowerCase();
  const p = caseSensitive ? pattern : pattern.toLowerCase();
  const n = t.length;
  const m = p.length;

  const { lps, steps: lpsSteps } = computeLPS(p);
  const matches = [];
  const searchSteps = [];

  let i = 0; // index for text
  let j = 0; // index for pattern

  while (i < n) {
    if (p[j] === t[i]) {
      searchSteps.push({
        i,
        j,
        textChar: text[i],
        patChar: pattern[j],
        status: 'match',
        explanation: `Character match at text[${i}] and pattern[${j}] ('${text[i]}')`
      });
      i++;
      j++;
    }

    if (j === m) {
      const matchIndex = i - j;
      matches.push(matchIndex);
      searchSteps.push({
        i,
        j,
        matchIndex,
        status: 'found',
        explanation: `Full pattern match found at index ${matchIndex}!`
      });
      j = lps[j - 1];
    } else if (i < n && p[j] !== t[i]) {
      searchSteps.push({
        i,
        j,
        textChar: text[i],
        patChar: pattern[j],
        status: 'mismatch',
        explanation: `Mismatch at text[${i}] ('${text[i]}') and pattern[${j}] ('${pattern[j]}')`
      });
      if (j !== 0) {
        j = lps[j - 1];
      } else {
        i++;
      }
    }
  }

  const timeMs = performance.now() - startTime;
  return {
    algorithm: 'Knuth-Morris-Pratt (KMP)',
    pattern,
    textLength: n,
    matches,
    count: matches.length,
    lps,
    lpsSteps,
    searchSteps: searchSteps.slice(0, 100), // Cap step trace to prevent memory bloat
    timeMs: parseFloat(timeMs.toFixed(3))
  };
}
