/**
 * Minimum Vertex Cover
 * A vertex cover is a set of vertices such that every edge in the graph is incident to at least one vertex in the set.
 * Includes:
 * 1. Exact Branch & Bound solver for small graphs
 * 2. Standard 2-Approximation Algorithm (Maximal Matching heuristic)
 */

export function exactVertexCover(vertices, edges) {
  const n = vertices.length;
  let bestCover = [...vertices];

  const edgeList = edges.map(([u, v]) => [u, v]);

  // Branch and bound: pick an uncovered edge, either u must be in cover OR v must be in cover
  const search = (uncoveredEdges, currentCover) => {
    if (currentCover.size >= bestCover.length) return; // Prune

    if (uncoveredEdges.length === 0) {
      if (currentCover.size < bestCover.length) {
        bestCover = Array.from(currentCover);
      }
      return;
    }

    const [u, v] = uncoveredEdges[0];

    // Branch 1: Include u
    const nextEdgesU = uncoveredEdges.filter(([x, y]) => x !== u && y !== u);
    currentCover.add(u);
    search(nextEdgesU, currentCover);
    currentCover.delete(u);

    // Branch 2: Include v
    const nextEdgesV = uncoveredEdges.filter(([x, y]) => x !== v && y !== v);
    currentCover.add(v);
    search(nextEdgesV, currentCover);
    currentCover.delete(v);
  };

  search(edgeList, new Set());

  return {
    exactCover: bestCover,
    size: bestCover.length,
    optimal: true
  };
}

export function approximateVertexCover2(vertices, edges) {
  // 2-Approximation using Maximal Matching:
  // Repeatedly pick an arbitrary uncovered edge (u, v), add BOTH u and v to cover, and remove all incident edges.
  const cover = new Set();
  const matchedEdges = [];
  let remainingEdges = [...edges];

  while (remainingEdges.length > 0) {
    const [u, v] = remainingEdges[0];
    cover.add(u);
    cover.add(v);
    matchedEdges.push([u, v]);

    // Remove all edges incident to u or v
    remainingEdges = remainingEdges.filter(([x, y]) => x !== u && y !== u && x !== v && y !== v);
  }

  const approxCover = Array.from(cover);

  return {
    approximateCover: approxCover,
    size: approxCover.length,
    matchedEdges,
    guarantee: 'Cover size is at most 2 × OPT'
  };
}
