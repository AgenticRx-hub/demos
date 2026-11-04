'use strict';
// Run with: node --test services/   (Node 18+; no dependencies)
const test = require('node:test');
const assert = require('node:assert/strict');
const { estimate, replacementRate, weeksToMaximum, validate, ILLUSTRATIVE_RULES } = require('./estimator');

test('below the minimum weeks is not eligible and shows the shortfall', () => {
  const r = estimate({ birthYear: 1980, averageWeeklyEarnings: 800, contributionWeeks: 420 });
  assert.equal(r.ok, true);
  assert.equal(r.eligible, false);
  assert.equal(r.weeksShort, 80);
  assert.equal(r.monthlyPension, 0);
});

test('exactly the minimum weeks earns the base rate', () => {
  assert.equal(replacementRate(500), 40);
  const r = estimate({ birthYear: 1971, averageWeeklyEarnings: 1000, contributionWeeks: 500 });
  assert.equal(r.monthlyPension, 1733.33); // 1000 * 40% * 52 / 12
});

test('rate rises 1.25% per completed 50 weeks, not per part block', () => {
  assert.equal(replacementRate(549), 40);
  assert.equal(replacementRate(550), 41.25);
  assert.equal(replacementRate(1000), 52.5);
});

test('rate is capped at the maximum', () => {
  assert.equal(weeksToMaximum(), 1300);
  assert.equal(replacementRate(1300), 60);
  assert.equal(replacementRate(2200), 60);
});

test('pension start year uses the pensionable age', () => {
  const r = estimate({ birthYear: 1971, averageWeeklyEarnings: 820, contributionWeeks: 1500 });
  assert.equal(r.pensionStartYear, 2038);
  assert.equal(r.monthlyPension, 2132);
});

test('invalid input is rejected with clear messages', () => {
  assert.equal(validate({ birthYear: 1971, averageWeeklyEarnings: 500, contributionWeeks: 600 }).length, 0);
  const r = estimate({ birthYear: 'x', averageWeeklyEarnings: -5, contributionWeeks: 1.5 });
  assert.equal(r.ok, false);
  assert.equal(r.errors.length, 3);
  assert.equal(estimate(null).ok, false);
});

test('the illustrative rule set is flagged until NISSS approves it', () => {
  const r = estimate({ birthYear: 1990, averageWeeklyEarnings: 600, contributionWeeks: 800 });
  assert.equal(r.illustrative, true);
  const approved = { ...ILLUSTRATIVE_RULES, id: 'nisss-approved', approvedBy: 'NISSS Benefits' };
  assert.equal(estimate({ birthYear: 1990, averageWeeklyEarnings: 600, contributionWeeks: 800 }, approved).illustrative, false);
});
