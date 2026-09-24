import { test, expect } from '@playwright/test';
import { ready, launcher, panel, toggle, htmlClasses, stored } from './helpers.js';

test.describe('launcher and panel', () => {
  test('renders a real button with an accessible name', async ({ page }) => {
    await ready(page);
    const button = page.getByRole('button', { name: 'Accessibility preferences' });
    await expect(button).toBeVisible();
    expect(await button.evaluate((el) => el.tagName + ':' + el.type)).toBe('BUTTON:button');
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(panel(page)).toBeHidden();
  });

  test('opens on click, focuses the title and closes with Escape', async ({ page }) => {
    await ready(page);
    await launcher(page).click();
    await expect(panel(page)).toBeVisible();
    await expect(launcher(page)).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('a11y-adjust h2')).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(panel(page)).toBeHidden();
    await expect(launcher(page)).toBeFocused();
  });

  test('is fully operable with the keyboard', async ({ page }) => {
    await ready(page);
    await page.locator('#page-input').focus();
    await page.keyboard.press('Tab');
    await expect(launcher(page)).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(panel(page)).toBeVisible();
    await page.keyboard.press('Tab'); // close button
    await page.keyboard.press('Tab'); // decrease
    await page.keyboard.press('Tab'); // increase
    await page.keyboard.press('Enter');
    expect(await page.evaluate(() => A11yAdjust.getPreferences().textSize)).toBe(1.125);
    await page.keyboard.press('Tab'); // line height
    await page.keyboard.press('Space');
    await expect(toggle(page, 'lineHeight')).toHaveAttribute('aria-pressed', 'true');
    await page.keyboard.press('Escape');
    await expect(launcher(page)).toBeFocused();
  });

  test('close button and outside click close the panel', async ({ page }) => {
    await ready(page);
    await launcher(page).click();
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(panel(page)).toBeHidden();
    await expect(launcher(page)).toBeFocused();

    await launcher(page).click();
    await page.locator('h1').click();
    await expect(panel(page)).toBeHidden();
  });
});

test.describe('preferences', () => {
  test('every toggle applies and removes its namespaced class', async ({ page }) => {
    await ready(page);
    await launcher(page).click();
    const settings = await page.locator('a11y-adjust [data-setting]').evaluateAll((els) => els.map((e) => e.dataset.setting));
    expect(settings).toHaveLength(12);
    for (const setting of settings) {
      const cls = 'a11y-adjust-' + setting.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase());
      await toggle(page, setting).click();
      await expect(toggle(page, setting)).toHaveAttribute('aria-pressed', 'true');
      expect(await htmlClasses(page)).toContain(cls);
      await toggle(page, setting).click();
      await expect(toggle(page, setting)).toHaveAttribute('aria-pressed', 'false');
      expect(await htmlClasses(page)).not.toContain(cls);
    }
  });

  test('host effects are visible in computed styles', async ({ page }) => {
    await ready(page);
    const probe = () =>
      page.evaluate(() => {
        const text = getComputedStyle(document.getElementById('text'));
        return {
          filter: getComputedStyle(document.documentElement).filter,
          animation: getComputedStyle(document.getElementById('spin')).animationDuration,
          font: text.fontFamily,
          letter: text.letterSpacing,
          bg: getComputedStyle(document.body).backgroundColor,
          link: getComputedStyle(document.getElementById('link')).textDecorationLine
        };
      });
    const before = await probe();
    await page.evaluate(() => {
      for (const key of ['grayscale', 'reduceMotion', 'readableFont', 'letterSpacing', 'highContrast', 'highlightLinks']) A11yAdjust.set(key, true);
    });
    const after = await probe();
    expect(before.filter).toBe('none');
    expect(after.filter).toBe('grayscale(1)');
    expect(before.animation).toBe('2s');
    expect(parseFloat(after.animation)).toBeLessThan(0.01);
    expect(after.font).toContain('system-ui');
    expect(parseFloat(after.letter)).toBeGreaterThan(1);
    expect(after.bg).toBe('rgb(0, 0, 0)');
    expect(after.link).toContain('underline');
  });

  test('text size scales the root font size and clamps at the bounds', async ({ page }) => {
    await ready(page);
    await launcher(page).click();
    const decrease = page.getByRole('button', { name: 'Decrease text size' });
    const increase = page.getByRole('button', { name: 'Increase text size' });
    await expect(decrease).toHaveAttribute('aria-disabled', 'true');
    for (let i = 0; i < 5; i++) await increase.click();
    // Further activation is ignored at the upper bound, and focus stays on the button.
    await increase.focus();
    await page.keyboard.press('Enter');
    await expect(increase).toBeFocused();
    await expect(increase).toHaveAttribute('aria-disabled', 'true');
    await expect(page.locator('a11y-adjust output')).toHaveText('200%');
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).fontSize)).toBe('32px');
    expect(await page.evaluate(() => getComputedStyle(document.getElementById('text')).fontSize)).toBe('32px');
    // The widget UI itself uses pixel units and is not distorted.
    expect(await launcher(page).evaluate((el) => el.getBoundingClientRect().width)).toBe(56);
    await decrease.click();
    await expect(page.locator('a11y-adjust output')).toHaveText('175%');
  });

  test('persists preferences in localStorage across reloads', async ({ page }) => {
    await ready(page);
    await page.evaluate(() => {
      A11yAdjust.set('grayscale', true);
      A11yAdjust.set('textSize', 1.25);
    });
    const data = await stored(page);
    expect(data.version).toBe(1);
    expect(data.grayscale).toBe(true);
    expect(data.textSize).toBe(1.25);
    expect(Object.keys(data).sort()).toEqual(Object.keys({ version: 1, ...(await page.evaluate(() => A11yAdjust.getPreferences())) }).sort());

    await page.reload();
    await page.waitForFunction(() => window.A11yAdjust);
    expect(await htmlClasses(page)).toContain('a11y-adjust-grayscale');
    expect(await page.evaluate(() => A11yAdjust.getPreferences().textSize)).toBe(1.25);
    await launcher(page).click();
    await expect(toggle(page, 'grayscale')).toHaveAttribute('aria-pressed', 'true');
  });

  test('ignores tampered storage safely', async ({ page }) => {
    await ready(page);
    await page.evaluate(() => localStorage.setItem('a11y-adjust-preferences', '{"version":1,"textSize":99,"grayscale":"yes","x":1,"reduceMotion":true}'));
    await page.reload();
    await page.waitForFunction(() => window.A11yAdjust);
    const prefs = await page.evaluate(() => A11yAdjust.getPreferences());
    expect(prefs.textSize).toBe(1);
    expect(prefs.grayscale).toBe(false);
    expect(prefs.reduceMotion).toBe(true);
    expect('x' in prefs).toBe(false);
  });

  test('reset button restores defaults, clears storage and announces it', async ({ page }) => {
    await ready(page);
    await page.evaluate(() => {
      A11yAdjust.set('highContrast', true);
      A11yAdjust.set('textSize', 1.5);
    });
    const resetEvent = page.evaluate(() => new Promise((r) => window.addEventListener('a11y:reset', () => r(true), { once: true })));
    await launcher(page).click();
    await page.getByRole('button', { name: 'Reset all' }).click();
    expect(await resetEvent).toBe(true);
    expect((await htmlClasses(page)).filter((c) => c.startsWith('a11y-adjust-'))).toEqual([]);
    expect(await page.evaluate(() => localStorage.getItem('a11y-adjust-preferences'))).toBeNull();
    await expect(page.locator('a11y-adjust p[role="status"]')).toHaveText('All preferences reset.');
    await expect(page.locator('a11y-adjust output')).toHaveText('100%');
  });
});

test.describe('JavaScript API and events', () => {
  test('exposes the documented API', async ({ page }) => {
    await ready(page);
    const api = await page.evaluate(() => Object.keys(A11yAdjust).sort());
    expect(api).toEqual(['close', 'getPreferences', 'open', 'reset', 'set', 'toggle', 'version'].sort());
    await page.evaluate(() => A11yAdjust.open());
    await expect(panel(page)).toBeVisible();
    await page.evaluate(() => A11yAdjust.toggle());
    await expect(panel(page)).toBeHidden();
    await page.evaluate(() => A11yAdjust.toggle());
    await expect(panel(page)).toBeVisible();
    await page.evaluate(() => A11yAdjust.close());
    await expect(panel(page)).toBeHidden();
  });

  test('programmatic close does not steal focus from the page', async ({ page }) => {
    await ready(page);
    await page.evaluate(() => A11yAdjust.open());
    await page.locator('#page-input').focus();
    await page.evaluate(() => A11yAdjust.close());
    await expect(page.locator('#page-input')).toBeFocused();
  });

  test('set validates input and dispatches a11y:change', async ({ page }) => {
    await ready(page);
    const result = await page.evaluate(() => {
      const events = [];
      window.addEventListener('a11y:change', (e) => events.push(e.detail));
      const returns = [
        A11yAdjust.set('highContrast', true),
        A11yAdjust.set('textSize', 1.25),
        A11yAdjust.set('textSize', 7),
        A11yAdjust.set('highContrast', 'true'),
        A11yAdjust.set('doesNotExist', true),
        A11yAdjust.set('__proto__', true),
        A11yAdjust.set('highContrast', true)
      ];
      return { returns, events };
    });
    expect(result.returns).toEqual([true, true, false, false, false, false, true]);
    expect(result.events).toEqual([
      { setting: 'highContrast', value: true },
      { setting: 'textSize', value: 1.25 }
    ]);
  });

  test('getPreferences returns a copy', async ({ page }) => {
    await ready(page);
    const value = await page.evaluate(() => {
      A11yAdjust.getPreferences().grayscale = true;
      return A11yAdjust.getPreferences().grayscale;
    });
    expect(value).toBe(false);
  });

  test('the API object cannot be modified', async ({ page }) => {
    await ready(page);
    const frozen = await page.evaluate(() => Object.isFrozen(A11yAdjust));
    expect(frozen).toBe(true);
  });
});

test.describe('configuration', () => {
  test('detects the page language and applies options', async ({ page }) => {
    await ready(page, '/tests/fixtures/hostile.html');
    await expect(page.getByRole('button', { name: /<img src=x/ })).toBeVisible();
    await launcher(page).click();
    await expect(page.getByRole('heading', { name: 'Barrierefreiheit anpassen' })).toBeVisible();
    const box = await launcher(page).boundingBox();
    expect(box.x).toBeLessThan(100);
    expect(box.y).toBeLessThan(100);
  });

  test('data-language, storage key and head loading without defer', async ({ page }) => {
    await ready(page, '/tests/fixtures/options.html');
    expect(await page.locator('a11y-adjust').count()).toBe(1);
    await launcher(page).click();
    await expect(page.getByRole('heading', { name: "Préférences d'accessibilité" })).toBeVisible();
    await page.evaluate(() => A11yAdjust.set('grayscale', true));
    expect((await stored(page, 'my-site-accessibility')).grayscale).toBe(true);
    const box = await launcher(page).boundingBox();
    expect(box.x).toBeLessThan(100);
  });

  test('invalid configuration values fall back to safe defaults', async ({ page }) => {
    await ready(page, '/tests/fixtures/invalid.html');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Accessibility preferences' })).toBeVisible();
    const box = await launcher(page).boundingBox();
    const viewport = page.viewportSize();
    expect(box.x).toBeGreaterThan(viewport.width - 100);
    expect(await launcher(page).evaluate((el) => getComputedStyle(el).backgroundColor)).toBe('rgb(29, 78, 216)');
    await page.evaluate(() => A11yAdjust.set('grayscale', true));
    expect((await stored(page)).grayscale).toBe(true);
  });
});

test.describe('robustness', () => {
  test('widget UI is isolated from hostile host CSS', async ({ page }) => {
    await ready(page, '/tests/fixtures/hostile.html');
    const style = await launcher(page).evaluate((el) => {
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return { w: r.width, h: r.height, radius: s.borderRadius, color: s.color };
    });
    expect(style).toEqual({ w: 56, h: 56, radius: '50%', color: 'rgb(255, 255, 255)' });
    // The host element generates no box, so it never becomes a grid or flex item of <body>.
    expect(await page.locator('a11y-adjust').evaluate((el) => getComputedStyle(el).display)).toBe('contents');
    const icon = await page.locator('a11y-adjust .launcher svg').boundingBox();
    expect(icon.width).toBe(32);
    await launcher(page).click();
    const fontSize = await page.locator('a11y-adjust h2').evaluate((el) => getComputedStyle(el).fontSize);
    expect(fontSize).toBe('17px');
    // Clickable above a full-screen element with the maximum z-index.
    await page.getByRole('button', { name: 'Schließen' }).click();
    await expect(panel(page)).toBeHidden();
  });

  test('configured labels are rendered as text, never as HTML', async ({ page }) => {
    await ready(page, '/tests/fixtures/hostile.html');
    await page.waitForTimeout(100);
    expect(await page.evaluate(() => window.__xss)).toBeUndefined();
    expect(await page.locator('a11y-adjust img').count()).toBe(0);
    await expect(page.locator('a11y-adjust .launcher .sr')).toHaveText('<img src=x onerror="window.__xss=1">');
  });

  test('works without localStorage', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', {
        get() {
          throw new DOMException('blocked', 'SecurityError');
        }
      });
    });
    await ready(page);
    await launcher(page).click();
    await toggle(page, 'grayscale').click();
    expect(await htmlClasses(page)).toContain('a11y-adjust-grayscale');
  });

  test('makes no network requests after loading', async ({ page }) => {
    const requests = [];
    await ready(page);
    page.on('request', (req) => requests.push(req.url()));
    await launcher(page).click();
    const settings = await page.locator('a11y-adjust [data-setting]').evaluateAll((els) => els.map((e) => e.dataset.setting));
    for (const setting of settings) await toggle(page, setting).click();
    await page.getByRole('button', { name: 'Increase text size' }).click();
    await page.mouse.move(200, 300);
    await page.getByRole('button', { name: 'Reset all' }).click();
    await page.waitForTimeout(200);
    expect(requests).toEqual([]);
  });

  test('uses no timers or observers while idle and only temporary listeners', async ({ page }) => {
    await page.addInitScript(() => {
      const counts = (window.__counts = { interval: 0, timeout: 0, raf: 0, observers: 0, pointermove: 0 });
      const wrap = (obj, name, key) => {
        const original = obj[name];
        obj[name] = function (...args) {
          counts[key]++;
          return original.apply(this, args);
        };
      };
      wrap(window, 'setInterval', 'interval');
      wrap(window, 'setTimeout', 'timeout');
      wrap(window, 'requestAnimationFrame', 'raf');
      const MO = window.MutationObserver;
      window.MutationObserver = class extends MO {
        constructor(cb) {
          super(cb);
          // Ignore Playwright's own injected script.
          if (!String(new Error().stack).includes('InjectedScript')) counts.observers++;
        }
      };
      const add = EventTarget.prototype.addEventListener;
      const remove = EventTarget.prototype.removeEventListener;
      EventTarget.prototype.addEventListener = function (type, ...rest) {
        if (type === 'pointermove') counts.pointermove++;
        return add.call(this, type, ...rest);
      };
      EventTarget.prototype.removeEventListener = function (type, ...rest) {
        if (type === 'pointermove') counts.pointermove--;
        return remove.call(this, type, ...rest);
      };
    });
    await ready(page);
    await page.waitForTimeout(300);
    expect(await page.evaluate(() => window.__counts)).toEqual({ interval: 0, timeout: 0, raf: 0, observers: 0, pointermove: 0 });

    await page.evaluate(() => A11yAdjust.set('readingGuide', true));
    expect(await page.evaluate(() => window.__counts.pointermove)).toBe(1);
    await page.mouse.move(100, 250);
    await expect.poll(() => page.locator('a11y-adjust .guide').evaluate((el) => el.style.top)).toBe('250px');
    await page.evaluate(() => A11yAdjust.set('readingMask', true));
    expect(await page.evaluate(() => window.__counts.pointermove)).toBe(1);
    await expect(page.locator('a11y-adjust .mask.top')).toBeVisible();

    await page.evaluate(() => {
      A11yAdjust.set('readingGuide', false);
      A11yAdjust.set('readingMask', false);
    });
    expect(await page.evaluate(() => window.__counts.pointermove)).toBe(0);
    await expect(page.locator('a11y-adjust .guide')).toBeHidden();
  });

  test('works under a strict Content Security Policy', async ({ page }) => {
    const errors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));
    await ready(page, '/tests/fixtures/csp/');
    const violations = await page.evaluate(() => {
      window.__violations = [];
      document.addEventListener('securitypolicyviolation', (e) => window.__violations.push(e.violatedDirective));
      return window.__violations;
    });
    await launcher(page).click();
    await toggle(page, 'grayscale').click();
    await toggle(page, 'highlightLinks').click();
    await page.getByRole('button', { name: 'Increase text size' }).click();
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).filter)).toBe('grayscale(1)');
    expect(await launcher(page).evaluate((el) => el.getBoundingClientRect().width)).toBe(56);
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).fontSize)).toBe('18px');
    expect(violations).toEqual([]);
    expect(await page.evaluate(() => window.__violations)).toEqual([]);
    expect(errors).toEqual([]);
  });
});
