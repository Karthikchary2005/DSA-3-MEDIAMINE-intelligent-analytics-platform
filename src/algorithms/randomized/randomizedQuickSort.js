/**
 * Randomized QuickSort
 * Selects pivots uniformly at random to guarantee expected O(N log N) time complexity
 * and avoid worst-case O(N^2) degradation on sorted or adversarial inputs.
 */

export function randomizedQuickSort(arr, keyExtractor = (x) => x) {
  const items = [...arr];
  const steps = [];
  let comparisonCount = 0;
  let swapCount = 0;

  const partition = (low, high) => {
    // Pick random pivot index between low and high
    const randomPivotIdx = low + Math.floor(Math.random() * (high - low + 1));
    const pivotVal = keyExtractor(items[randomPivotIdx]);

    // Swap pivot to end
    [items[randomPivotIdx], items[high]] = [items[high], items[randomPivotIdx]];
    swapCount++;

    let i = low - 1;
    for (let j = low; j < high; j++) {
      comparisonCount++;
      if (keyExtractor(items[j]) <= pivotVal) {
        i++;
        [items[i], items[j]] = [items[j], items[i]];
        swapCount++;
      }
    }

    [items[i + 1], items[high]] = [items[high], items[i + 1]];
    swapCount++;
    const finalPivotIdx = i + 1;

    if (steps.length < 50) {
      steps.push({
        low,
        high,
        pivotValue: pivotVal,
        pivotPosition: finalPivotIdx,
        arraySnapshot: items.map(keyExtractor),
        explanation: `Subarray [${low}..${high}]: Selected random pivot ${pivotVal}, placed at final index ${finalPivotIdx}`
      });
    }

    return finalPivotIdx;
  };

  const quickSort = (low, high) => {
    if (low < high) {
      const pi = partition(low, high);
      quickSort(low, pi - 1);
      quickSort(pi + 1, high);
    }
  };

  if (items.length > 0) {
    quickSort(0, items.length - 1);
  }

  return {
    sortedArray: items,
    totalComparisons: comparisonCount,
    totalSwaps: swapCount,
    steps
  };
}
