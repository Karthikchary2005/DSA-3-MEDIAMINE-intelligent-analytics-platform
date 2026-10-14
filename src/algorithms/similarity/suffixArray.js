/**
 * Suffix Array Construction
 * Sorts all suffixes of a text lexicographically.
 * Returns suffix array SA where SA[i] is the starting index of the i-th lexicographically smallest suffix.
 */

export function buildSuffixArray(text) {
  const n = text.length;
  // Array of suffix objects
  const suffixes = [];
  for (let i = 0; i < n; i++) {
    suffixes.push({
      index: i,
      suffix: text.substring(i)
    });
  }

  // Lexicographical sort
  suffixes.sort((a, b) => (a.suffix < b.suffix ? -1 : a.suffix > b.suffix ? 1 : 0));

  const sa = suffixes.map(s => s.index);

  return {
    text,
    suffixArray: sa,
    details: suffixes.map((s, rank) => ({
      rank,
      index: s.index,
      suffixPreview: s.suffix.length > 40 ? s.suffix.substring(0, 40) + '...' : s.suffix
    }))
  };
}
