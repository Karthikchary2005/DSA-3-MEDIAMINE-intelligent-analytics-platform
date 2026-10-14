/**
 * Blelloch Parallel Scan Algorithm
 * Computes the exclusive prefix sum of an array in parallel:
 * Work: O(N) operations
 * Span / Depth: O(log N) parallel steps
 * Consists of two phases: Up-Sweep (reduce) and Down-Sweep (distribute).
 */

export function blellochScan(inputArray) {
  // Pad input to next power of 2
  let n = inputArray.length;
  let power = 1;
  while (power < n) power *= 2;

  const a = new Array(power).fill(0);
  for (let i = 0; i < n; i++) a[i] = inputArray[i];

  const upSweepSteps = [];
  const downSweepSteps = [];

  // Phase 1: Up-Sweep (Reduce Phase)
  let stepCount = 0;
  for (let d = 0; d < Math.log2(power); d++) {
    const stride = Math.pow(2, d + 1);
    const half = Math.pow(2, d);
    const ops = [];

    for (let k = 0; k < power; k += stride) {
      const leftIdx = k + half - 1;
      const rightIdx = k + stride - 1;
      a[rightIdx] = a[leftIdx] + a[rightIdx];
      ops.push({ leftIdx, rightIdx, newVal: a[rightIdx] });
    }

    upSweepSteps.push({
      step: ++stepCount,
      depth: d,
      stride,
      arraySnapshot: [...a],
      operations: ops,
      explanation: `Depth ${d}: Stride ${stride}. Added pairs into right children.`
    });
  }

  const totalSum = a[power - 1];

  // Set root to identity (0) for exclusive scan
  a[power - 1] = 0;
  downSweepSteps.push({
    step: 0,
    depth: 'Root Zeroing',
    arraySnapshot: [...a],
    explanation: `Set root element at index ${power - 1} to 0 (identity for prefix sum)`
  });

  // Phase 2: Down-Sweep Phase
  stepCount = 0;
  for (let d = Math.log2(power) - 1; d >= 0; d--) {
    const stride = Math.pow(2, d + 1);
    const half = Math.pow(2, d);
    const ops = [];

    for (let k = 0; k < power; k += stride) {
      const leftIdx = k + half - 1;
      const rightIdx = k + stride - 1;
      const temp = a[leftIdx];
      a[leftIdx] = a[rightIdx];
      a[rightIdx] = temp + a[rightIdx];
      ops.push({ leftIdx, rightIdx, leftVal: a[leftIdx], rightVal: a[rightIdx] });
    }

    downSweepSteps.push({
      step: ++stepCount,
      depth: d,
      stride,
      arraySnapshot: [...a],
      operations: ops,
      explanation: `Depth ${d}: Stride ${stride}. Swapped left and accumulated right.`
    });
  }

  // Trim padding to original length
  const exclusiveResult = a.slice(0, n);
  const inclusiveResult = exclusiveResult.map((val, idx) => val + inputArray[idx]);

  return {
    algorithm: 'Blelloch Work-Efficient Parallel Prefix Scan',
    inputArray,
    paddedSize: power,
    totalSum,
    exclusivePrefixSum: exclusiveResult,
    inclusivePrefixSum: inclusiveResult,
    upSweepSteps,
    downSweepSteps,
    workComplexity: 'O(N) operations',
    spanComplexity: 'O(log N) parallel depth'
  };
}
