/**
 * Bitmask Dynamic Programming for Content Selection Optimization
 * Solves the Set Cover / Minimum Selection problem:
 * Given a set of required topics/skills (represented as a bitmask) and a collection
 * of candidate media items (each covering a subset of topics), find the minimum
 * set of items that covers all required topics while minimizing cost or maximizing quality.
 */

export function optimizeContentSelection(mediaItems, requiredTopics, maxSelection = 5) {
  const K = requiredTopics.length;
  if (K === 0 || mediaItems.length === 0) {
    return { selectedItems: [], coveredCount: 0, totalStates: 0 };
  }

  // Cap K to 15 to ensure browser stability (2^15 = 32,768 states)
  const cappedTopics = requiredTopics.slice(0, 15);
  const topicMap = new Map();
  cappedTopics.forEach((t, idx) => topicMap.set(t.toLowerCase(), idx));

  // Precompute mask for each media item
  const items = mediaItems.map(item => {
    let mask = 0;
    const itemTopics = [
      item.topic,
      ...(item.tags || []),
      ...(item.type ? [item.type] : [])
    ].map(t => (t ? t.toLowerCase() : ''));

    itemTopics.forEach(t => {
      if (topicMap.has(t)) {
        mask |= (1 << topicMap.get(t));
      }
    });

    return {
      id: item.id,
      title: item.title,
      type: item.type,
      topic: item.topic,
      mask,
      qualityScore: item.relevance || 1
    };
  }).filter(item => item.mask > 0);

  const targetMask = (1 << cappedTopics.length) - 1;
  const numStates = 1 << cappedTopics.length;

  // dp[mask] = { count: minItems, prevMask: mask, itemUsed: item }
  const dp = new Array(numStates).fill(null);
  dp[0] = { count: 0, prevMask: 0, item: null };

  const steps = [];

  for (let mask = 0; mask < numStates; mask++) {
    if (dp[mask] === null) continue;
    if (dp[mask].count >= maxSelection) continue;

    for (const item of items) {
      const nextMask = mask | item.mask;
      const nextCount = dp[mask].count + 1;

      if (dp[nextMask] === null || nextCount < dp[nextMask].count) {
        dp[nextMask] = {
          count: nextCount,
          prevMask: mask,
          item: item
        };

        if (steps.length < 30) {
          steps.push({
            fromMask: mask.toString(2).padStart(cappedTopics.length, '0'),
            toMask: nextMask.toString(2).padStart(cappedTopics.length, '0'),
            itemTitle: item.title,
            itemsCount: nextCount,
            explanation: `Transition: Added "${item.title.substring(0, 25)}..." -> covered new topics`
          });
        }
      }
    }
  }

  // Find best reachable mask
  let bestMask = targetMask;
  if (dp[targetMask] === null) {
    let maxBits = -1;
    for (let m = 0; m < numStates; m++) {
      if (dp[m] !== null) {
        // Count set bits
        const bits = m.toString(2).split('1').length - 1;
        if (bits > maxBits) {
          maxBits = bits;
          bestMask = m;
        }
      }
    }
  }

  // Backtrack to extract selected media items
  const selected = [];
  let cur = bestMask;
  while (cur > 0 && dp[cur] && dp[cur].item) {
    selected.push(dp[cur].item);
    cur = dp[cur].prevMask;
  }

  // Map covered topics
  const coveredTopics = cappedTopics.filter((_, idx) => (bestMask & (1 << idx)) !== 0);

  return {
    requiredTopics: cappedTopics,
    targetMask: targetMask.toString(2).padStart(cappedTopics.length, '0'),
    achievedMask: bestMask.toString(2).padStart(cappedTopics.length, '0'),
    isFullyCovered: bestMask === targetMask,
    coveredTopics,
    selectedItems: selected,
    totalStates: numStates,
    steps
  };
}
