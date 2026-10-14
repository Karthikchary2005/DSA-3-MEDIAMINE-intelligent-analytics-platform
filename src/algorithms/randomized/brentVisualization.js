/**
 * Parallel Tree Reduction Simulation
 * Demonstrates dividing an array into chunks and reducing them hierarchically in a tree.
 * Work: O(N) operations, Span: O(log N) depth.
 */

export function parallelReduce(arr, chunkCount = 4) {
  if (!arr || arr.length === 0) return { result: 0, steps: [] };

  const n = arr.length;
  const chunkSize = Math.max(1, Math.ceil(n / chunkCount));
  const chunks = [];

  for (let i = 0; i < n; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize));
  }

  const steps = [];

  // Stage 1: Local sequential reductions per worker chunk
  const stage1Results = chunks.map((chunk, idx) => {
    const sum = chunk.reduce((acc, val) => acc + val, 0);
    return { workerId: `Worker-${idx + 1}`, chunk, partialSum: sum };
  });

  steps.push({
    stage: 'Local Worker Reduction',
    details: stage1Results,
    explanation: `Divided ${n} elements across ${chunks.length} parallel worker cores`
  });

  // Stage 2: Tree reduction of partial sums
  let currentLevel = stage1Results.map(r => r.partialSum);
  let round = 1;

  while (currentLevel.length > 1) {
    const nextLevel = [];
    const roundOps = [];

    for (let i = 0; i < currentLevel.length; i += 2) {
      if (i + 1 < currentLevel.length) {
        const combined = currentLevel[i] + currentLevel[i + 1];
        nextLevel.push(combined);
        roundOps.push(`${currentLevel[i]} + ${currentLevel[i + 1]} = ${combined}`);
      } else {
        nextLevel.push(currentLevel[i]);
        roundOps.push(`${currentLevel[i]} (forwarded)`);
      }
    }

    steps.push({
      stage: `Tree Reduction Round ${round++}`,
      inputs: [...currentLevel],
      outputs: [...nextLevel],
      operations: roundOps
    });

    currentLevel = nextLevel;
  }

  return {
    totalSum: currentLevel[0] || 0,
    chunkCount: chunks.length,
    initialChunks: chunks,
    steps
  };
}

/**
 * Brent's Work-Depth Theorem Analysis
 * Brent's Theorem states:
 * T_p <= (W - D) / p + D
 * where:
 * W = Total work (operations executed sequentially)
 * D = Depth / Span (critical path length with infinite processors)
 * p = Number of available processors
 */
export function calculateBrentSpeedup(work, depth, maxProcessors = 16) {
  const data = [];

  for (let p = 1; p <= maxProcessors; p++) {
    const brentTime = Math.ceil((work - depth) / p) + depth;
    const idealTime = Math.ceil(work / p);
    const speedup = (work / brentTime).toFixed(2);
    const efficiency = ((work / (p * brentTime)) * 100).toFixed(1);

    data.push({
      processors: p,
      brentTime,
      idealTime,
      speedup: parseFloat(speedup),
      efficiency: parseFloat(efficiency)
    });
  }

  return {
    work,
    depth,
    data,
    lawSummary: `With Work W=${work} and Depth D=${depth}, asymptotic speedup is bounded by W/D = ${(work / depth).toFixed(2)}x`
  };
}
