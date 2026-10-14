/**
 * Maximum Bipartite Matching
 * Using augmenting paths (Kuhn's / DFS algorithm)
 * Matches items from Set U (e.g., Media Records) to Set V (e.g., Distribution Channels or Reviewers).
 */

export function maxBipartiteMatching(leftNodes, rightNodes, compatibilityEdges) {
  // leftNodes: ['doc1', 'doc2', ...], rightNodes: ['ch1', 'ch2', ...]
  const uIndex = new Map();
  leftNodes.forEach((u, i) => uIndex.set(u, i));

  const vIndex = new Map();
  rightNodes.forEach((v, i) => vIndex.set(v, i));

  const adj = Array.from({ length: leftNodes.length }, () => []);

  compatibilityEdges.forEach(([u, v]) => {
    const ui = uIndex.get(u);
    const vi = vIndex.get(v);
    if (ui !== undefined && vi !== undefined) {
      adj[ui].push(vi);
    }
  });

  const matchR = new Array(rightNodes.length).fill(-1);
  const matchL = new Array(leftNodes.length).fill(-1);
  const steps = [];

  const bpm = (u, seen) => {
    for (const v of adj[u]) {
      if (!seen[v]) {
        seen[v] = true;

        if (matchR[v] < 0 || bpm(matchR[v], seen)) {
          matchR[v] = u;
          matchL[u] = v;
          return true;
        }
      }
    }
    return false;
  };

  let maxMatches = 0;

  for (let u = 0; u < leftNodes.length; u++) {
    const seen = new Array(rightNodes.length).fill(false);
    if (bpm(u, seen)) {
      maxMatches++;
      steps.push({
        matchedItem: leftNodes[u],
        matchedTo: rightNodes[matchL[u]],
        cumulativeMatches: maxMatches,
        explanation: `Assigned "${leftNodes[u]}" to "${rightNodes[matchL[u]]}"`
      });
    }
  }

  const pairs = [];
  for (let v = 0; v < rightNodes.length; v++) {
    if (matchR[v] !== -1) {
      pairs.push({
        left: leftNodes[matchR[v]],
        right: rightNodes[v]
      });
    }
  }

  return {
    algorithm: 'Maximum Bipartite Matching (Augmenting Paths)',
    maxMatches,
    pairs,
    unmatchedLeft: leftNodes.filter((_, idx) => matchL[idx] === -1),
    unmatchedRight: rightNodes.filter((_, idx) => matchR[idx] === -1),
    steps
  };
}
