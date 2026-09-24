import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readConfig, DEFAULT_ACCENT, DEFAULT_STORAGE_KEY } from '../../src/config.js';

const reader = (attrs) => (name) => (name in attrs ? attrs[name] : null);
const anyColor = () => true;

test('defaults without attributes', () => {
  assert.deepEqual(readConfig(reader({}), anyColor), {
    position: 'bottom-right',
    language: null,
    accent: DEFAULT_ACCENT,
    buttonLabel: null,
    storageKey: DEFAULT_STORAGE_KEY
  });
});

test('accepts valid values', () => {
  const config = readConfig(
    reader({
      'data-position': 'top-left',
      'data-language': 'de-AT',
      'data-accent': '#2563eb',
      'data-button-label': 'Barrierefreiheit',
      'data-storage-key': 'my-site-accessibility'
    }),
    anyColor
  );
  assert.equal(config.position, 'top-left');
  assert.equal(config.language, 'de-AT');
  assert.equal(config.accent, '#2563eb');
  assert.equal(config.buttonLabel, 'Barrierefreiheit');
  assert.equal(config.storageKey, 'my-site-accessibility');
});

test('ignores unknown positions and bad language tags', () => {
  const config = readConfig(reader({ 'data-position': 'middle', 'data-language': '<de>' }), anyColor);
  assert.equal(config.position, 'bottom-right');
  assert.equal(config.language, null);
});

test('rejects accents the color validator refuses', () => {
  assert.equal(readConfig(reader({ 'data-accent': 'notacolor' }), () => false).accent, DEFAULT_ACCENT);
});

test('rejects accents that could break out of CSS even if the validator accepts them', () => {
  for (const accent of ['red;}body{display:none', 'red}', 'url("x")', 'red/*', '</style>']) {
    assert.equal(readConfig(reader({ 'data-accent': accent }), anyColor).accent, DEFAULT_ACCENT, accent);
  }
});

test('keeps button labels as plain strings, trimmed and length-limited', () => {
  const label = '<img src=x onerror=alert(1)>';
  assert.equal(readConfig(reader({ 'data-button-label': label }), anyColor).buttonLabel, label);
  assert.equal(readConfig(reader({ 'data-button-label': 'x'.repeat(500) }), anyColor).buttonLabel.length, 100);
  assert.equal(readConfig(reader({ 'data-button-label': '   ' }), anyColor).buttonLabel, null);
});

test('rejects unsafe storage keys', () => {
  assert.equal(readConfig(reader({ 'data-storage-key': 'a b' }), anyColor).storageKey, DEFAULT_STORAGE_KEY);
  assert.equal(readConfig(reader({ 'data-storage-key': 'x'.repeat(101) }), anyColor).storageKey, DEFAULT_STORAGE_KEY);
});
