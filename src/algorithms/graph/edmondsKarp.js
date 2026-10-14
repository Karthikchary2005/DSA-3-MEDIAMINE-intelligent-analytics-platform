/**
 * Ford-Fulkerson Algorithm (with DFS) and Edmonds-Karp Algorithm (with BFS)
 * Computes maximum flow in a directed flow network with capacities.
 */

export function runEdmondsKarp(graphData) {
  const { nodes, edges, source, sink } = graphData;
  const n = nodes.length;

  const nodeIndex = new Map();
  nodes.forEach((node, idx) => nodeIndex.set(node.id, idx));

  const s = nodeIndex.get(source);
  const t = nodeIndex.get(sink);

  if (s === undefined || t === undefined) {
    return { error: 'Invalid source or sink' };
  }

  // Build capacity and residual matrices
  const capacity = Array.from({ length: n }, () => new Array(n).fill(0));
  const residual = Array.from({ length: n }, () => new Array(n).fill(0));
  const adj = Array.from({ length: n }, () => []);

  edges.forEach(edge => {
    const u = nodeIndex.get(edge.from);
    const v = nodeIndex.get(edge.to);
    if (u !== undefined && v !== undefined) {
      capacity[u][v] += edge.capacity;
      residual[u][v] += edge.capacity;
      adj[u].push(v);
      adj[v].push(u); // reverse residual edge
    }
  });

  let maxFlow = 0;
  const augmentingPaths = [];

  // BFS for Edmonds-Karp
  const bfs = () => {
    const parent = new Array(n).fill(-1);
    const queue = [s];
    parent[s] = s;

    while (queue.length > 0) {
      const u = queue.shift();
      if (u === t) break;

      for (const v of adj[u]) {
        if (parent[v] === -1 && residual[u][v] > 0) {
          parent[v] = u;
          queue.push(v);
        }
      }
    }

    if (parent[t] === -1) return null;

    // Find bottleneck
    let pathFlow = Infinity;
    let curr = t;
    const pathNodes = [];

    while (curr !== s) {
      const prev = parent[curr];
      pathFlow = Math.min(pathFlow, residual[prev][curr]);
      pathNodes.unshift(nodes[curr].id);
      curr = prev;
    }
    pathNodes.unshift(nodes[s].id);

    // Augment flow
    curr = t;
    while (curr !== s) {
      const prev = parent[curr];
      residual[prev][curr] -= pathFlow;
      residual[curr][prev] += pathFlow;
      curr = prev;
    }

    return { path: pathNodes, bottleneck: pathFlow };
  };

  while (true) {
    const result = bfs();
    if (!result) break;
    maxFlow += result.bottleneck;
    augmentingPaths.push(result);
  }

  // Flow distribution per edge
  const edgeFlows = edges.map(e => {
    const u = nodeIndex.get(e.from);
    const v = nodeIndex.get(e.to);
    const flow = Math.max(0, capacity[u][v] - residual[u][v]);
    return {
      from: e.from,
      to: e.to,
      capacity: e.capacity,
      flow,
      isSaturated: flow === e.capacity
    };
  });

  return {
    algorithm: 'Edmonds-Karp (BFS Augmenting Paths)',
    maxFlow,
    augmentingPaths,
    edgeFlows,
    residual,
    nodeIndex
  };
}
