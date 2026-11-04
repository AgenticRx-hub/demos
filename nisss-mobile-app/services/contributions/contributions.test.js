'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { outstanding, buildPayment, applyPayment } = require('./contributions');

const history = [
  { period: '2026-08', amountDue: 486.2, status: 'Paid' },
  { period: '2026-10', amountDue: 486.2, status: 'Due' },
  { period: '2026-09', amountDue: 486.2, status: 'Due' },
];
const KEY = 'a1b2c3d4e5f6a7b8c9d0';

test('lists outstanding periods oldest first', () => {
  assert.deepEqual(outstanding(history).map((h) => h.period), ['2026-09', '2026-10']);
});

test('builds a payment with an exact total', () => {
  const p = buildPayment(history, ['2026-09', '2026-10'], KEY);
  assert.equal(p.total, 972.4);
  assert.equal(p.currency, 'BBD');
});

test('refuses empty, unknown and already-paid periods', () => {
  assert.throws(() => buildPayment(history, [], KEY), /at least one/);
  assert.throws(() => buildPayment(history, ['2030-01'], KEY), /Unknown period/);
  assert.throws(() => buildPayment(history, ['2026-08'], KEY), /already paid/);
});

test('requires an idempotency key so retries cannot double-charge', () => {
  assert.throws(() => buildPayment(history, ['2026-09'], 'short'), /idempotency/);
});

test('applying a payment marks periods paid and issues a receipt without mutating input', () => {
  const p = buildPayment(history, ['2026-09'], KEY);
  const { history: h2, receipt } = applyPayment(history, p, 'RCP-265001', '2026-10-15T10:00:00Z');
  assert.equal(h2.find((h) => h.period === '2026-09').status, 'Paid');
  assert.equal(history.find((h) => h.period === '2026-09').status, 'Due');
  assert.equal(receipt.total, 486.2);
  assert.deepEqual(receipt.periods, ['2026-09']);
});
