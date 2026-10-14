/**
 * Levenshtein Distance
 * Computes standard edit distance (insertions, deletions, substitutions).
 * Returns the full 2D DP matrix for interactive visualizer inspection.
 */

export function levenshteinDistance(s1, s2) {
  const m = s1.length;
  const n = s2.length;

  // Initialize matrix of size (m+1) x (n+1)
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  const operations = [];

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1].toLowerCase() === s2[j - 1].toLowerCase() ? 0 : 1;
      const del = dp[i - 1][j] + 1;
      const ins = dp[i][j - 1] + 1;
      const sub = dp[i - 1][j - 1] + cost;

      dp[i][j] = Math.min(del, ins, sub);
    }
  }

  // Backtrack optimal alignment path
  let curI = m;
  let curJ = n;
  const alignmentPath = [];

  while (curI > 0 || curJ > 0) {
    alignmentPath.unshift({ i: curI, j: curJ, val: dp[curI][curJ] });
    if (curI > 0 && curJ > 0 && dp[curI][curJ] === dp[curI - 1][curJ - 1] + (s1[curI - 1].toLowerCase() === s2[curJ - 1].toLowerCase() ? 0 : 1)) {
      curI--;
      curJ--;
    } else if (curI > 0 && dp[curI][curJ] === dp[curI - 1][curJ] + 1) {
      curI--;
    } else {
      curJ--;
    }
  }
  alignmentPath.unshift({ i: 0, j: 0, val: 0 });

  return {
    s1,
    s2,
    distance: dp[m][n],
    matrix: dp,
    alignmentPath,
    rows: ['∅', ...s1.split('')],
    cols: ['∅', ...s2.split('')]
  };
}
