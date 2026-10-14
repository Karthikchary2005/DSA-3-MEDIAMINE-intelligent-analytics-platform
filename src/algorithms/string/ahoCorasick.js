/**
 * Aho-Corasick Automaton
 * Multi-pattern string searching using a Trie with failure links and dictionary output links.
 * Time Complexity: O(Total_Pattern_Length) for construction, O(Text_Length + Matches) for searching.
 */

class AhoNode {
  constructor(char = '') {
    this.char = char;
    this.children = new Map();
    this.fail = null;
    this.output = []; // array of matched pattern strings at this state
  }
}

export class AhoCorasick {
  constructor(patterns = []) {
    this.root = new AhoNode();
    this.patterns = patterns;
    this.buildTrie(patterns);
    this.buildFailureLinks();
  }

  buildTrie(patterns) {
    for (const pat of patterns) {
      if (!pat) continue;
      const cleanPat = pat.toLowerCase().trim();
      if (!cleanPat) continue;
      let curr = this.root;
      for (const char of cleanPat) {
        if (!curr.children.has(char)) {
          curr.children.set(char, new AhoNode(char));
        }
        curr = curr.children.get(char);
      }
      curr.output.push(cleanPat);
    }
  }

  buildFailureLinks() {
    const queue = [];

    // Root children point their fail link to root
    for (const [char, child] of this.root.children.entries()) {
      child.fail = this.root;
      queue.push(child);
    }

    // BFS to establish failure and dictionary links
    while (queue.length > 0) {
      const curr = queue.shift();

      for (const [char, child] of curr.children.entries()) {
        let f = curr.fail;
        while (f && !f.children.has(char)) {
          f = f.fail;
        }
        child.fail = f ? f.children.get(char) : this.root;

        // Propagate output patterns through suffix/output links
        if (child.fail && child.fail.output.length > 0) {
          child.output = [...child.output, ...child.fail.output];
        }

        queue.push(child);
      }
    }
  }

  search(text) {
    if (!text) return { matches: [], patternCounts: {}, timeMs: 0 };
    const startTime = performance.now();
    const t = text.toLowerCase();
    let curr = this.root;
    const matches = [];
    const patternCounts = {};
    const traceSteps = [];

    for (let i = 0; i < t.length; i++) {
      const char = t[i];

      while (curr && !curr.children.has(char) && curr !== this.root) {
        curr = curr.fail;
      }

      if (curr && curr.children.has(char)) {
        curr = curr.children.get(char);
      } else {
        curr = this.root;
      }

      if (curr && curr.output.length > 0) {
        for (const pattern of curr.output) {
          const startIndex = i - pattern.length + 1;
          matches.push({
            pattern,
            index: startIndex,
            endIndex: i
          });
          patternCounts[pattern] = (patternCounts[pattern] || 0) + 1;

          if (traceSteps.length < 50) {
            traceSteps.push({
              position: i,
              char,
              matchedPattern: pattern,
              startIndex,
              explanation: `Automaton reached terminal state for keyword "${pattern}" ending at index ${i}`
            });
          }
        }
      }
    }

    const timeMs = performance.now() - startTime;
    return {
      algorithm: 'Aho-Corasick Multi-Pattern Search',
      totalPatterns: this.patterns.length,
      matches,
      matchCount: matches.length,
      patternCounts,
      traceSteps,
      timeMs: parseFloat(timeMs.toFixed(3))
    };
  }
}

export function ahoCorasickMultiSearch(text, patterns) {
  const automaton = new AhoCorasick(patterns);
  return automaton.search(text);
}
