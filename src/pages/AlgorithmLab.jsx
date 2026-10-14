import React, { useState } from 'react';
import {
  Cpu,
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BarChart,
  ArrowRight,
  GitBranch,
  Network,
  Share2,
  Table,
  Sliders,
  Code
} from 'lucide-react';

// Module 1: String Search
import { kmpSearch } from '../algorithms/string/kmp.js';
import { zSearch } from '../algorithms/string/zFunction.js';
import { rabinKarpSearch } from '../algorithms/string/rabinKarp.js';
import { ahoCorasickMultiSearch } from '../algorithms/string/ahoCorasick.js';

// Module 2: Indexing and Similarity
import { buildSuffixArray } from '../algorithms/similarity/suffixArray.js';
import { buildLCPArray } from '../algorithms/similarity/lcpArray.js';
import { SuffixAutomaton } from '../algorithms/similarity/suffixAutomaton.js';

// Module 3: Dynamic Programming
import { levenshteinDistance } from '../algorithms/dynamicProgramming/levenshtein.js';
import { damerauLevenshteinDistance } from '../algorithms/dynamicProgramming/damerauLevenshtein.js';
import { matrixChainOrder } from '../algorithms/dynamicProgramming/matrixChainMultiplication.js';
import { optimizeContentSelection } from '../algorithms/dynamicProgramming/bitmaskDP.js';

// Module 4: Network Flow
import { runEdmondsKarp } from '../algorithms/graph/edmondsKarp.js';
import { runDinic } from '../algorithms/graph/dinic.js';
import { computeMinCut } from '../algorithms/graph/minCut.js';
import { maxBipartiteMatching } from '../algorithms/graph/bipartiteMatching.js';

// Module 5: NP-Completeness & Approximation
import { solveSAT } from '../algorithms/optimization/satSolver.js';
import { findMaxClique } from '../algorithms/optimization/clique.js';
import { exactVertexCover, approximateVertexCover2 } from '../algorithms/optimization/vertexCover.js';
import { findMaxIndependentSet, optimizeConstrainedContent } from '../algorithms/optimization/independentSet.js';

// Module 6: Randomized & Parallel
import { randomizedQuickSort } from '../algorithms/randomized/randomizedQuickSort.js';
import { reservoirSample } from '../algorithms/randomized/reservoirSampling.js';
import { millerRabinTest } from '../algorithms/randomized/millerRabin.js';
import { blellochScan } from '../algorithms/randomized/blellochScan.js';
import { parallelReduce, calculateBrentSpeedup } from '../algorithms/randomized/brentVisualization.js';

export default function AlgorithmLab() {
  const [activeModule, setActiveModule] = useState('M1');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('kmp');
  const [executionResult, setExecutionResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  // M1 Inputs
  const [m1Text, setM1Text] = useState('Artificial Intelligence and Machine Learning models rely on neural networks and deep learning for intelligent inference.');
  const [m1Pattern, setM1Pattern] = useState('neural networks');
  const [m1PatternsList, setM1PatternsList] = useState('AI, neural networks, machine learning, deep learning');

  // M2 Inputs
  const [m2Text, setM2Text] = useState('banana$');

  // M3 Inputs
  const [m3Word1, setM3Word1] = useState('machien');
  const [m3Word2, setM3Word2] = useState('machine');
  const [m3Dimensions, setM3Dimensions] = useState('10, 30, 5, 60, 20');

  // M4 Inputs (Network Flow Graph)
  const [m4Nodes, setM4Nodes] = useState([
    { id: 'Source' }, { id: 'Transcoder' }, { id: 'Edge-US' }, { id: 'Edge-EU' }, { id: 'Sink' }
  ]);
  const [m4Edges, setM4Edges] = useState([
    { from: 'Source', to: 'Transcoder', capacity: 16 },
    { from: 'Source', to: 'Edge-US', capacity: 13 },
    { from: 'Transcoder', to: 'Edge-US', capacity: 10 },
    { from: 'Transcoder', to: 'Edge-EU', capacity: 12 },
    { from: 'Edge-US', to: 'Edge-EU', capacity: 9 },
    { from: 'Edge-US', to: 'Sink', capacity: 14 },
    { from: 'Edge-EU', to: 'Sink', capacity: 20 }
  ]);

  // M5 Inputs
  const [m5Variables, setM5Variables] = useState(4);
  const [m5Clauses, setM5Clauses] = useState('1 -2 3, -1 2 4, -3 -4 2, 1 3 -4');
  const [m5GraphNodes, setM5GraphNodes] = useState('A, B, C, D, E, F');
  const [m5GraphEdges, setM5GraphEdges] = useState('A-B, A-C, B-C, C-D, D-E, D-F, E-F');

  // M6 Inputs
  const [m6Array, setM6Array] = useState('42, 17, 89, 5, 63, 28, 94, 31, 76, 12, 55');
  const [m6PrimeCandidate, setM6PrimeCandidate] = useState(104729); // 10000th prime
  const [m6BrentWork, setM6BrentWork] = useState(1024);
  const [m6BrentDepth, setM6BrentDepth] = useState(32);

  const modules = [
    { id: 'M1', name: 'String Search', desc: 'Exact & multi-keyword pattern matching' },
    { id: 'M2', name: 'Indexing & Suffix Structures', desc: 'Suffix arrays, LCP Kasai & DAWG automata' },
    { id: 'M3', name: 'Dynamic Programming', desc: 'Edit distances, Matrix chain multiplication & bitmasks' },
    { id: 'M4', name: 'Network Flow & Distribution', desc: 'Dinic, Edmonds-Karp, Min-Cut & Bipartite matching' },
    { id: 'M5', name: 'NP-Completeness & Approx', desc: 'DPLL 3-SAT, Max Clique, Vertex Cover & Independent Set' },
    { id: 'M6', name: 'Randomized & Parallel', desc: 'Randomized QuickSort, Reservoir, Miller-Rabin & Blelloch scan' },
  ];

  const handleRunAlgorithm = () => {
    setIsRunning(true);
    setExecutionResult(null);

    setTimeout(() => {
      let res = null;

      try {
        switch (selectedAlgorithm) {
          // MODULE 1
          case 'kmp':
            res = kmpSearch(m1Text, m1Pattern);
            break;
          case 'zFunction':
            res = zSearch(m1Text, m1Pattern);
            break;
          case 'rabinKarp':
            res = rabinKarpSearch(m1Text, m1Pattern);
            break;
          case 'ahoCorasick':
            const patArr = m1PatternsList.split(',').map(s => s.trim()).filter(Boolean);
            res = ahoCorasickMultiSearch(m1Text, patArr);
            break;

          // MODULE 2
          case 'suffixArray': {
            const saRes = buildSuffixArray(m2Text);
            const lcpRes = buildLCPArray(m2Text, saRes.suffixArray);
            res = {
              algorithm: 'Suffix Array & Kasai LCP Array',
              text: m2Text,
              suffixArray: saRes.suffixArray,
              lcpArray: lcpRes.lcp,
              details: saRes.details,
              lcpSteps: lcpRes.steps,
              complexity: 'Construction: O(N log N) / LCP: O(N) Kasai'
            };
            break;
          }
          case 'suffixAutomaton': {
            const sam = new SuffixAutomaton(m2Text);
            const samInfo = sam.getLongestRepeatedSubstring();
            res = {
              algorithm: 'Suffix Automaton (DAWG)',
              text: m2Text,
              stateCount: samInfo.stateCount,
              distinctSubstrings: samInfo.distinctSubstrings,
              states: sam.st.slice(0, 15).map((s, idx) => ({
                id: idx,
                len: s.len,
                link: s.link,
                nextChars: Object.keys(s.next).join(', ')
              })),
              complexity: 'Time O(N), Space O(N)'
            };
            break;
          }

          // MODULE 3
          case 'levenshtein':
            res = levenshteinDistance(m3Word1, m3Word2);
            break;
          case 'damerau':
            res = damerauLevenshteinDistance(m3Word1, m3Word2);
            break;
          case 'matrixChain': {
            const dims = m3Dimensions.split(',').map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n));
            res = matrixChainOrder(dims);
            break;
          }
          case 'bitmaskDP': {
            const sampleMedia = [
              { id: '1', title: 'Intro to Python', topic: 'Python', tags: ['programming'], relevance: 9 },
              { id: '2', title: 'Deep Neural Networks', topic: 'Deep Learning', tags: ['AI', 'neural networks'], relevance: 8 },
              { id: '3', title: 'Machine Learning Algorithms', topic: 'Machine Learning', tags: ['AI', 'algorithms'], relevance: 9 },
              { id: '4', title: 'Computer Vision Transformers', topic: 'Computer Vision', tags: ['AI', 'Deep Learning'], relevance: 8 },
              { id: '5', title: 'Cloud DevOps Pipelines', topic: 'Cloud Computing', tags: ['devops'], relevance: 7 }
            ];
            res = optimizeContentSelection(sampleMedia, ['AI', 'Deep Learning', 'Machine Learning', 'Python'], 3);
            break;
          }

          // MODULE 4
          case 'edmondsKarp':
            res = runEdmondsKarp({ nodes: m4Nodes, edges: m4Edges, source: 'Source', sink: 'Sink' });
            break;
          case 'dinic':
            res = runDinic({ nodes: m4Nodes, edges: m4Edges, source: 'Source', sink: 'Sink' });
            break;
          case 'minCut':
            res = computeMinCut({ nodes: m4Nodes, edges: m4Edges, source: 'Source', sink: 'Sink' });
            break;
          case 'bipartite': {
            const left = ['Article-1', 'Article-2', 'Video-1', 'Research-1', 'Course-1'];
            const right = ['Channel-Tech', 'Channel-AI', 'Channel-Education', 'Channel-Science'];
            const edges = [
              ['Article-1', 'Channel-Tech'], ['Article-1', 'Channel-AI'],
              ['Article-2', 'Channel-AI'],
              ['Video-1', 'Channel-AI'], ['Video-1', 'Channel-Tech'],
              ['Research-1', 'Channel-Science'], ['Research-1', 'Channel-AI'],
              ['Course-1', 'Channel-Education'], ['Course-1', 'Channel-Tech']
            ];
            res = maxBipartiteMatching(left, right, edges);
            break;
          }

          // MODULE 5
          case 'sat': {
            const parsedClauses = m5Clauses.split(',').map(c =>
              c.trim().split(/\s+/).map(lit => parseInt(lit.trim(), 10)).filter(n => !isNaN(n))
            ).filter(c => c.length > 0);
            res = solveSAT(parsedClauses, m5Variables);
            break;
          }
          case 'clique': {
            const nodes = m5GraphNodes.split(',').map(s => s.trim()).filter(Boolean);
            const edges = m5GraphEdges.split(',').map(e => e.trim().split('-').map(x => x.trim()));
            res = findMaxClique(nodes, edges);
            break;
          }
          case 'vertexCover': {
            const nodes = m5GraphNodes.split(',').map(s => s.trim()).filter(Boolean);
            const edges = m5GraphEdges.split(',').map(e => e.trim().split('-').map(x => x.trim()));
            const exact = exactVertexCover(nodes, edges);
            const approx = approximateVertexCover2(nodes, edges);
            res = {
              algorithm: 'Minimum Vertex Cover (Exact vs 2-Approximation)',
              exactCover: exact.exactCover,
              exactSize: exact.size,
              approximateCover: approx.approximateCover,
              approxSize: approx.size,
              matchedEdges: approx.matchedEdges,
              guarantee: approx.guarantee
            };
            break;
          }
          case 'independentSet': {
            const nodes = m5GraphNodes.split(',').map(s => s.trim()).filter(Boolean);
            const edges = m5GraphEdges.split(',').map(e => e.trim().split('-').map(x => x.trim()));
            res = findMaxIndependentSet(nodes, edges);
            break;
          }

          // MODULE 6
          case 'quickSort': {
            const arr = m6Array.split(',').map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n));
            res = randomizedQuickSort(arr);
            break;
          }
          case 'reservoir': {
            const stream = m6Array.split(',').map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n));
            res = reservoirSample(stream, 4);
            break;
          }
          case 'millerRabin':
            res = millerRabinTest(m6PrimeCandidate, 6);
            break;
          case 'blelloch': {
            const arr = m6Array.split(',').map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n));
            res = blellochScan(arr);
            break;
          }
          case 'brent':
            res = calculateBrentSpeedup(m6BrentWork, m6BrentDepth, 16);
            break;

          default:
            res = { error: 'Unknown algorithm' };
        }
      } catch (err) {
        res = { error: err.message };
      }

      setExecutionResult(res);
      setIsRunning(false);
    }, 150);
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Page Title & Overview */}
      <div className="border-b border-indigo-950/40 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs uppercase font-semibold text-cyan-400 tracking-wider">Interactive Computer Science Lab</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Cpu className="w-7 h-7 text-indigo-400" />
          <span>Algorithm Laboratory & Complexity Visualizer</span>
        </h1>
        <p className="text-xs text-slate-300 mt-1">
          Run verified implementations of 20+ foundational data structures and algorithms directly in your browser. Inspect intermediate DP tables, suffix arrays, augmenting flow paths, and probabilistic witness checks.
        </p>
      </div>

      {/* Module Navigation Tabs (M1 to M6) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {modules.map(mod => {
          const isSelected = activeModule === mod.id;
          return (
            <button
              key={mod.id}
              onClick={() => {
                setActiveModule(mod.id);
                // Set default algorithm for selected module
                if (mod.id === 'M1') setSelectedAlgorithm('kmp');
                if (mod.id === 'M2') setSelectedAlgorithm('suffixArray');
                if (mod.id === 'M3') setSelectedAlgorithm('levenshtein');
                if (mod.id === 'M4') setSelectedAlgorithm('dinic');
                if (mod.id === 'M5') setSelectedAlgorithm('sat');
                if (mod.id === 'M6') setSelectedAlgorithm('quickSort');
                setExecutionResult(null);
              }}
              className={`p-3 rounded-2xl text-left border transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                  : 'bg-navy-900/60 hover:bg-navy-900 border-indigo-950/50 text-slate-300 hover:text-white'
              }`}
            >
              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-indigo-400'
              }`}>
                {mod.id}
              </span>
              <p className="text-xs font-bold mt-1.5 line-clamp-1">{mod.name}</p>
              <p className={`text-[10px] mt-0.5 line-clamp-1 ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                {mod.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main Algorithm Workspace Card */}
      <div className="p-6 rounded-3xl glass-panel space-y-6">
        {/* Algorithm Sub-Selector & Complexity Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-950/40 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Select Algorithm:</span>

            {/* M1 Selectors */}
            {activeModule === 'M1' && (
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'kmp', label: 'Knuth-Morris-Pratt (KMP)' },
                  { id: 'zFunction', label: 'Z-Function' },
                  { id: 'rabinKarp', label: 'Rabin-Karp Rolling Hash' },
                  { id: 'ahoCorasick', label: 'Aho-Corasick Multi-Pattern' }
                ].map(a => (
                  <button
                    key={a.id}
                    onClick={() => { setSelectedAlgorithm(a.id); setExecutionResult(null); }}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      selectedAlgorithm === a.id ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            )}

            {/* M2 Selectors */}
            {activeModule === 'M2' && (
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'suffixArray', label: 'Suffix Array & Kasai LCP' },
                  { id: 'suffixAutomaton', label: 'Suffix Automaton (DAWG)' }
                ].map(a => (
                  <button
                    key={a.id}
                    onClick={() => { setSelectedAlgorithm(a.id); setExecutionResult(null); }}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      selectedAlgorithm === a.id ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            )}

            {/* M3 Selectors */}
            {activeModule === 'M3' && (
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'levenshtein', label: 'Levenshtein Distance' },
                  { id: 'damerau', label: 'Damerau-Levenshtein' },
                  { id: 'matrixChain', label: 'Matrix Chain DP' },
                  { id: 'bitmaskDP', label: 'Bitmask Topic Selection' }
                ].map(a => (
                  <button
                    key={a.id}
                    onClick={() => { setSelectedAlgorithm(a.id); setExecutionResult(null); }}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      selectedAlgorithm === a.id ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            )}

            {/* M4 Selectors */}
            {activeModule === 'M4' && (
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'dinic', label: "Dinic's Algorithm" },
                  { id: 'edmondsKarp', label: 'Edmonds-Karp Max Flow' },
                  { id: 'minCut', label: 'Minimum Cut (S-T)' },
                  { id: 'bipartite', label: 'Max Bipartite Matching' }
                ].map(a => (
                  <button
                    key={a.id}
                    onClick={() => { setSelectedAlgorithm(a.id); setExecutionResult(null); }}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      selectedAlgorithm === a.id ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            )}

            {/* M5 Selectors */}
            {activeModule === 'M5' && (
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'sat', label: 'DPLL 3-SAT Solver' },
                  { id: 'clique', label: 'Maximum Clique' },
                  { id: 'vertexCover', label: 'Vertex Cover (Exact vs 2-Approx)' },
                  { id: 'independentSet', label: 'Max Independent Set' }
                ].map(a => (
                  <button
                    key={a.id}
                    onClick={() => { setSelectedAlgorithm(a.id); setExecutionResult(null); }}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      selectedAlgorithm === a.id ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            )}

            {/* M6 Selectors */}
            {activeModule === 'M6' && (
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'quickSort', label: 'Randomized QuickSort' },
                  { id: 'reservoir', label: 'Reservoir Sampling' },
                  { id: 'millerRabin', label: 'Miller-Rabin Primality' },
                  { id: 'blelloch', label: 'Blelloch Parallel Scan' },
                  { id: 'brent', label: "Brent's Work-Depth Theorem" }
                ].map(a => (
                  <button
                    key={a.id}
                    onClick={() => { setSelectedAlgorithm(a.id); setExecutionResult(null); }}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      selectedAlgorithm === a.id ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleRunAlgorithm}
            disabled={isRunning}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 shrink-0"
          >
            {isRunning ? (
              <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-white" />
            )}
            <span>Execute Computation</span>
          </button>
        </div>

        {/* Dynamic Input Controls per Module/Algorithm */}
        <div className="p-4 rounded-2xl bg-navy-900/60 border border-indigo-950/40 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Interactive Input Parameters
          </span>

          {/* M1 Inputs */}
          {activeModule === 'M1' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Target Corpus Text:</label>
                <textarea
                  rows={2}
                  value={m1Text}
                  onChange={(e) => setM1Text(e.target.value)}
                  className="w-full bg-navy-950 border border-indigo-900/40 rounded-xl p-2.5 text-xs text-slate-200 font-mono"
                />
              </div>

              {selectedAlgorithm === 'ahoCorasick' ? (
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Comma-separated Keywords to search in single pass:</label>
                  <input
                    type="text"
                    value={m1PatternsList}
                    onChange={(e) => setM1PatternsList(e.target.value)}
                    className="w-full bg-navy-950 border border-indigo-900/40 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Pattern to Search:</label>
                  <input
                    type="text"
                    value={m1Pattern}
                    onChange={(e) => setM1Pattern(e.target.value)}
                    className="w-full bg-navy-950 border border-indigo-900/40 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono"
                  />
                </div>
              )}
            </div>
          )}

          {/* M2 Inputs */}
          {activeModule === 'M2' && (
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Text for Suffix Structures (appended with $ delimiter):</label>
              <input
                type="text"
                value={m2Text}
                onChange={(e) => setM2Text(e.target.value)}
                className="w-full bg-navy-950 border border-indigo-900/40 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono"
              />
            </div>
          )}

          {/* M3 Inputs */}
          {activeModule === 'M3' && (
            <div className="space-y-3">
              {(selectedAlgorithm === 'levenshtein' || selectedAlgorithm === 'damerau') && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Source String:</label>
                    <input
                      type="text"
                      value={m3Word1}
                      onChange={(e) => setM3Word1(e.target.value)}
                      className="w-full bg-navy-950 border border-indigo-900/40 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Target String:</label>
                    <input
                      type="text"
                      value={m3Word2}
                      onChange={(e) => setM3Word2(e.target.value)}
                      className="w-full bg-navy-950 border border-indigo-900/40 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono"
                    />
                  </div>
                </div>
              )}
              {selectedAlgorithm === 'matrixChain' && (
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Matrix Chain Dimensions (e.g. 10, 30, 5, 60, 20):</label>
                  <input
                    type="text"
                    value={m3Dimensions}
                    onChange={(e) => setM3Dimensions(e.target.value)}
                    className="w-full bg-navy-950 border border-indigo-900/40 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono"
                  />
                </div>
              )}
            </div>
          )}

          {/* M4 Inputs (Network Flow Edge Capacities) */}
          {activeModule === 'M4' && (
            <div className="space-y-2">
              <p className="text-[11px] text-slate-300">
                Media Content Distribution Network: Source → Transcoder → Edge Nodes → Viewers (Sink)
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {m4Edges.map((e, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-navy-950 border border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono">{e.from} → {e.to}</span>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={e.capacity}
                      onChange={(ev) => {
                        const val = parseInt(ev.target.value, 10) || 1;
                        const copy = [...m4Edges];
                        copy[idx] = { ...copy[idx], capacity: val };
                        setM4Edges(copy);
                      }}
                      className="w-12 bg-slate-900 text-cyan-300 font-mono text-center text-xs rounded border border-slate-700 py-0.5"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* M5 Inputs */}
          {activeModule === 'M5' && (
            <div className="space-y-3">
              {selectedAlgorithm === 'sat' ? (
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">CNF Clauses (space-separated literals, comma-separated clauses):</label>
                  <input
                    type="text"
                    value={m5Clauses}
                    onChange={(e) => setM5Clauses(e.target.value)}
                    className="w-full bg-navy-950 border border-indigo-900/40 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Graph Vertices:</label>
                    <input
                      type="text"
                      value={m5GraphNodes}
                      onChange={(e) => setM5GraphNodes(e.target.value)}
                      className="w-full bg-navy-950 border border-indigo-900/40 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Graph Edges (e.g. A-B, B-C):</label>
                    <input
                      type="text"
                      value={m5GraphEdges}
                      onChange={(e) => setM5GraphEdges(e.target.value)}
                      className="w-full bg-navy-950 border border-indigo-900/40 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* M6 Inputs */}
          {activeModule === 'M6' && (
            <div className="space-y-3">
              {selectedAlgorithm === 'millerRabin' ? (
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Integer Candidate for Primality Testing:</label>
                  <input
                    type="number"
                    value={m6PrimeCandidate}
                    onChange={(e) => setM6PrimeCandidate(parseInt(e.target.value, 10) || 2)}
                    className="w-full bg-navy-950 border border-indigo-900/40 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono"
                  />
                </div>
              ) : selectedAlgorithm === 'brent' ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Total Sequential Work (W):</label>
                    <input
                      type="number"
                      value={m6BrentWork}
                      onChange={(e) => setM6BrentWork(parseInt(e.target.value, 10) || 100)}
                      className="w-full bg-navy-950 border border-indigo-900/40 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Critical Path Depth / Span (D):</label>
                    <input
                      type="number"
                      value={m6BrentDepth}
                      onChange={(e) => setM6BrentDepth(parseInt(e.target.value, 10) || 10)}
                      className="w-full bg-navy-950 border border-indigo-900/40 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Comma-separated Number Array:</label>
                  <input
                    type="text"
                    value={m6Array}
                    onChange={(e) => setM6Array(e.target.value)}
                    className="w-full bg-navy-950 border border-indigo-900/40 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Execution Results Viewport */}
        {executionResult ? (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-indigo-950/40">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  Computed Output: {executionResult.algorithm || selectedAlgorithm.toUpperCase()}
                </h3>
              </div>
              <span className="text-xs font-mono text-cyan-400">
                Status: Complete (Browser Thread)
              </span>
            </div>

            {/* A. KMP / String Results */}
            {selectedAlgorithm === 'kmp' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-navy-900/60 border border-indigo-950/40">
                    <span className="text-[10px] text-slate-400">Matches Found:</span>
                    <p className="text-xl font-bold text-cyan-400 font-mono mt-0.5">{executionResult.count}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-navy-900/60 border border-indigo-950/40">
                    <span className="text-[10px] text-slate-400">Start Indices:</span>
                    <p className="text-xs font-bold text-white font-mono mt-1">[{executionResult.matches.join(', ')}]</p>
                  </div>
                  <div className="p-3 rounded-xl bg-navy-900/60 border border-indigo-950/40">
                    <span className="text-[10px] text-slate-400">Time Complexity:</span>
                    <p className="text-xs font-bold text-emerald-400 font-mono mt-1">O(N + M) Time</p>
                  </div>
                </div>

                {/* LPS Table Display */}
                <div className="p-3 rounded-xl bg-navy-950/80 border border-indigo-900/50 space-y-2">
                  <span className="text-xs font-semibold text-indigo-300">Computed LPS (Longest Proper Prefix/Suffix) Array:</span>
                  <div className="flex flex-wrap gap-1 font-mono text-xs">
                    {m1Pattern.split('').map((char, i) => (
                      <div key={i} className="flex flex-col items-center bg-slate-900 p-1 rounded border border-slate-800 min-w-[28px]">
                        <span className="text-slate-400 text-[10px]">{char}</span>
                        <span className="text-cyan-400 font-bold">{executionResult.lps[i]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* B. Aho-Corasick Multi-Pattern Results */}
            {selectedAlgorithm === 'ahoCorasick' && (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-navy-900/60 border border-indigo-950/40">
                    <span className="text-[10px] text-slate-400">Total Occurrences:</span>
                    <p className="text-xl font-bold text-cyan-400 font-mono mt-0.5">{executionResult.matchCount}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-navy-900/60 border border-indigo-950/40">
                    <span className="text-[10px] text-slate-400">Keywords Detected:</span>
                    <p className="text-xs font-bold text-white font-mono mt-1">
                      {Object.keys(executionResult.patternCounts).length} patterns
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-navy-900/60 border border-indigo-950/40">
                    <span className="text-[10px] text-slate-400">Pass Count:</span>
                    <p className="text-xs font-bold text-emerald-400 font-mono mt-1">1 Single Stream Pass</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-navy-950/80 border border-indigo-900/50 space-y-1 text-xs">
                  <span className="font-semibold text-slate-300">Multi-Keyword Matches:</span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {Object.entries(executionResult.patternCounts).map(([pat, count]) => (
                      <span key={pat} className="px-2.5 py-1 rounded bg-indigo-900/40 text-indigo-300 font-mono border border-indigo-800/40">
                        "{pat}" : {count}x
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* C. Levenshtein / Damerau Distance Table */}
            {(selectedAlgorithm === 'levenshtein' || selectedAlgorithm === 'damerau') && (
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-navy-900/60 border border-indigo-950/40">
                    <span className="text-[10px] text-slate-400">Edit Distance:</span>
                    <p className="text-2xl font-bold text-cyan-400 font-mono">{executionResult.distance}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-navy-900/60 border border-indigo-950/40">
                    <span className="text-[10px] text-slate-400">Transposition Allowed:</span>
                    <p className="text-xs font-bold text-emerald-400 font-mono mt-1">
                      {selectedAlgorithm === 'damerau' ? 'Yes (Damerau)' : 'No (Standard Levenshtein)'}
                    </p>
                  </div>
                </div>

                {/* DP Table */}
                {executionResult.matrix && (
                  <div className="p-3 rounded-xl bg-navy-950/90 border border-indigo-900/50 overflow-x-auto space-y-1">
                    <span className="text-[11px] font-semibold text-slate-400">Dynamic Programming Distance Matrix:</span>
                    <table className="text-xs font-mono border-collapse">
                      <tbody>
                        {executionResult.matrix.slice(0, 10).map((row, r) => (
                          <tr key={r}>
                            {row.slice(0, 15).map((val, c) => (
                              <td key={c} className="p-1.5 border border-slate-800 text-center text-slate-300">
                                {val}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* D. Matrix Chain Multiplication DP */}
            {selectedAlgorithm === 'matrixChain' && (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/40 space-y-1">
                  <span className="text-xs font-semibold text-slate-300">Optimal Parenthesization Order:</span>
                  <p className="text-lg font-mono font-bold text-cyan-400">{executionResult.optimalParenthesization}</p>
                  <p className="text-xs text-slate-400">
                    Minimum Scalar Multiplications: <span className="font-mono text-white font-bold">{executionResult.minScalarMultiplications}</span>
                  </p>
                </div>
              </div>
            )}

            {/* E. Dinic / Network Flow / Min-Cut Results */}
            {(selectedAlgorithm === 'dinic' || selectedAlgorithm === 'edmondsKarp' || selectedAlgorithm === 'minCut') && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-navy-900/60 border border-indigo-950/40">
                    <span className="text-[10px] text-slate-400">Maximum Network Flow:</span>
                    <p className="text-2xl font-bold text-emerald-400 font-mono mt-0.5">{executionResult.maxFlow}</p>
                  </div>
                  {executionResult.cutCapacity !== undefined && (
                    <div className="p-3 rounded-xl bg-navy-900/60 border border-indigo-950/40">
                      <span className="text-[10px] text-slate-400">Minimum Cut Capacity:</span>
                      <p className="text-2xl font-bold text-cyan-400 font-mono mt-0.5">{executionResult.cutCapacity}</p>
                    </div>
                  )}
                  <div className="p-3 rounded-xl bg-navy-900/60 border border-indigo-950/40">
                    <span className="text-[10px] text-slate-400">Theorem Verification:</span>
                    <p className="text-xs font-bold text-white mt-1">Max-Flow == Min-Cut</p>
                  </div>
                </div>

                {/* Edge flow distribution table */}
                <div className="p-3 rounded-xl bg-navy-950/90 border border-indigo-900/50 space-y-2">
                  <span className="text-xs font-semibold text-slate-300">Residual & Flow Allocation per Channel:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                    {executionResult.edgeFlows?.map((e, idx) => (
                      <div key={idx} className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                        <span className="text-slate-300">{e.from} → {e.to}</span>
                        <span className={`${e.isSaturated ? 'text-amber-400 font-bold' : 'text-cyan-400'}`}>
                          {e.flow} / {e.capacity} {e.isSaturated ? '(Saturated)' : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* F. SAT Solver / Clique / Vertex Cover */}
            {selectedAlgorithm === 'sat' && (
              <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/40 space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                    executionResult.isSatisfiable ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                  }`}>
                    {executionResult.isSatisfiable ? 'SATISFIABLE' : 'UNSATISFIABLE'}
                  </span>
                  <span className="text-xs text-slate-300 font-mono">
                    Decisions: {executionResult.decisions}
                  </span>
                </div>
                {executionResult.isSatisfiable && (
                  <div className="text-xs font-mono text-cyan-300 bg-slate-900 p-2 rounded">
                    Truth Assignment: {JSON.stringify(executionResult.assignment)}
                  </div>
                )}
              </div>
            )}

            {selectedAlgorithm === 'vertexCover' && (
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-navy-900/60 border border-indigo-950/40 space-y-1">
                  <span className="font-semibold text-emerald-400">Exact Branch & Bound:</span>
                  <p className="font-mono text-white">Size: {executionResult.exactSize} vertices</p>
                  <p className="font-mono text-cyan-300">[{executionResult.exactCover.join(', ')}]</p>
                </div>
                <div className="p-3 rounded-xl bg-navy-900/60 border border-indigo-950/40 space-y-1">
                  <span className="font-semibold text-amber-400">2-Approximation Heuristic:</span>
                  <p className="font-mono text-white">Size: {executionResult.approxSize} vertices</p>
                  <p className="font-mono text-amber-300">[{executionResult.approximateCover.join(', ')}]</p>
                  <p className="text-[10px] text-slate-400">{executionResult.guarantee}</p>
                </div>
              </div>
            )}

            {/* G. Randomized & Parallel Results */}
            {selectedAlgorithm === 'millerRabin' && (
              <div className="p-4 rounded-xl bg-navy-950/80 border border-indigo-900/50 space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold font-mono px-2.5 py-1 rounded-lg ${
                    executionResult.isPrime ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}>
                    {executionResult.isPrime ? 'PROBABLE PRIME' : 'COMPOSITE'}
                  </span>
                </div>
                <p className="text-xs text-slate-200">{executionResult.explanation}</p>
              </div>
            )}

            {selectedAlgorithm === 'quickSort' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-navy-900/60 border border-indigo-950/40">
                    <span className="text-[10px] text-slate-400">Total Comparisons:</span>
                    <p className="text-xl font-bold text-cyan-400 font-mono mt-0.5">{executionResult.totalComparisons}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-navy-900/60 border border-indigo-950/40">
                    <span className="text-[10px] text-slate-400">Total Swaps:</span>
                    <p className="text-xl font-bold text-indigo-400 font-mono mt-0.5">{executionResult.totalSwaps}</p>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-navy-900/80 border border-indigo-900/50 font-mono text-xs text-white">
                  Sorted Result: [{executionResult.sortedArray.join(', ')}]
                </div>
              </div>
            )}

            {selectedAlgorithm === 'brent' && (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-xs">
                  <p className="font-semibold text-white">{executionResult.lawSummary}</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  {executionResult.data.slice(0, 8).map(d => (
                    <div key={d.processors} className="p-2 rounded bg-slate-900 border border-slate-800 space-y-0.5">
                      <span className="text-indigo-300 font-bold">Cores: {d.processors}</span>
                      <p className="text-slate-400 text-[10px]">Time: {d.brentTime}</p>
                      <p className="text-cyan-400 font-bold">{d.speedup}x speedup</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 text-xs space-y-2 border border-dashed border-indigo-950/60 rounded-2xl">
            <Play className="w-6 h-6 mx-auto text-indigo-400 opacity-60" />
            <p>Click "Execute Computation" to run the algorithm on your input data.</p>
          </div>
        )}
      </div>
    </div>
  );
}
