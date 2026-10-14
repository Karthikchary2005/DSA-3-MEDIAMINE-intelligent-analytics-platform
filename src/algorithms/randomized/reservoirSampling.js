/**
 * Reservoir Sampling (Algorithm R)
 * Randomly selects k samples from a stream of unknown or infinite length n in a single pass.
 * Every item in the stream has an exact equal probability (k / n) of being selected.
 */

export function reservoirSample(stream, k) {
  if (k <= 0) return { reservoir: [], steps: [] };
  if (stream.length <= k) {
    return { reservoir: [...stream], steps: [] };
  }

  const reservoir = [];
  const steps = [];

  // Step 1: Fill reservoir with first k elements
  for (let i = 0; i < k; i++) {
    reservoir.push(stream[i]);
    steps.push({
      itemIndex: i,
      item: stream[i],
      action: 'Initial Fill',
      probability: '1.0',
      reservoirState: [...reservoir]
    });
  }

  // Step 2: For subsequent elements i (from k to n-1), pick random j in [0, i]
  for (let i = k; i < stream.length; i++) {
    const j = Math.floor(Math.random() * (i + 1));
    const probStr = `${k}/${i + 1} (${((k / (i + 1)) * 100).toFixed(1)}%)`;

    if (j < k) {
      const replaced = reservoir[j];
      reservoir[j] = stream[i];
      if (steps.length < 50) {
        steps.push({
          itemIndex: i,
          item: stream[i],
          action: `Replaced item at index ${j}`,
          probability: probStr,
          replacedItem: replaced,
          reservoirState: [...reservoir]
        });
      }
    } else {
      if (steps.length < 50) {
        steps.push({
          itemIndex: i,
          item: stream[i],
          action: 'Skipped',
          probability: probStr,
          reservoirState: [...reservoir]
        });
      }
    }
  }

  return {
    reservoirSize: k,
    totalStreamItems: stream.length,
    reservoir,
    steps
  };
}
