/**
 * Matrix Chain Multiplication Dynamic Programming
 * Computes the minimum number of scalar multiplications needed to multiply a chain of matrices.
 * Used educationally to demonstrate optimal parenthesization & order of pipelined transformations.
 */

export function matrixChainOrder(dims) {
  // dims: array of dimensions, where matrix i has dimension dims[i-1] x dims[i]
  const n = dims.length - 1; // number of matrices
  if (n <= 0) return null;

  // m[i][j] = minimum scalar multiplications to compute A[i..j]
  // s[i][j] = index k that achieved optimal split
  const m = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(0));
  const s = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(0));
  const steps = [];

  // l is the chain length
  for (let l = 2; l <= n; l++) {
    for (let i = 1; i <= n - l + 1; i++) {
      const j = i + l - 1;
      m[i][j] = Infinity;

      for (let k = i; k <= j - 1; k++) {
        // q = cost/scalar multiplications
        const q = m[i][k] + m[k + 1][j] + dims[i - 1] * dims[k] * dims[j];

        if (q < m[i][j]) {
          m[i][j] = q;
          s[i][j] = k;
        }

        if (steps.length < 40) {
          steps.push({
            subproblem: `A[${i}..${j}] split at k=${k}`,
            cost: q,
            leftCost: m[i][k],
            rightCost: m[k + 1][j],
            multCost: dims[i - 1] * dims[k] * dims[j],
            bestSoFar: m[i][j]
          });
        }
      }
    }
  }

  // Build optimal parenthesization string
  function buildParenthesis(i, j) {
    if (i === j) {
      return `M${i}`;
    }
    const k = s[i][j];
    return `(${buildParenthesis(i, k)} × ${buildParenthesis(k + 1, j)})`;
  }

  const optimalParens = buildParenthesis(1, n);

  return {
    matrixCount: n,
    dimensions: dims,
    minScalarMultiplications: m[1][n],
    costMatrix: m,
    splitMatrix: s,
    optimalParenthesization: optimalParens,
    steps
  };
}
