'use strict';
/**
 * Contributions and payments service — core business rules (bid prototype).
 * In production these run behind the API Gateway and call NISSS's REST APIs
 * through the integration layer; payment card data is handled only by the
 * payment provider (hosted page / tokenisation), never by this service.
 */

const MONEY = (n) => Math.round(n * 100) / 100;

/** Outstanding months, oldest first. */
function outstanding(history) {
  return history.filter((h) => h.status === 'Due').sort((a, b) => a.period.localeCompare(b.period));
}

/**
 * Build a payment request for the selected periods.
 * Rejects empty selections, unknown periods and periods already paid,
 * and uses an idempotency key so a retried request can never charge twice.
 */
function buildPayment(history, periods, idempotencyKey) {
  if (!Array.isArray(periods) || periods.length === 0) throw new Error('Select at least one period');
  if (!idempotencyKey || String(idempotencyKey).length < 16) throw new Error('A unique idempotency key is required');
  const byPeriod = new Map(history.map((h) => [h.period, h]));
  const lines = periods.map((p) => {
    const row = byPeriod.get(p);
    if (!row) throw new Error(`Unknown period ${p}`);
    if (row.status !== 'Due') throw new Error(`Period ${p} is already paid`);
    return { period: p, amount: MONEY(row.amountDue) };
  });
  const total = MONEY(lines.reduce((a, l) => a + l.amount, 0));
  return { idempotencyKey, lines, total, currency: 'BBD' };
}

/** Apply a confirmed payment and return the receipt; history is not mutated. */
function applyPayment(history, payment, receiptNo, paidAt) {
  const paid = new Set(payment.lines.map((l) => l.period));
  const updated = history.map((h) => (paid.has(h.period) ? { ...h, status: 'Paid', amountPaid: h.amountDue, receiptNo } : h));
  return { history: updated, receipt: { receiptNo, paidAt, total: payment.total, currency: payment.currency, periods: [...paid] } };
}

module.exports = { outstanding, buildPayment, applyPayment };
