# MediaMine — Intelligent Media Analytics Platform

> **A modern, high-performance, frontend-only media intelligence platform powered entirely by in-browser Data Structures & Algorithms (DSA).**

---

## 🌟 Executive Overview

**MediaMine** is an enterprise-grade media analytics platform demonstrating how advanced computer science algorithms can run directly inside client-side web browsers without requiring backend servers (Node/Express, Python, Java) or external search APIs.

The system features an in-browser inverted indexing pipeline, multi-pattern string searching, dynamic programming spelling correction, suffix structure document similarity analysis, max-flow network distribution simulation, NP-completeness approximation heuristics, and parallel algorithmic work-depth modeling.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18.x or newer recommended)
- **npm** (v9.x or newer)

### Running Locally

```bash
# 1. Navigate to the project directory
cd mediamine-app

# 2. Install dependencies (if not already installed)
npm install

# 3. Launch the Vite development server
npm run dev
```

Open your browser at: **`http://localhost:5173`**

To test a production build:
```bash
npm run build
npm run preview
```

---

## 🔐 Demo Accounts & Authentication

Authentication and role transitions are executed entirely within browser memory (`localStorage`).

| Role | Email | Password | Permissions & Views |
| :--- | :--- | :--- | :--- |
| **Demo User** | `user@mediamine.demo` | `User123!` | Search, Document Details, Similarity Analyzer, Algorithm Lab, Bookmarks, Search History |
| **Demo Admin** | `admin@mediamine.demo` | `Admin123!` | Everything in User + Full CRUD (Add, Edit, Delete, Duplicate), Bulk Import/Export, Data Management |

> **Interactive Role Switcher:** You can instantly switch between **User** and **Admin** modes using the segmented role switch in the top navigation bar without reloading the application.

---

## 🧠 Implemented Algorithms Architecture

All 6 required algorithmic modules are implemented in pure JavaScript inside `src/algorithms/`:

### Module 1: Advanced String Search
- **Knuth-Morris-Pratt (KMP) (`src/algorithms/string/kmp.js`)**:
  - Computes the Longest Proper Prefix which is also Suffix (LPS) table in $O(M)$ time.
  - Matches exact keywords and phrases in $O(N + M)$ time without backtracking the text pointer.
- **Z-Function (`src/algorithms/string/zFunction.js`)**:
  - Linear $O(N)$ Z-array construction maintaining an $[L, R]$ match interval.
  - Substring matching via the canonical concatenation $P + \$ + T$.
- **Rabin-Karp Rolling Hash (`src/algorithms/string/rabinKarp.js`)**:
  - Polynomial rolling hash with radix 256 and prime modulus $1{,}000{,}000{,}007$.
  - Exact character verification to prevent false positives from hash collisions.
- **Aho-Corasick Multi-Pattern Automaton (`src/algorithms/string/ahoCorasick.js`)**:
  - Constructs a Trie with breadth-first search (BFS) failure links and dictionary output links.
  - Scans for multiple keywords simultaneously in a single linear $O(N + \text{matches})$ pass.

### Module 2: Indexing and Document Similarity
- **Suffix Array (`src/algorithms/similarity/suffixArray.js`)**:
  - Lexicographically sorts all suffixes of media text.
- **Kasai's LCP Array (`src/algorithms/similarity/lcpArray.js`)**:
  - Constructs the Longest Common Prefix (LCP) array in linear $O(N)$ time using the rank array and Kasai's invariant ($k \ge k - 1$).
- **Suffix Automaton / DAWG (`src/algorithms/similarity/suffixAutomaton.js`)**:
  - Minimal deterministic automaton accepting all suffixes in linear $O(N)$ time and states.
  - Counts distinct substrings and extracts longest repeated sub-sequences.
- **Document Similarity Analyzer (`src/algorithms/similarity/documentSimilarity.js`)**:
  - Combines Kasai LCP for phrase extraction, Cosine Similarity on TF-IDF vectors, and Jaccard token overlap.

### Module 3: Dynamic Programming
- **Levenshtein Distance (`src/algorithms/dynamicProgramming/levenshtein.js`)**:
  - $O(M \times N)$ table computing insertions, deletions, and substitutions with optimal alignment path backtracking.
- **Damerau-Levenshtein Distance (`src/algorithms/dynamicProgramming/damerauLevenshtein.js`)**:
  - Adds adjacent character transposition support (e.g., `"machien"` $\to$ `"machine"` with edit distance 1).
- **Bitmask Dynamic Programming (`src/algorithms/dynamicProgramming/bitmaskDP.js`)**:
  - Solves the constrained content selection problem across required topic subsets using bitwise representations.
- **Matrix Chain Multiplication (`src/algorithms/dynamicProgramming/matrixChainMultiplication.js`)**:
  - $O(N^3)$ dynamic programming solution calculating optimal parenthesization of sequential matrix operations.

### Module 4: Network Flow and Distribution
- **Edmonds-Karp Algorithm (`src/algorithms/graph/edmondsKarp.js`)**:
  - Computes maximum network flow using BFS shortest augmenting paths in $O(V E^2)$ time.
- **Dinic's Algorithm (`src/algorithms/graph/dinic.js`)**:
  - Constructs BFS level graphs and pushes DFS blocking flows in $O(V^2 E)$ time.
- **Minimum Cut (`src/algorithms/graph/minCut.js`)**:
  - Partitions network vertices into source-reachable $(S)$ and sink $(T)$ sets using residual capacity, verifying the Max-Flow Min-Cut Theorem.
- **Maximum Bipartite Matching (`src/algorithms/graph/bipartiteMatching.js`)**:
  - Augmenting path algorithm matching media articles to distribution channels.

### Module 5: NP-Completeness and Approximation
- **DPLL 3-SAT Solver (`src/algorithms/optimization/satSolver.js`)**:
  - Davis-Putnam-Logemann-Loveland algorithm with unit propagation, conflict detection, and backtracking for CNF formulas.
- **Maximum Clique (`src/algorithms/optimization/clique.js`)**:
  - Bron-Kerbosch algorithm with vertex pivoting for bounded input graphs.
- **Minimum Vertex Cover (`src/algorithms/optimization/vertexCover.js`)**:
  - Exact branch-and-bound solver alongside a polynomial-time 2-approximation maximal matching heuristic.
- **Maximum Independent Set (`src/algorithms/optimization/independentSet.js`)**:
  - Formulated via Gallai's duality theorem ($|IS| = |V| - |VC|$).

### Module 6: Randomized and Parallel Algorithms
- **Randomized QuickSort (`src/algorithms/randomized/randomizedQuickSort.js`)**:
  - Uniform random pivot selection guaranteeing expected $O(N \log N)$ runtime and avoiding quadratic worst-case degradation.
- **Reservoir Sampling (`src/algorithms/randomized/reservoirSampling.js`)**:
  - Algorithm R for selecting $k$ uniform random items from an unbounded stream in a single pass.
- **Miller-Rabin Primality Test (`src/algorithms/randomized/millerRabin.js`)**:
  - Probabilistic primality test using BigInt modular exponentiation with error bound $\le 4^{-k}$.
- **Blelloch Parallel Prefix Scan (`src/algorithms/randomized/blellochScan.js`)**:
  - Work-efficient prefix sum with up-sweep (reduce) and down-sweep phases in $O(N)$ work and $O(\log N)$ span.
- **Brent's Theorem Work-Depth Simulator (`src/algorithms/randomized/brentVisualization.js`)**:
  - Computes theoretical speedup bounds: $T_p \le \frac{W - D}{p} + D$.

---

## 📁 Project Structure

```
mediamine-app/
├── index.html                  # HTML entry point with dark theme defaults
├── package.json                # React, Vite, Tailwind, Recharts, Lucide, Framer Motion
├── vite.config.js              # Vite configuration with chunk splitting
├── tailwind.config.js          # Custom Navy/Indigo/Cyan palette & typography
├── postcss.config.js
├── src/
│   ├── main.jsx                # Application root entry
│   ├── App.jsx                 # React Router definitions & route guards
│   ├── index.css               # Base Tailwind CSS, glassmorphism utilities & scrollbars
│   ├── algorithms/
│   │   ├── string/             # KMP, Z-Function, Rabin-Karp, Aho-Corasick
│   │   ├── similarity/         # Suffix Array, Kasai LCP, Suffix Automaton, Doc Similarity
│   │   ├── dynamicProgramming/ # Levenshtein, Damerau, Matrix Chain, Bitmask DP
│   │   ├── graph/              # Dinic, Edmonds-Karp, Min-Cut, Bipartite Matching
│   │   ├── optimization/       # DPLL 3-SAT, Max Clique, Vertex Cover, Independent Set
│   │   └── randomized/         # QuickSort, Reservoir, Miller-Rabin, Blelloch, Brent
│   ├── components/
│   │   └── layout/             # Navbar, Sidebar, AppLayout
│   ├── context/
│   │   ├── AuthContext.jsx     # User authentication & role switching state
│   │   └── ThemeContext.jsx    # Dark / Light theme toggle state
│   ├── data/
│   │   ├── initialMedia.js     # 52+ realistic pre-loaded media records
│   │   └── demoUsers.js        # Demo user & admin accounts
│   ├── pages/
│   │   ├── SignIn.jsx          # Split-screen sign-in with demo quick-logins
│   │   ├── SignUp.jsx          # Client-side user registration
│   │   ├── UserDashboard.jsx   # KPI hub, Recharts activity and topic distributions
│   │   ├── SearchResults.jsx   # Intelligent search with spelling suggestions & highlight
│   │   ├── MediaDetails.jsx    # Complete layout for all 7 media types & in-page search
│   │   ├── Bookmarks.jsx       # Saved offline media records
│   │   ├── SearchHistory.jsx   # Query execution log with timestamps
│   │   ├── SimilarityAnalyzer.jsx # Side-by-side suffix & cosine comparison
│   │   ├── AlgorithmLab.jsx    # 6-module interactive laboratory with visual tables
│   │   ├── Analytics.jsx       # Recharts search frequency, spelling fixes, latency
│   │   ├── AdminDashboard.jsx  # Admin KPIs and CRUD management
│   │   ├── MediaManagement.jsx # Record library table with edit modal & duplicate
│   │   ├── AddMedia.jsx        # Multi-type media publisher
│   │   ├── DataManagement.jsx  # JSON/CSV import & export and factory reset
│   │   ├── Settings.jsx        # Account preferences, theme, and cache controls
│   │   └── NotFound.jsx        # 404 handler
│   └── services/
│       ├── storageService.js   # localStorage persistence with in-memory fallback
│       ├── indexingService.js  # Inverted token index & postings list builder
│       ├── spellingService.js  # Damerau-Levenshtein vocabulary spelling correction
│       ├── searchService.js    # Multi-signal relevance scoring & query pipeline
│       ├── analyticsService.js # Search event log aggregator
│       └── authService.js      # Client-side authentication & session manager
```

---

## 🔬 Search & Spelling Correction Showcase

- **Exact & Substring Matching**: Searching for `"neural networks"` matches articles, courses, research papers, and video transcripts using KMP and Rabin-Karp verification.
- **Spelling Correction**:
  - Searching for `"machin lerning"` automatically detects an edit distance of 2 from `"machine learning"`, displays:
    > *Showing results for: **machine learning** • Search instead for: "machin lerning"*
  - Searching for `"deep lerning"` corrects to `"deep learning"`.
  - Transposition test: `"machien"` correctly maps to `"machine"`.
- **Query Intent Recognition**:
  - Queries containing `"course"` boost educational courses.
  - Queries containing `"news"` or `"latest"` boost journalism dispatches.
  - Queries containing `"video"` prioritize timestamped videos.
- **Multi-Keyword Search**: Aho-Corasick matches combinations such as `"AI, neural networks, machine learning"` in a single pass.

---

## ⚠️ Frontend-Only Design Considerations

1. **Simulated Client-Side Security**: All user registration, credential checks, and role switching occur strictly within the client browser. In production enterprise environments, authorization must be verified by a backend server via signed JWTs or cryptographic session cookies.
2. **Computational Limits**: Bounded thresholds (e.g. max decisions for 3-SAT, capped vertex counts for Clique) prevent browser main-thread freezes while demonstrating mathematical correctness.
3. **Data Persistence**: Content is stored in browser `localStorage`. Resetting browser storage or clicking **"Reset Demo Dataset"** restores the pristine 52+ record catalog.
