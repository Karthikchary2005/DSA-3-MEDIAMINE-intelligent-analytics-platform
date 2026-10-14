/**
 * Kasai's Algorithm for Longest Common Prefix (LCP) Array
 * Given text and its Suffix Array (SA), computes the LCP array in O(N) time.
 * LCP[i] stores the length of the longest common prefix between suffix SA[i] and suffix SA[i-1].
 */

export function buildLCPArray(text, sa) {
  const n = text.length;
  const rank = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    rank[sa[i]] = i;
  }

  const lcp = new Array(n).fill(0);
  let k = 0;
  const steps = [];

  for (let i = 0; i < n; i++) {
    if (rank[i] === 0) {
      lcp[0] = 0;
      continue;
    }

    const j = sa[rank[i] - 1]; // preceding suffix in suffix array order

    while (i + k < n && j + k < n && text[i + k] === text[j + k]) {
      k++;
    }

    lcp[rank[i]] = k;

    if (steps.length < 50) {
      steps.push({
        i,
        precedingSuffixIndex: j,
        rank: rank[i],
        lcpValue: k,
        commonPrefix: text.substring(i, i + k),
        explanation: `Comparing suffix at ${i} ("${text.substring(i, Math.min(n, i + 15))}...") with SA predecessor at ${j}: common prefix length = ${k}`
      });
    }

    if (k > 0) {
      k--; // Kasai's invariant: next k is at least k - 1
    }
  }

  return { lcp, steps };
}
