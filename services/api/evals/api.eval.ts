/**
 * API Evaluation Suite for services/api.
 * Measures API conformance, response latency benchmarks, concurrent operations, and error handling.
 */

import request from 'supertest';
import { initializeDatabase } from '../src/db.js';
import { BookRepository } from '../src/repository.js';
import { createApp } from '../src/app.js';

interface EvalMetric {
  name: string;
  passed: boolean;
  details: string;
}

async function runApiEval() {
  const start = performance.now();
  const metrics: EvalMetric[] = [];

  const db = initializeDatabase(':memory:');
  const repo = new BookRepository(db);
  const app = createApp(repo);

  try {
    // Check 1: Concurrency stress check - create 50 books in parallel
    const pStart = performance.now();
    const createPromises = Array.from({ length: 50 }, (_, i) =>
      request(app).post('/api/books').send({
        title: `Concurrent Book ${i}`,
        author: `Author ${i}`,
        genre: `Genre ${i % 5}`,
        status: i % 2 === 0 ? 'read' : 'unread'
      })
    );
    const createResponses = await Promise.all(createPromises);
    const pTime = performance.now() - pStart;
    const allCreated = createResponses.every((r) => r.status === 201 && r.body.data.id);
    metrics.push({
      name: 'Concurrent Ingestion (50 books in parallel)',
      passed: allCreated && pTime < 1000,
      details: `${createResponses.length} books created in ${pTime.toFixed(2)}ms (target <1000ms)`
    });

    // Check 2: Filter correctness under load
    const readListRes = await request(app).get('/api/books?status=read');
    const readCount = readListRes.body.data.length;
    metrics.push({
      name: 'Status Filtering Correctness',
      passed: readCount === 25,
      details: `Expected 25 read books, retrieved ${readCount}`
    });

    // Check 3: Search latency benchmark
    const searchStart = performance.now();
    const searchRes = await request(app).get('/api/books?search=Book 4');
    const searchDuration = performance.now() - searchStart;
    metrics.push({
      name: 'Search Query Response Latency',
      passed: searchDuration < 50 && searchRes.body.data.length > 0,
      details: `Search completed in ${searchDuration.toFixed(2)}ms (target <50ms), matched ${searchRes.body.data.length} records`
    });

    // Check 4: Payload resilience & SQL injection safety
    const injectionAttempt = await request(app)
      .get('/api/books?search=\' OR 1=1; DROP TABLE books; --')
      .expect(200);
    const tableStillExists = repo.findAll();
    metrics.push({
      name: 'SQL Injection Resistance',
      passed: injectionAttempt.status === 200 && Array.isArray(tableStillExists),
      details: 'Parameterized SQL statements resisted injection attempt safely'
    });

    // Check 5: Standard JSON error response conformance
    const badReq = await request(app).post('/api/books').send({});
    const conformsError =
      badReq.status === 400 &&
      badReq.body.success === false &&
      typeof badReq.body.error === 'string' &&
      typeof badReq.body.details === 'object';
    metrics.push({
      name: 'Error Payload Format Conformance',
      passed: conformsError,
      details: 'Error adheres to { success: false, error: string, details: object }'
    });

  } finally {
    db.close();
  }

  const durationMs = performance.now() - start;
  const passedCount = metrics.filter((m) => m.passed).length;
  const totalCount = metrics.length;
  const score = (passedCount / totalCount) * 100;

  console.log(`\n================= API EVALUATION REPORT =================`);
  console.log(`Score: ${score.toFixed(1)}% (${passedCount}/${totalCount} metrics passed) in ${durationMs.toFixed(2)}ms`);
  for (const m of metrics) {
    const symbol = m.passed ? '✓' : '✗';
    console.log(`  ${symbol} [${m.name}] ${m.details}`);
  }
  console.log(`=========================================================\n`);

  if (score < 100) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runApiEval().catch((err) => {
  console.error('Fatal API Eval Error:', err);
  process.exit(1);
});
