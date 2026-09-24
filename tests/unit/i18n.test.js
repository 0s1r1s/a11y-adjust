import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveLanguage, messages, LANGUAGES } from '../../src/i18n.js';

test('ships at least eight languages', () => {
  assert.ok(LANGUAGES.length >= 8);
  for (const code of ['en', 'de', 'fr', 'es', 'it', 'pt', 'nl', 'pl']) assert.ok(LANGUAGES.includes(code), code);
});

test('resolves region tags and falls back to English', () => {
  assert.equal(resolveLanguage('de-AT'), 'de');
  assert.equal(resolveLanguage('PT_br'), 'pt');
  assert.equal(resolveLanguage('xx'), 'en');
  assert.equal(resolveLanguage(null, ''), 'en');
  assert.equal(resolveLanguage(null, 'fr-CA'), 'fr');
  assert.equal(resolveLanguage('nl', 'de'), 'nl');
});

test('every language provides every string as non-empty plain text', () => {
  const keys = Object.keys(messages('en'));
  for (const code of LANGUAGES) {
    const m = messages(code);
    assert.deepEqual(Object.keys(m), keys, code);
    for (const key of keys) {
      assert.equal(typeof m[key], 'string', `${code}.${key}`);
      assert.ok(m[key].length > 0, `${code}.${key}`);
      assert.ok(!/[<>]/.test(m[key]), `${code}.${key} must not contain HTML`);
    }
  }
});
