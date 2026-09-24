import { readConfig } from './config.js';
import { resolveLanguage, messages } from './i18n.js';
import { BOOLEAN_SETTINGS, defaults, isValid, parse, serialize, stepTextSize, className, TEXT_SIZES } from './preferences.js';
import { hostCss, installSheet } from './host-styles.js';
import { widgetCss } from './widget-styles.js';
import { readingTools } from './reading.js';
import { h, icon } from './dom.js';

/* global __VERSION__ */
const VERSION = typeof __VERSION__ === 'string' ? __VERSION__ : 'dev';
const HOST_TAG = 'a11y-adjust';

function createStorage(key) {
  let ls = null;
  try {
    ls = window.localStorage;
    ls.getItem(key);
  } catch {
    ls = null;
  }
  return {
    load() {
      try {
        return parse(ls ? ls.getItem(key) : null);
      } catch {
        return defaults();
      }
    },
    save(prefs) {
      try {
        if (ls) ls.setItem(key, serialize(prefs));
      } catch {
        // Quota exceeded or storage blocked: continue without persistence.
      }
    },
    clear() {
      try {
        if (ls) ls.removeItem(key);
      } catch {
        // Ignore.
      }
    }
  };
}

function findScript() {
  const current = document.currentScript;
  if (current && current.tagName === 'SCRIPT') return current;
  return document.querySelector('script[data-a11y-adjust],script[src*="a11y-adjust"]');
}

function init() {
  if (window.A11yAdjust) return;

  const script = findScript();
  const config = readConfig(
    (name) => (script ? script.getAttribute(name) : null),
    (value) => typeof CSS !== 'undefined' && typeof CSS.supports === 'function' && CSS.supports('color', value)
  );
  const docRoot = document.documentElement;
  const t = messages(resolveLanguage(config.language, docRoot.getAttribute('lang')));
  const storage = createStorage(config.storageKey);
  let prefs = storage.load();
  let ui = null;
  let isOpen = false;

  installSheet(document, hostCss(config.accent));
  const setDynamicCss = installSheet(document, '');

  function applyTextSize() {
    const cls = className('textSize');
    docRoot.classList.remove(cls);
    if (prefs.textSize === 1) {
      setDynamicCss('');
      return;
    }
    // Scale relative to the site's own root size (measured without our rule).
    const base = parseFloat(getComputedStyle(docRoot).fontSize) || 16;
    setDynamicCss(`:root{--a11y-adjust-root-size:${(base * prefs.textSize).toFixed(2)}px}`);
    docRoot.classList.add(cls);
  }

  function apply() {
    for (const key of BOOLEAN_SETTINGS) docRoot.classList.toggle(className(key), prefs[key]);
    applyTextSize();
    if (!ui) return;
    ui.reading(prefs.readingGuide, prefs.readingMask);
    ui.root.classList.toggle('no-motion', prefs.reduceMotion);
    for (const key of BOOLEAN_SETTINGS) ui.toggles[key].setAttribute('aria-pressed', String(prefs[key]));
    ui.output.textContent = Math.round(prefs.textSize * 100) + '%';
    ui.decrease.setAttribute('aria-disabled', String(prefs.textSize === TEXT_SIZES[0]));
    ui.increase.setAttribute('aria-disabled', String(prefs.textSize === TEXT_SIZES[TEXT_SIZES.length - 1]));
  }

  function emit(type, detail) {
    window.dispatchEvent(new CustomEvent(type, { detail }));
  }

  function set(setting, value) {
    if (!isValid(setting, value)) return false;
    if (prefs[setting] === value) return true;
    prefs = { ...prefs, [setting]: value };
    storage.save(prefs);
    apply();
    emit('a11y:change', { setting, value });
    return true;
  }

  function reset() {
    prefs = defaults();
    storage.clear();
    apply();
    if (ui) {
      ui.status.textContent = '';
      ui.status.textContent = t.resetDone;
    }
    emit('a11y:reset', null);
  }

  function onKeydown(event) {
    if (event.key === 'Escape' && isOpen) close();
  }

  function onPointerdown(event) {
    if (!event.composedPath().includes(ui.host)) close();
  }

  function open() {
    if (!ui || isOpen) return;
    isOpen = true;
    ui.panel.hidden = false;
    ui.launcher.setAttribute('aria-expanded', 'true');
    ui.title.focus();
    document.addEventListener('keydown', onKeydown);
    document.addEventListener('pointerdown', onPointerdown, true);
  }

  function close() {
    if (!ui || !isOpen) return;
    // Only move focus back if it is currently inside the widget, so a
    // programmatic close never steals focus from the page.
    const focusInside = ui.shadow.activeElement !== null;
    isOpen = false;
    ui.panel.hidden = true;
    ui.launcher.setAttribute('aria-expanded', 'false');
    ui.status.textContent = '';
    document.removeEventListener('keydown', onKeydown);
    document.removeEventListener('pointerdown', onPointerdown, true);
    if (focusInside) ui.launcher.focus();
  }

  function toggle() {
    if (isOpen) close();
    else open();
  }

  function mount() {
    const host = document.createElement(HOST_TAG);
    const shadow = host.attachShadow({ mode: 'open' });
    installSheet(shadow, widgetCss(config.accent));

    const toggles = {};
    const toggleButton = (key) => {
      const button = h(
        'button',
        { type: 'button', class: 'toggle', 'aria-pressed': 'false', 'data-setting': key },
        h('span', null, t[key]),
        h('span', { class: 'switch', 'aria-hidden': 'true' })
      );
      button.addEventListener('click', () => set(key, !prefs[key]));
      toggles[key] = button;
      return button;
    };
    const group = (id, ...items) =>
      h('section', { 'aria-labelledby': 'aa-' + id }, h('h3', { id: 'aa-' + id }, t[id]), ...items);
    const stepButton = (name, label, direction) => {
      const button = h('button', { type: 'button', class: 'icon', 'data-action': name }, icon(name), h('span', { class: 'sr' }, label));
      button.addEventListener('click', () => {
        if (button.getAttribute('aria-disabled') !== 'true') set('textSize', stepTextSize(prefs.textSize, direction));
      });
      return button;
    };

    const launcher = h(
      'button',
      { type: 'button', class: 'launcher', 'aria-expanded': 'false', 'aria-controls': 'aa-panel' },
      icon('launcher'),
      h('span', { class: 'sr' }, config.buttonLabel || t.title)
    );
    launcher.addEventListener('click', toggle);

    const title = h('h2', { id: 'aa-title', tabindex: '-1' }, t.title);
    const closeButton = h('button', { type: 'button', class: 'icon', 'data-action': 'close' }, icon('close'), h('span', { class: 'sr' }, t.close));
    closeButton.addEventListener('click', close);

    const decrease = stepButton('minus', t.decrease, -1);
    const increase = stepButton('plus', t.increase, 1);
    const output = h('output', { 'aria-live': 'polite' }, '100%');

    const resetButton = h('button', { type: 'button', class: 'reset', 'data-action': 'reset' }, icon('reset'), h('span', null, t.reset));
    resetButton.addEventListener('click', reset);

    const panel = h(
      'div',
      { class: 'panel', id: 'aa-panel', role: 'dialog', 'aria-modal': 'false', 'aria-labelledby': 'aa-title', hidden: true },
      h('div', { class: 'head' }, title, closeButton),
      h(
        'div',
        { class: 'body' },
        group(
          'text',
          h(
            'div',
            { class: 'stepper', role: 'group', 'aria-labelledby': 'aa-size' },
            h('span', { id: 'aa-size' }, t.textSize),
            h('div', { class: 'controls' }, decrease, output, increase)
          ),
          toggleButton('lineHeight'),
          toggleButton('letterSpacing'),
          toggleButton('readableFont')
        ),
        group('visual', toggleButton('highContrast'), toggleButton('grayscale'), toggleButton('highlightLinks'), toggleButton('highlightHeadings')),
        group('interaction', toggleButton('reduceMotion'), toggleButton('focusHighlight'), toggleButton('largeCursor')),
        group('reading', toggleButton('readingGuide'), toggleButton('readingMask'))
      ),
      h('div', { class: 'foot' }, resetButton, h('p', { class: 'note' }, t.note))
    );

    const guide = h('div', { class: 'guide', hidden: true });
    const maskTop = h('div', { class: 'mask top', hidden: true });
    const maskBottom = h('div', { class: 'mask bottom', hidden: true });
    const status = h('p', { class: 'sr', role: 'status' });

    const root = h('div', { class: 'root ' + config.position }, maskTop, maskBottom, guide, launcher, panel, status);
    shadow.append(root);
    document.body.append(host);

    ui = { host, shadow, root, launcher, panel, title, toggles, output, decrease, increase, status, reading: readingTools(host, guide, maskTop, maskBottom) };
    apply();
  }

  window.A11yAdjust = Object.freeze({
    version: VERSION,
    open,
    close,
    toggle,
    reset,
    set,
    getPreferences: () => ({ ...prefs })
  });

  // Host styles apply immediately to avoid a flash of unadjusted content;
  // the UI is mounted once <body> exists.
  apply();
  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount, { once: true });
}

init();
