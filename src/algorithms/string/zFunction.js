/**
 * Z-Function (Z-Algorithm)
 * Calculates the Z-array where Z[i] is the length of the longest common prefix
 * between S and the suffix of S starting at i.
 * Time complexity: O(N)
 */

export function computeZArray(s) {
  const n = s.length;
  const z = new Array(n).fill(0);
  const steps = [];
  let l = 0;
  let r = 0;

  for (let i = 1; i < n; i++) {
    let explanation = '';
    if (i <= r) {
      z[i] = Math.min(r - i + 1, z[i - l]);
      explanation = `i <= r (${i} <= ${r}), using cached prefix: z[${i}] = min(${r - i + 1}, z[${i - l}]) = ${z[i]}`;
    } else {
      explanation = `i > r (${i} > ${r}), starting fresh comparisons at index ${i}`;
    }

    while (i + z[i] < n && s[z[i]].toLowerCase() === s[i + z[i]].toLowerCase()) {
      z[i]++;
    }

    if (i + z[i] - 1 > r) {
      l = i;
      r = i + z[i] - 1;
      explanation += ` -> Updated interval [L, R] to [${l}, ${r}]`;
    }

    steps.push({
      i,
      char: s[i],
      val: z[i],
      l,
      r,
      explanation
    });
  }

  return { z, steps };
}

export function zSearch(text, pattern, caseSensitive = false) {
  if (!pattern || !text) return { matches: [], count: 0, timeMs: 0, z: [] };
  const startTime = performance.now();

  const sep = '$';
  const combined = (caseSensitive ? pattern : pattern.toLowerCase()) + 
                   sep + 
                   (caseSensitive ? text : text.toLowerCase());

  const { z, steps } = computeZArray(combined);
  const m = pattern.length;
  const matches = [];

  for (let i = m + 1; i < combined.length; i++) {
    if (z[i] === m) {
      matches.push(i - m - 1);
    }
  }

  const timeMs = performance.now() - startTime;
  return {
    algorithm: 'Z-Function',
    pattern,
    combinedString: combined.length > 80 ? combined.substring(0, 80) + '...' : combined,
    zArray: z,
    matches,
    count: matches.length,
    steps: steps.slice(0, 100),
    timeMs: parseFloat(timeMs.toFixed(3))
  };
}
