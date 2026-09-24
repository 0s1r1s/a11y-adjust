import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

async function scan(page) {
  const results = await new AxeBuilder({ page }).include('a11y-adjust').withTags(TAGS).analyze();
  return results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
}

async function load(page, url = '/demo/') {
  await page.goto(url);
  await page.waitForFunction(() => window.A11yAdjust && document.querySelector('a11y-adjust'));
}

for (const scheme of ['light', 'dark']) {
  test.describe(`${scheme} color scheme`, () => {
    test.use({ colorScheme: scheme });

    test('closed widget has no axe violations', async ({ page }) => {
      await load(page);
      expect(await scan(page)).toEqual([]);
    });

    test('open panel has no axe violations', async ({ page }) => {
      await load(page);
      await page.evaluate(() => A11yAdjust.open());
      expect(await scan(page)).toEqual([]);
    });

    test('open panel with active preferences has no axe violations', async ({ page }) => {
      await load(page);
      await page.evaluate(() => {
        A11yAdjust.set('textSize', 1.5);
        A11yAdjust.set('highContrast', true);
        A11yAdjust.set('focusHighlight', true);
        A11yAdjust.open();
      });
      expect(await scan(page)).toEqual([]);
    });
  });
}

test('demo page itself has no axe violations', async ({ page }) => {
  await load(page);
  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  expect(results.violations.map((v) => v.id)).toEqual([]);
});

test('touch targets are at least 44 by 44 pixels', async ({ page }) => {
  await load(page);
  await page.evaluate(() => A11yAdjust.open());
  const small = await page.locator('a11y-adjust button').evaluateAll((buttons) =>
    buttons
      .map((b) => ({ label: b.textContent.trim(), rect: b.getBoundingClientRect() }))
      .filter(({ rect }) => rect.width < 44 || rect.height < 44)
      .map(({ label }) => label)
  );
  expect(small).toEqual([]);
});
