/**
 * Damerau-Levenshtein Distance
 * Computes edit distance allowing:
 * 1. Insertions
 * 2. Deletions
 * 3. Substitutions
 * 4. Transpositions of two adjacent characters
 */

export function damerauLevenshteinDistance(source, target) {
  const s = source.toLowerCase();
  const t = target.toLowerCase();
  const m = s.length;
  const n = t.length;

  if (m === 0) return { distance: n, similarity: 0 };
  if (n === 0) return { distance: m, similarity: 0 };

  const d = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) d[i][0] = i;
  for (let j = 0; j <= n; j++) d[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s[i - 1] === t[j - 1] ? 0 : 1;

      d[i][j] = Math.min(
        d[i - 1][j] + 1,       // deletion
        d[i][j - 1] + 1,       // insertion
        d[i - 1][j - 1] + cost // substitution
      );

      // Transposition check
      if (i > 1 && j > 1 && s[i - 1] === t[j - 2] && s[i - 2] === t[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }

  const distance = d[m][n];
  const maxLen = Math.max(m, n);
  const similarity = maxLen > 0 ? (1 - distance / maxLen) : 1;

  return {
    source,
    target,
    distance,
    similarity: parseFloat(similarity.toFixed(4)),
    matrix: d
  };
}
