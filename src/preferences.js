// Preference schema, defaults and validation. Pure module, no DOM access.

export const STORAGE_VERSION = 1;

export const TEXT_SIZES = [1, 1.125, 1.25, 1.5, 1.75, 2];

// Boolean preferences in display order. The CSS class applied to <html> is
// derived from the key: highContrast -> a11y-adjust-high-contrast.
export const BOOLEAN_SETTINGS = [
  'lineHeight',
  'letterSpacing',
  'readableFont',
  'highContrast',
  'grayscale',
  'highlightLinks',
  'highlightHeadings',
  'reduceMotion',
  'focusHighlight',
  'largeCursor',
  'readingGuide',
  'readingMask'
];

export const SETTINGS = ['textSize', ...BOOLEAN_SETTINGS];

export function defaults() {
  const prefs = { textSize: 1 };
  for (const key of BOOLEAN_SETTINGS) prefs[key] = false;
  return prefs;
}

export function isValid(setting, value) {
  if (setting === 'textSize') return TEXT_SIZES.includes(value);
  if (BOOLEAN_SETTINGS.includes(setting)) return typeof value === 'boolean';
  return false;
}

// Returns a complete, valid preference object. Unknown keys and invalid
// values are dropped and replaced with defaults.
export function sanitize(input) {
  const prefs = defaults();
  if (!input || typeof input !== 'object' || Array.isArray(input)) return prefs;
  if (input.version !== undefined && input.version !== STORAGE_VERSION) return prefs;
  for (const key of SETTINGS) {
    if (Object.prototype.hasOwnProperty.call(input, key) && isValid(key, input[key])) {
      prefs[key] = input[key];
    }
  }
  return prefs;
}

export function serialize(prefs) {
  return JSON.stringify({ version: STORAGE_VERSION, ...sanitize(prefs) });
}

export function parse(raw) {
  if (typeof raw !== 'string' || raw.length > 4096) return defaults();
  try {
    return sanitize(JSON.parse(raw));
  } catch {
    return defaults();
  }
}

export function stepTextSize(current, direction) {
  const index = TEXT_SIZES.indexOf(current);
  const next = TEXT_SIZES[(index < 0 ? 0 : index) + direction];
  return next === undefined ? current : next;
}

export function className(setting) {
  return 'a11y-adjust-' + setting.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase());
}
