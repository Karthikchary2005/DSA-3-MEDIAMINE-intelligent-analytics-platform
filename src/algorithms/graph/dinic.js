/**
 * Dinic's Algorithm for Maximum Network Flow
 * Uses BFS to construct level graphs and DFS to push blocking flows.
 * Time complexity: O(V^2 * E)
 */

export function runDinic(graphData) {
  const { nodes, edges, source, sink } = graphData;
  const n = nodes.length;

  const nodeIndex = new Map();
  nodes.forEach((node, idx) => nodeIndex.set(node.id, idx));

  const s = nodeIndex.get(source);
  const t = nodeIndex.get(sink);

  if (s === undefined || t === undefined) {
    return { error: 'Invalid source or sink' };
  }

  // Internal edge representation for Dinic
  const dinicEdges = [];
  const head = Array.from({ length: n }, () => []);

  const addEdge = (u, v, cap) => {
    dinicEdges.push({ to: v, cap, flow: 0, rev: dinicEdges.length + 1, from: u });
    head[u].push(dinicEdges.length - 1);
    dinicEdges.push({ to: u, cap: 0, flow: 0, rev: dinicEdges.length - 1, from: v });
    head[v].push(dinicEdges.length - 1);
  };

  edges.forEach(e => {
    const u = nodeIndex.get(e.from);
    const v = nodeIndex.get(e.to);
    if (u !== undefined && v !== undefined) {
      addEdge(u, v, e.capacity);
    }
  });

  const level = new Array(n).fill(-1);
  const ptr = new Array(n).fill(0);
  const phases = [];

  // BFS to build level graph
  const bfsLevel = () => {
    level.fill(-1);
    level[s] = 0;
    const q = [s];

    while (q.length > 0) {
      const u = q.shift();
      for (const edgeIdx of head[u]) {
        const e = dinicEdges[edgeIdx];
        if (e.cap - e.flow > 0 && level[e.to] === -1) {
          level[e.to] = level[u] + 1;
          q.push(e.to);
        }
      }
    }
    return level[t] !== -1;
  };

  // DFS to push blocking flow
  const dfsFlow = (u, pushed) => {
    if (pushed === 0) return 0;
    if (u === t) return pushed;

    for (let cid = ptr[u]; cid < head[u].length; cid++) {
      ptr[u] = cid;
      const edgeIdx = head[u][cid];
      const e = dinicEdges[edgeIdx];
      const tr = e.to;

      if (level[u] + 1 !== level[tr] || e.cap - e.flow === 0) continue;

      const push = dfsFlow(tr, Math.min(pushed, e.cap - e.flow));
      if (push === 0) continue;

      e.flow += push;
      dinicEdges[e.rev].flow -= push;
      return push;
    }
    return 0;
  };

  let maxFlow = 0;
  let phaseCount = 0;

  while (bfsLevel()) {
    phaseCount++;
    ptr.fill(0);
    let pushed = 0;
    let phaseFlow = 0;

    while ((pushed = dfsFlow(s, Infinity)) > 0) {
      maxFlow += pushed;
      phaseFlow += pushed;
    }

    phases.push({
      phase: phaseCount,
      flowPushed: phaseFlow,
      levels: [...level]
    });
  }

  // Calculate flow on original edges
  const edgeFlows = edges.map(e => {
    const u = nodeIndex.get(e.from);
    const v = nodeIndex.get(e.to);
    let f = 0;
    for (const edgeIdx of head[u]) {
      const de = dinicEdges[edgeIdx];
      if (de.to === v) {
        f = de.flow;
        break;
      }
    }
    return {
      from: e.from,
      to: e.to,
      capacity: e.capacity,
      flow: f,
      isSaturated: f === e.capacity
    };
  });

  return {
    algorithm: "Dinic's Algorithm (Level Graph & Blocking Flow)",
    maxFlow,
    phases,
    edgeFlows,
    source,
    sink
  };
}
