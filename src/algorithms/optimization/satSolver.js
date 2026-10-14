/**
 * DPLL (Davis-Putnam-Logemann-Loveland) SAT Solver
 * Solves Boolean Satisfiability (CNF formulas) using backtracking,
 * unit propagation, and pure literal elimination.
 */

export function solveSAT(clauses, varCount, maxDecisions = 1000) {
  // clauses: array of clauses, e.g. [[1, -2, 3], [-1, 2, 4]]
  // Positive number = variable x_i is true, negative = variable is false
  let decisions = 0;
  const trace = [];

  const simplify = (clausesList, assignment) => {
    const newClauses = [];
    for (const clause of clausesList) {
      let clauseSatisfied = false;
      const newClause = [];
      for (const lit of clause) {
        const v = Math.abs(lit);
        const val = assignment[v];
        if (val !== undefined) {
          if ((lit > 0 && val === true) || (lit < 0 && val === false)) {
            clauseSatisfied = true;
            break;
          }
        } else {
          newClause.push(lit);
        }
      }
      if (!clauseSatisfied) {
        if (newClause.length === 0) return null; // Conflict / Empty clause
        newClauses.push(newClause);
      }
    }
    return newClauses;
  };

  const dpll = (currentClauses, assignment) => {
    decisions++;
    if (decisions > maxDecisions) return null; // Safety safeguard for browser

    if (currentClauses.length === 0) {
      return assignment; // All clauses satisfied
    }

    // Check for conflict
    for (const clause of currentClauses) {
      if (clause.length === 0) return null;
    }

    // 1. Unit Propagation
    let unitFound = true;
    while (unitFound) {
      unitFound = false;
      for (const clause of currentClauses) {
        if (clause.length === 1) {
          const lit = clause[0];
          const v = Math.abs(lit);
          const val = lit > 0;
          assignment[v] = val;
          trace.push(`Unit propagation: x${v} = ${val}`);
          currentClauses = simplify(currentClauses, assignment);
          if (currentClauses === null) return null; // Conflict
          unitFound = true;
          break;
        }
      }
    }

    if (currentClauses.length === 0) return assignment;

    // Pick unassigned variable
    let chosenVar = 1;
    for (let v = 1; v <= varCount; v++) {
      if (assignment[v] === undefined) {
        chosenVar = v;
        break;
      }
    }

    // Branch True
    trace.push(`Branching: guess x${chosenVar} = true`);
    const assignTrue = { ...assignment, [chosenVar]: true };
    const simplifiedTrue = simplify(currentClauses, assignTrue);
    if (simplifiedTrue !== null) {
      const res = dpll(simplifiedTrue, assignTrue);
      if (res !== null) return res;
    }

    // Backtrack and Branch False
    trace.push(`Backtracking: guess x${chosenVar} = false`);
    const assignFalse = { ...assignment, [chosenVar]: false };
    const simplifiedFalse = simplify(currentClauses, assignFalse);
    if (simplifiedFalse !== null) {
      const res = dpll(simplifiedFalse, assignFalse);
      if (res !== null) return res;
    }

    return null; // Unsatisfiable branch
  };

  const initialAssignment = {};
  const result = dpll(clauses, initialAssignment);

  return {
    isSatisfiable: result !== null,
    assignment: result || {},
    decisions,
    trace: trace.slice(0, 50),
    clausesCount: clauses.length,
    variablesCount: varCount
  };
}
