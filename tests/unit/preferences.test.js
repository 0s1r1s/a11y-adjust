import { test } from 'node:test';
import assert from 'node:assert/strict';
import { defaults, sanitize, parse, serialize, isValid, stepTextSize, className, TEXT_SIZES, SETTINGS } from '../../src/preferences.js';

test('defaults are all off with text size 1', () => {
  const prefs = defaults();
  assert.equal(prefs.textSize, 1);
  for (const key of SETTINGS.slice(1)) assert.equal(prefs[key], false);
});

test('isValid accepts only known settings with correct types', () => {
  assert.equal(isValid('highContrast', true), true);
  assert.equal(isValid('highContrast', 'true'), false);
  assert.equal(isValid('textSize', 1.25), true);
  assert.equal(isValid('textSize', 1.3), false);
  assert.equal(isValid('textSize', '1.25'), false);
  assert.equal(isValid('unknown', true), false);
  assert.equal(isValid('__proto__', true), false);
});

test('sanitize drops unknown keys and invalid values', () => {
  const prefs = sanitize({ version: 1, textSize: 5, grayscale: true, evil: '<script>', reduceMotion: 'yes' });
  assert.deepEqual(prefs, { ...defaults(), grayscale: true });
  assert.equal('evil' in prefs, false);
});

test('sanitize rejects unknown storage versions', () => {
  assert.deepEqual(sanitize({ version: 99, grayscale: true }), defaults());
});

test('parse handles malformed and oversized input', () => {
  assert.deepEqual(parse('not json'), defaults());
  assert.deepEqual(parse(null), defaults());
  assert.deepEqual(parse('[]'), defaults());
  assert.deepEqual(parse('x'.repeat(5000)), defaults());
  assert.deepEqual(parse('{"__proto__":{"grayscale":true}}'), defaults());
});

test('serialize produces the versioned storage format', () => {
  const raw = serialize({ ...defaults(), textSize: 1.25, reduceMotion: true });
  const data = JSON.parse(raw);
  assert.equal(data.version, 1);
  assert.equal(data.textSize, 1.25);
  assert.equal(data.reduceMotion, true);
  assert.deepEqual(parse(raw), sanitize(data));
});

test('stepTextSize moves through the allowed sizes and clamps', () => {
  assert.equal(stepTextSize(1, 1), TEXT_SIZES[1]);
  assert.equal(stepTextSize(1, -1), 1);
  assert.equal(stepTextSize(2, 1), 2);
  assert.equal(stepTextSize(1.5, -1), 1.25);
});

test('className maps settings to namespaced classes', () => {
  assert.equal(className('highContrast'), 'a11y-adjust-high-contrast');
  assert.equal(className('reduceMotion'), 'a11y-adjust-reduce-motion');
  assert.equal(className('grayscale'), 'a11y-adjust-grayscale');
});
