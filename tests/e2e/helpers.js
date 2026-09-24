export const PLAIN = '/tests/fixtures/plain.html';

export const launcher = (page) => page.locator('a11y-adjust .launcher');
export const panel = (page) => page.getByRole('dialog');
export const toggle = (page, setting) => page.locator(`a11y-adjust [data-setting="${setting}"]`);
export const htmlClasses = (page) => page.evaluate(() => [...document.documentElement.classList]);
export const stored = (page, key = 'a11y-adjust-preferences') =>
  page.evaluate((k) => JSON.parse(localStorage.getItem(k)), key);

export async function ready(page, url = PLAIN) {
  await page.goto(url);
  await page.waitForFunction(() => window.A11yAdjust && document.querySelector('a11y-adjust'));
}
