/**
 * Minimum Cut Algorithm
 * Based on the Max-Flow Min-Cut theorem.
 * Finds the s-t cut that partitions the graph into (S, T) with minimum total capacity.
 */

import { runEdmondsKarp } from './edmondsKarp.js';

export function computeMinCut(graphData) {
  const flowResult = runEdmondsKarp(graphData);
  if (flowResult.error) return flowResult;

  const { nodes, edges, source, sink } = graphData;
  const { residual, nodeIndex } = flowResult;
  const n = nodes.length;

  const s = nodeIndex.get(source);

  // BFS in residual graph from source
  const visited = new Array(n).fill(false);
  const queue = [s];
  visited[s] = true;

  while (queue.length > 0) {
    const u = queue.shift();
    for (let v = 0; v < n; v++) {
      if (!visited[v] && residual[u][v] > 0) {
        visited[v] = true;
        queue.push(v);
      }
    }
  }

  const setS = [];
  const setT = [];
  nodes.forEach((node, idx) => {
    if (visited[idx]) {
      setS.push(node.id);
    } else {
      setT.push(node.id);
    }
  });

  // Cut edges: from visited set S to non-visited set T in original graph
  const cutEdges = [];
  let cutCapacity = 0;

  edges.forEach(e => {
    const u = nodeIndex.get(e.from);
    const v = nodeIndex.get(e.to);
    if (visited[u] && !visited[v]) {
      cutEdges.push({
        from: e.from,
        to: e.to,
        capacity: e.capacity
      });
      cutCapacity += e.capacity;
    }
  });

  return {
    algorithm: 'Minimum Cut (Max-Flow Min-Cut Theorem)',
    maxFlow: flowResult.maxFlow,
    cutCapacity,
    isEqual: flowResult.maxFlow === cutCapacity,
    sourcePartitionS: setS,
    sinkPartitionT: setT,
    cutEdges,
    augmentingPaths: flowResult.augmentingPaths,
    edgeFlows: flowResult.edgeFlows
  };
}
