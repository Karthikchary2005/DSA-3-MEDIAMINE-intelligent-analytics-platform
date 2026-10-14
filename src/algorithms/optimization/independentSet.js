/**
 * Maximum Independent Set
 * By Gallai's Theorem / Duality:
 * S is an independent set in graph G=(V, E) if and only if V \ S is a vertex cover of G.
 * Therefore, Max_Independent_Set = V \ Min_Vertex_Cover.
 */

import { exactVertexCover } from './vertexCover.js';

export function findMaxIndependentSet(vertices, edges) {
  const { exactCover, size: vcSize } = exactVertexCover(vertices, edges);
  const coverSet = new Set(exactCover);

  const independentSet = vertices.filter(v => !coverSet.has(v));

  return {
    algorithm: 'Maximum Independent Set via Vertex Cover Duality',
    independentSet,
    size: independentSet.length,
    vertexCoverSize: vcSize,
    totalVertices: vertices.length,
    dualityFormula: `|IS| = |V| - |VC| = ${vertices.length} - ${vcSize} = ${independentSet.length}`
  };
}

export function optimizeConstrainedContent(items, conflicts, requiredTopics, maxBudget = 4) {
  // items: [{ id, title, topic, tags }]
  // conflicts: [[id1, id2], ...] (items that contradict or duplicate each other)
  // Find an independent set of items in the conflict graph that maximizes topic coverage within maxBudget
  const itemMap = new Map();
  items.forEach(it => itemMap.set(it.id, it));

  const conflictAdj = new Map();
  items.forEach(it => conflictAdj.set(it.id, new Set()));
  conflicts.forEach(([a, b]) => {
    if (conflictAdj.has(a) && conflictAdj.has(b)) {
      conflictAdj.get(a).add(b);
      conflictAdj.get(b).add(a);
    }
  });

  let bestSelection = [];
  let bestCoverageCount = -1;

  // Backtracking search over items for valid independent set of size <= maxBudget
  const backtrack = (index, currentChosen, currentChosenTopics) => {
    if (currentChosen.length <= maxBudget) {
      if (currentChosenTopics.size > bestCoverageCount) {
        bestCoverageCount = currentChosenTopics.size;
        bestSelection = [...currentChosen];
      }
    }

    if (currentChosen.length === maxBudget || index >= items.length) return;

    for (let i = index; i < items.length; i++) {
      const candidate = items[i];
      // Check conflict with already chosen
      const hasConflict = currentChosen.some(chosen => conflictAdj.get(chosen.id).has(candidate.id));
      if (!hasConflict) {
        const nextTopics = new Set([...currentChosenTopics, candidate.topic, ...(candidate.tags || [])]);
        currentChosen.push(candidate);
        backtrack(i + 1, currentChosen, nextTopics);
        currentChosen.pop();
      }
    }
  };

  backtrack(0, [], new Set());

  const coveredTopics = new Set();
  bestSelection.forEach(it => {
    coveredTopics.add(it.topic);
    (it.tags || []).forEach(t => coveredTopics.add(t));
  });

  return {
    selectedItems: bestSelection,
    selectedCount: bestSelection.length,
    coveredTopicsCount: coveredTopics.size,
    coveredTopics: Array.from(coveredTopics),
    conflictsAvoided: conflicts.length
  };
}
