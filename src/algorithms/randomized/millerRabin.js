/**
 * Miller-Rabin Probabilistic Primality Test
 * Determines whether a given integer n is prime with error probability <= 4^(-k).
 * Uses modular exponentiation and quadratic residue testing.
 */

// Modular exponentiation (base^exp % mod) using BigInt for precision
function powerMod(base, exp, mod) {
  let res = 1n;
  let b = BigInt(base) % BigInt(mod);
  let e = BigInt(exp);
  const m = BigInt(mod);

  while (e > 0n) {
    if (e % 2n === 1n) {
      res = (res * b) % m;
    }
    e = e / 2n;
    b = (b * b) % m;
  }
  return Number(res);
}

export function millerRabinTest(n, rounds = 5) {
  if (n <= 1) return { isPrime: false, explanation: `${n} is not prime by definition.` };
  if (n <= 3) return { isPrime: true, explanation: `${n} is a prime number.` };
  if (n % 2 === 0) return { isPrime: false, explanation: `${n} is even and > 2, hence composite.` };

  // Write n - 1 as 2^s * d with d odd
  let d = n - 1;
  let s = 0;
  while (d % 2 === 0) {
    d /= 2;
    s++;
  }

  const witnessSteps = [];

  for (let r = 0; r < rounds; r++) {
    // Pick random base a in [2, n - 2]
    const a = 2 + Math.floor(Math.random() * (n - 3));
    let x = powerMod(a, d, n);

    let roundPassed = false;
    let details = `Round ${r + 1}: base a=${a}. Computed a^d mod n = ${x}.`;

    if (x === 1 || x === n - 1) {
      roundPassed = true;
      details += ` Passed initial check (x == 1 or x == n-1).`;
    } else {
      for (let i = 1; i < s; i++) {
        x = powerMod(x, 2, n);
        if (x === n - 1) {
          roundPassed = true;
          details += ` Passed at step 2^${i} (x == n-1).`;
          break;
        }
      }
    }

    witnessSteps.push({
      round: r + 1,
      base: a,
      passed: roundPassed,
      details
    });

    if (!roundPassed) {
      return {
        isPrime: false,
        confidence: 1.0,
        witnessFound: a,
        s,
        d,
        witnessSteps,
        explanation: `${n} is definitively composite! Witness a=${a} proves compositeness.`
      };
    }
  }

  const errorBound = Math.pow(0.25, rounds);
  return {
    isPrime: true,
    confidence: 1 - errorBound,
    roundsCompleted: rounds,
    s,
    d,
    witnessSteps,
    explanation: `${n} is prime (probability >= ${(100 * (1 - errorBound)).toFixed(4)}% after ${rounds} rounds).`
  };
}
