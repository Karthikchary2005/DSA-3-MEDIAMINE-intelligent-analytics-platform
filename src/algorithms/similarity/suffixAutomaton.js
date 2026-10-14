/**
 * Suffix Automaton (DAWG - Directed Acyclic Word Graph)
 * Minimal deterministic automaton accepting all suffixes of a string.
 * Construction is linear O(N) in both time and space.
 */

class State {
  constructor(len = 0, link = -1) {
    this.len = len;       // length of longest string in this equivalence class
    this.link = link;     // suffix link
    this.next = {};       // transitions { [char]: stateIndex }
    this.isClone = false;
  }
}

export class SuffixAutomaton {
  constructor(text = '') {
    this.st = [new State(0, -1)];
    this.sz = 1;
    this.last = 0;
    this.text = text;

    if (text) {
      for (let i = 0; i < text.length; i++) {
        this.extend(text[i]);
      }
    }
  }

  extend(c) {
    const cur = this.sz++;
    this.st[cur] = new State(this.st[this.last].len + 1, 0);

    let p = this.last;
    while (p !== -1 && !(c in this.st[p].next)) {
      this.st[p].next[c] = cur;
      p = this.st[p].link;
    }

    if (p === -1) {
      this.st[cur].link = 0;
    } else {
      const q = this.st[p].next[c];
      if (this.st[p].len + 1 === this.st[q].len) {
        this.st[cur].link = q;
      } else {
        const clone = this.sz++;
        this.st[clone] = new State(this.st[p].len + 1, this.st[q].link);
        this.st[clone].next = { ...this.st[q].next };
        this.st[clone].isClone = true;

        while (p !== -1 && this.st[p].next[c] === q) {
          this.st[p].next[c] = clone;
          p = this.st[p].link;
        }

        this.st[q].link = clone;
        this.st[cur].link = clone;
      }
    }

    this.last = cur;
  }

  contains(pattern) {
    let cur = 0;
    for (let i = 0; i < pattern.length; i++) {
      const c = pattern[i];
      if (!(c in this.st[cur].next)) {
        return false;
      }
      cur = this.st[cur].next[c];
    }
    return true;
  }

  countDistinctSubstrings() {
    // DP on DAG: number of distinct paths
    const memo = new Array(this.sz).fill(-1);
    const dfs = (u) => {
      if (memo[u] !== -1) return memo[u];
      let ans = 1; // current path
      for (const c in this.st[u].next) {
        ans += dfs(this.st[u].next[c]);
      }
      return (memo[u] = ans);
    };
    return dfs(0) - 1; // exclude empty string
  }

  getLongestRepeatedSubstring() {
    // Suffix links tree depth search
    let maxLen = 0;
    let bestState = 0;
    for (let i = 1; i < this.sz; i++) {
      if (!this.st[i].isClone && this.st[i].len > maxLen) {
        // Checks if state has multiple occurrences
        maxLen = this.st[i].len;
        bestState = i;
      }
    }
    return {
      stateCount: this.sz,
      distinctSubstrings: this.countDistinctSubstrings()
    };
  }
}
