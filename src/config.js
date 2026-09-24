// Reads and validates configuration from data-* attributes. Pure module:
// the attribute reader and the color validator are injected.

export const POSITIONS = ['bottom-right', 'bottom-left', 'top-right', 'top-left'];
export const DEFAULT_STORAGE_KEY = 'a11y-adjust-preferences';
export const DEFAULT_ACCENT = '#1d4ed8';

const STORAGE_KEY_PATTERN = /^[A-Za-z0-9_.:-]{1,100}$/;
// Characters that could escape a CSS declaration are rejected outright,
// before the browser validator is consulted.
const UNSAFE_CSS = /[;{}<>\\"'`]|\/\*/;

export function readConfig(getAttribute, isColor) {
  const get = (name) => {
    const value = getAttribute(name);
    return typeof value === 'string' ? value.trim() : null;
  };

  const position = get('data-position');
  const language = get('data-language');
  const accent = get('data-accent');
  const buttonLabel = get('data-button-label');
  const storageKey = get('data-storage-key');

  return {
    position: POSITIONS.includes(position) ? position : 'bottom-right',
    language: language && /^[A-Za-z]{2,3}([-_][A-Za-z0-9]{1,8})*$/.test(language) ? language : null,
    accent:
      accent && accent.length <= 64 && !UNSAFE_CSS.test(accent) && isColor(accent)
        ? accent
        : DEFAULT_ACCENT,
    buttonLabel: buttonLabel ? buttonLabel.slice(0, 100) : null,
    storageKey: storageKey && STORAGE_KEY_PATTERN.test(storageKey) ? storageKey : DEFAULT_STORAGE_KEY
  };
}
