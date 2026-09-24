// Minimal DOM helpers. Text is always set via textContent, never as HTML.

export function h(tag, attrs, ...children) {
  const el = document.createElement(tag);
  for (const [name, value] of Object.entries(attrs || {})) {
    if (value === false || value == null) continue;
    el.setAttribute(name, value === true ? '' : String(value));
  }
  el.append(...children.filter((c) => c != null && c !== false));
  return el;
}

const SVG_NS = 'http://www.w3.org/2000/svg';

const ICONS = {
  launcher: ['M4 8.5 12 10l8-1.5', 'M12 10v4.5l-3.5 6.5', 'M12 14.5l3.5 6.5', 'M12 2.5a2 2 0 1 0 0 4 2 2 0 1 0 0-4z'],
  close: ['M6 6l12 12', 'M18 6 6 18'],
  minus: ['M5 12h14'],
  plus: ['M12 5v14', 'M5 12h14'],
  reset: ['M3.5 12a8.5 8.5 0 1 0 2.5-6', 'M3.5 3.5V8H8']
};

export function icon(name) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  for (const d of ICONS[name]) {
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', d);
    svg.append(path);
  }
  return svg;
}
