/**
 * Evaluation suite for contracts package.
 * Verifies domain boundary invariants, edge cases, and fuzz testing.
 */

import { validateCreateBook, validateUpdateStatus, validateFilterQuery } from '../src/index.js';

interface EvalResult {
  suite: string;
  totalChecks: number;
  passedChecks: number;
  score: number;
  durationMs: number;
  failures: string[];
}

function runContractEval(): EvalResult {
  const start = performance.now();
  const failures: string[] = [];
  let totalChecks = 0;
  let passedChecks = 0;

  function check(name: string, condition: boolean) {
    totalChecks++;
    if (condition) {
      passedChecks++;
    } else {
      failures.push(name);
    }
  }

  // Invariant 1: Status must only ever allow 'unread' or 'read'
  const statuses = ['unread', 'read', 'completed', 'in-progress', 'archived', ''];
  for (const s of statuses) {
    const res = validateUpdateStatus({ status: s });
    if (s === 'unread' || s === 'read') {
      check(`Status '${s}' allowed`, res.isValid === true);
    } else {
      check(`Status '${s}' rejected`, res.isValid === false);
    }
  }

  // Invariant 2: Fuzz create book with weird unicode, long strings, symbols
  const fuzzInputs = [
    { title: '📖 Book with emoji', author: 'Author ✍️', genre: 'Sci-Fi' },
    { title: 'A'.repeat(200), author: 'B'.repeat(150), genre: 'C'.repeat(100) },
    { title: 'A'.repeat(201), author: 'B', genre: 'C', shouldFail: true },
    { title: '\t\n  Special whitespace  \r\n', author: 'Author', genre: 'Genre' }
  ];

  for (const input of fuzzInputs) {
    const res = validateCreateBook(input);
    if (input.shouldFail) {
      check(`Reject over-limit payload (${input.title.length})`, res.isValid === false);
    } else {
      check(`Accept valid edge-case payload '${input.title}'`, res.isValid === true);
    }
  }

  // Invariant 3: Filter query safety
  const filterPermutations = [
    { input: null, expectedStatus: 'all' },
    { input: {}, expectedStatus: 'all' },
    { input: { status: 'read' }, expectedStatus: 'read' },
    { input: { status: 'unread' }, expectedStatus: 'unread' },
    { input: { status: 'DROP TABLE books;' }, expectedStatus: 'all' }
  ];

  for (const perm of filterPermutations) {
    const res = validateFilterQuery(perm.input);
    check(
      `Filter query normalization for ${JSON.stringify(perm.input)}`,
      res.status === perm.expectedStatus
    );
  }

  const durationMs = performance.now() - start;
  const score = totalChecks > 0 ? (passedChecks / totalChecks) * 100 : 0;

  return {
    suite: 'contracts-eval',
    totalChecks,
    passedChecks,
    score,
    durationMs,
    failures
  };
}

const result = runContractEval();
console.log(`[contracts.eval] Score: ${result.score.toFixed(1)}% (${result.passedChecks}/${result.totalChecks} checks) in ${result.durationMs.toFixed(2)}ms`);

if (result.failures.length > 0) {
  console.error('[contracts.eval] Failures:', result.failures);
  process.exit(1);
} else {
  console.log('[contracts.eval] All boundary invariants passed.');
  process.exit(0);
}
