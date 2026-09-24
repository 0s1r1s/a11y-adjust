# Changelog

All notable changes to this project are documented here. The project follows
[Semantic Versioning](https://semver.org/).

## [0.1.0] - Unreleased

### Added

* Launcher button and preferences panel rendered in a Shadow DOM.
* Preferences: text size, line height, letter spacing, readable font, high contrast,
  grayscale, highlight links, highlight headings, reduce motion, focus highlight,
  large cursor, reading guide, reading mask.
* Reset of all preferences.
* Persistence in `localStorage` with a versioned, validated storage format.
* Configuration through `data-position`, `data-language`, `data-accent`,
  `data-button-label` and `data-storage-key`.
* Automatic language detection with translations for English, German, French,
  Spanish, Italian, Portuguese, Dutch and Polish.
* Public API: `open`, `close`, `toggle`, `reset`, `set`, `getPreferences`, `version`.
* Events: `a11y:change` and `a11y:reset`.
* Strict CSP compatibility through constructable stylesheets.
* Unit, browser, accessibility and CSP test suites; bundle size budget; SHA-256
  and SRI hash generation; release workflow with npm provenance.
