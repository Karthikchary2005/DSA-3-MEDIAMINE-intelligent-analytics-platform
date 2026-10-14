/**
 * Maximum Clique Problem
 * A clique is a subset of vertices such that every two distinct vertices are adjacent.
 * Uses Bron-Kerbosch algorithm with pivoting for bounded input graphs.
 */

export function findMaxClique(vertices, edges) {
  const adj = new Map();
  vertices.forEach(v => adj.set(v, new Set()));

  edges.forEach(([u, v]) => {
    if (adj.has(u) && adj.has(v)) {
      adj.get(u).add(v);
      adj.get(v).add(u);
    }
  });

  let maxClique = [];
  const steps = [];

  // Bron-Kerbosch with pivoting
  const bronKerbosch = (R, P, X) => {
    if (P.size === 0 && X.size === 0) {
      if (R.size > maxClique.length) {
        maxClique = Array.from(R);
        steps.push({
          clique: [...maxClique],
          size: maxClique.length,
          explanation: `New largest clique found with size ${maxClique.length}: [${maxClique.join(', ')}]`
        });
      }
      return;
    }

    // Choose pivot from P union X to minimize branching
    const unionPX = new Set([...P, ...X]);
    let pivot = null;
    let maxNeighbors = -1;

    for (const u of unionPX) {
      const neighbors = adj.get(u) || new Set();
      let count = 0;
      for (const p of P) {
        if (neighbors.has(p)) count++;
      }
      if (count > maxNeighbors) {
        maxNeighbors = count;
        pivot = u;
      }
    }

    const pivotNeighbors = pivot ? (adj.get(pivot) || new Set()) : new Set();
    const candidates = Array.from(P).filter(v => !pivotNeighbors.has(v));

    for (const v of candidates) {
      const neighbors = adj.get(v) || new Set();
      const newR = new Set([...R, v]);
      const newP = new Set(Array.from(P).filter(w => neighbors.has(w)));
      const newX = new Set(Array.from(X).filter(w => neighbors.has(w)));

      bronKerbosch(newR, newP, newX);

      P.delete(v);
      X.add(v);
    }
  };

  const initialR = new Set();
  const initialP = new Set(vertices);
  const initialX = new Set();

  bronKerbosch(initialR, initialP, initialX);

  return {
    algorithm: 'Bron-Kerbosch Maximum Clique',
    maxClique,
    cliqueSize: maxClique.length,
    verticesCount: vertices.length,
    edgesCount: edges.length,
    steps
  };
}
