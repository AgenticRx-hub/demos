'use strict';
/**
 * NIS Mobile — Benefits Estimator rules engine (Phase 1: old-age contributory pension).
 *
 * Bid prototype by Agentic Rx Inc. for RFP No. NISSS13/15_2026_02.
 *
 * The rules are DATA, not code. NISSS supplies and approves the rule set during
 * requirements validation (RFB §0.4.2 "Development of Logic for the Benefits Estimator").
 * The default rule set below is ILLUSTRATIVE ONLY and must be replaced by the
 * NISSS-approved parameters before release.
 */

const ILLUSTRATIVE_RULES = Object.freeze({
  id: 'illustrative-2026-10',
  approvedBy: null,              // set when NISSS signs off the rule set
  pensionableAge: 67,
  minimumWeeks: 500,             // weeks needed to qualify
  baseRatePct: 40,               // rate earned at the minimum weeks
  stepWeeks: 50,                 // each further block of weeks...
  stepRatePct: 1.25,             // ...adds this much
  maxRatePct: 60,                // cap on the replacement rate
  weeksPerYear: 52,
  monthsPerYear: 12,
});

/** Validate inputs; returns an array of error messages (empty when valid). */
function validate(input) {
  const errors = [];
  const { birthYear, averageWeeklyEarnings, contributionWeeks } = input || {};
  if (!Number.isInteger(birthYear) || birthYear < 1900 || birthYear > 2015) errors.push('birthYear must be a year between 1900 and 2015');
  if (typeof averageWeeklyEarnings !== 'number' || !(averageWeeklyEarnings >= 0)) errors.push('averageWeeklyEarnings must be a non-negative number');
  if (!Number.isInteger(contributionWeeks) || contributionWeeks < 0) errors.push('contributionWeeks must be a non-negative whole number');
  return errors;
}

/** Replacement rate (percentage) earned for a given number of contribution weeks. */
function replacementRate(weeks, rules = ILLUSTRATIVE_RULES) {
  if (weeks < rules.minimumWeeks) return 0;
  const steps = Math.floor((weeks - rules.minimumWeeks) / rules.stepWeeks);
  return Math.min(rules.maxRatePct, rules.baseRatePct + steps * rules.stepRatePct);
}

/** Weeks at which the cap is first reached. */
function weeksToMaximum(rules = ILLUSTRATIVE_RULES) {
  const steps = Math.ceil((rules.maxRatePct - rules.baseRatePct) / rules.stepRatePct);
  return rules.minimumWeeks + steps * rules.stepWeeks;
}

/** Full estimate. Money is rounded to cents only at the end. */
function estimate(input, rules = ILLUSTRATIVE_RULES) {
  const errors = validate(input);
  if (errors.length) return { ok: false, errors };
  const { birthYear, averageWeeklyEarnings, contributionWeeks } = input;
  const ratePct = replacementRate(contributionWeeks, rules);
  const eligible = contributionWeeks >= rules.minimumWeeks;
  const weekly = averageWeeklyEarnings * ratePct / 100;
  const monthly = weekly * rules.weeksPerYear / rules.monthsPerYear;
  return {
    ok: true,
    eligible,
    weeksShort: eligible ? 0 : rules.minimumWeeks - contributionWeeks,
    ratePct,
    monthlyPension: Math.round(monthly * 100) / 100,
    pensionStartYear: birthYear + rules.pensionableAge,
    weeksToMaximum: weeksToMaximum(rules),
    ruleSet: rules.id,
    illustrative: rules.approvedBy === null,
  };
}

module.exports = { ILLUSTRATIVE_RULES, validate, replacementRate, weeksToMaximum, estimate };
