# Contributing

Thanks for helping. Please read the project principles in the README first:
small, local, predictable, auditable, useful.

## Setup

```bash
npm install
npm run dev        # http://localhost:4173/demo/
npm test           # unit tests
npm run test:e2e   # browser tests
npm run test:a11y  # axe-core accessibility tests
npm run size       # gzip budget check
```

## Rules for runtime code (`src/`)

* No runtime dependencies.
* No network requests, no `eval`, no `new Function`, no inline event handlers.
* Never insert strings as HTML. Use `textContent`, `createElement` and `setAttribute`.
* Validate every configuration value and stored preference.
* Effects on the host page must be scoped to an `a11y-adjust-*` class on `<html>`
  and must be fully reversible by removing that class.
* No permanent timers, animation loops or observers. Feature listeners are
  registered only while the feature is enabled.
* Keep the bundle below 15 KB gzip.

## Translations

Translations live in `src/i18n.js`. Add a row with the values in the same order
as `KEYS`. Strings are plain text only. The unit tests check that every language
provides every string.

## Pull requests

* Add or update tests for behavior changes.
* Run `npm test`, `npm run test:e2e` and `npm run test:a11y` before opening a PR.
* Update `CHANGELOG.md`.
