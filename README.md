> [!IMPORTANT]
> This project has not been implemented yet. This README describes the intended goals and planned functionality, not an existing implementation.

# A11yAdjust

**Tiny accessibility preferences for any website.**

A11yAdjust is a lightweight, dependency-free accessibility preferences widget that can be added to almost any website with a single `<script>` tag.

No account. No backend. No tracking. No API key.

It gives visitors control over common visual and interaction preferences without pretending to automatically make a website accessible or compliant.

## Why A11yAdjust?

* **One script tag**
* **< 15 KB gzip target**
* **Zero runtime dependencies**
* **Zero tracking**
* **Zero cookies**
* **Zero runtime network requests**
* **Framework agnostic**
* **Fully self-hostable**
* **MIT licensed**

---

## Quick Start

Add this before the closing `</body>` tag or anywhere with `defer`:

```html
<script
  src="https://cdn.jsdelivr.net/npm/a11y-adjust@1/dist/a11y-adjust.min.js"
  defer>
</script>
```

That's it.

A floating accessibility button will automatically appear on the page.

No initialization is required.

---

## Live Demo

Try A11yAdjust here:

**https://YOUR-USERNAME.github.io/a11y-adjust/**

The demo should contain real page elements such as:

* headings
* paragraphs
* links
* buttons
* forms
* images
* cards
* sticky navigation
* animated elements
* long-form content

This makes it possible to test the widget against realistic layouts.

---

## Features

A11yAdjust focuses on a small set of useful user-controlled preferences.

### Text

* Increase text size
* Increase line height
* Increase letter spacing
* Use a readable system font

### Visual

* High contrast
* Grayscale
* Highlight links
* Highlight headings

### Interaction

* Reduce motion
* Enhanced focus indicators
* Large cursor

### Reading

* Reading guide
* Reading mask

### General

* Reset all preferences
* Automatic language detection
* Persistent preferences using `localStorage`
* Keyboard accessible interface
* Screen reader friendly controls

Not every feature has to ship in the first release.

The project intentionally prefers a small, reliable core over a large feature set.

---

## What A11yAdjust Is Not

A11yAdjust is **not** an accessibility compliance overlay.

It does not automatically repair accessibility problems in the host website.

It does not:

* generate missing alt text
* add ARIA labels automatically
* repair inaccessible forms
* change heading structure
* rewrite page semantics
* fix keyboard navigation
* perform WCAG audits
* certify WCAG compliance
* certify EAA compliance
* certify BFSG compliance

A website still needs to be designed and developed accessibly.

A11yAdjust simply provides additional preferences that visitors may find useful.

> A11yAdjust provides user-controlled accessibility preferences. It does not make an inaccessible website compliant.

---

## Installation

### CDN

For most websites:

```html
<script
  src="https://cdn.jsdelivr.net/npm/a11y-adjust@1/dist/a11y-adjust.min.js"
  defer>
</script>
```

Using `@1` automatically receives compatible updates within version 1.

### Pin a specific version

For reproducible deployments:

```html
<script
  src="https://cdn.jsdelivr.net/npm/a11y-adjust@1.0.0/dist/a11y-adjust.min.js"
  defer>
</script>
```

Pinning an exact version is recommended for environments where deployments should remain fully reproducible.

### With Subresource Integrity

For security-sensitive production environments:

```html
<script
  src="https://cdn.jsdelivr.net/npm/a11y-adjust@1.0.0/dist/a11y-adjust.min.js"
  integrity="sha384-REPLACE_WITH_RELEASE_HASH"
  crossorigin="anonymous"
  defer>
</script>
```

Every release should publish its corresponding SRI hash.

### UNPKG

A11yAdjust can also be loaded through UNPKG:

```html
<script
  src="https://unpkg.com/a11y-adjust@1.0.0/dist/a11y-adjust.min.js"
  defer>
</script>
```

jsDelivr is the recommended CDN in the documentation.

---

## Self Hosting

A11yAdjust does not depend on any hosted service.

Download the bundle and serve it from your own infrastructure:

```html
<script
  src="/assets/a11y-adjust.min.js"
  defer>
</script>
```

The self-hosted version behaves exactly like the CDN version.

There are no hidden API calls or cloud dependencies.

---

## Configuration

A11yAdjust works without configuration.

Optional settings can be provided through `data-*` attributes.

```html
<script
  src="https://cdn.jsdelivr.net/npm/a11y-adjust@1/dist/a11y-adjust.min.js"
  data-position="bottom-left"
  data-language="de"
  data-accent="#2563eb"
  defer>
</script>
```

### Position

Supported values:

```text
bottom-right
bottom-left
top-right
top-left
```

Example:

```html
data-position="bottom-left"
```

Default:

```text
bottom-right
```

### Language

A11yAdjust automatically reads the language from:

```html
<html lang="de">
```

The language can also be overridden:

```html
data-language="de"
```

Unsupported languages fall back to English.

### Accent color

```html
data-accent="#2563eb"
```

Only valid CSS color values are accepted.

### Button label

```html
data-button-label="Accessibility preferences"
```

User-provided values are treated as plain text.

They are never interpreted as HTML.

### Storage key

The default storage key is:

```text
a11y-adjust-preferences
```

It may optionally be changed:

```html
data-storage-key="my-site-accessibility"
```

---

## JavaScript API

The standard installation requires no JavaScript configuration.

For advanced integrations, A11yAdjust exposes a small global API:

```js
A11yAdjust.open();
A11yAdjust.close();
A11yAdjust.toggle();
A11yAdjust.reset();
```

Preferences can also be read:

```js
const preferences = A11yAdjust.getPreferences();
```

Or changed programmatically:

```js
A11yAdjust.set('highContrast', true);
A11yAdjust.set('textSize', 1.25);
```

Invalid settings or values are ignored safely.

---

## Events

A11yAdjust dispatches browser events when preferences change.

```js
window.addEventListener('a11y:change', (event) => {
  console.log(event.detail);
});
```

Example:

```js
{
  setting: 'highContrast',
  value: true
}
```

Reset event:

```js
window.addEventListener('a11y:reset', () => {
  console.log('Accessibility preferences reset');
});
```

Events never contain personal data.

---

## Privacy

A11yAdjust is designed around a simple privacy rule:

> If the widget does not need the data, it should never read it.

A11yAdjust does not collect, transmit or analyze personal data.

It does not use:

* analytics
* telemetry
* tracking pixels
* cookies
* fingerprinting
* unique visitor IDs
* remote configuration
* external APIs

After the JavaScript bundle has loaded, A11yAdjust makes **zero network requests**.

User preferences are stored locally in the browser using:

```js
localStorage
```

Only accessibility preferences are stored.

Example:

```json
{
  "version": 1,
  "textSize": 1.25,
  "reduceMotion": true,
  "grayscale": false
}
```

A11yAdjust never stores:

* page URLs
* page content
* form values
* email addresses
* authentication tokens
* user IDs
* timestamps for analytics purposes

If `localStorage` is unavailable, the widget continues to work without persistence.

---

## Security

A11yAdjust runs inside the host website and is therefore treated as security-sensitive code.

The project intentionally keeps its attack surface small.

### Runtime security principles

A11yAdjust uses:

* zero runtime dependencies
* no dynamic JavaScript loading
* no `eval()`
* no `new Function()`
* no inline event handlers
* no remote assets
* no external fonts
* no external icon libraries
* no telemetry endpoints
* no runtime API requests

Icons are embedded directly inside the package.

### XSS protection

Configurable text is never inserted as executable HTML.

Preferred APIs include:

```js
element.textContent
document.createElement()
element.setAttribute()
element.append()
```

Values such as:

```html
data-button-label="<img src=x onerror=alert(1)>"
```

must be displayed literally as text and must never execute.

### Configuration validation

Configuration values are validated before use.

For example, position only accepts known values:

```js
[
  'bottom-right',
  'bottom-left',
  'top-right',
  'top-left'
]
```

Unknown values are ignored.

### Content Security Policy

A11yAdjust aims to work with strict Content Security Policies.

The production bundle does not require:

```text
unsafe-eval
```

and does not dynamically load additional JavaScript.

### Shadow DOM

The widget interface runs inside a Shadow DOM to reduce CSS conflicts with the host website.

Shadow DOM is used for style isolation only.

It is not treated as a security boundary.

---

## Supply Chain Security

A11yAdjust should remain easy to audit.

Production releases should use:

* protected GitHub branches
* mandatory pull request reviews
* npm Trusted Publishing
* GitHub Actions OIDC
* npm provenance
* pinned GitHub Actions
* automated tests before publishing
* reproducible release builds where practical
* published SHA-256 hashes
* published SHA-384 SRI hashes

Permanent npm publishing tokens should not be required.

---

## Why Zero Dependencies?

A widget embedded across many websites becomes part of every site's JavaScript execution environment.

Every runtime dependency adds:

* additional code
* additional maintenance risk
* additional supply-chain risk
* additional bundle size
* additional upgrade complexity

A11yAdjust therefore aims for:

```text
Runtime dependencies: 0
```

Build and test dependencies are allowed.

They are not included in the browser bundle.

---

## Performance

A11yAdjust is designed to remain mostly inactive until the user interacts with it.

When no interactive reading features are active, the widget should use:

```text
0 permanent timers
0 animation loops
0 MutationObservers
minimal global event listeners
```

Features such as the reading guide should only register their listeners while enabled.

All feature-specific listeners must be removed again when the feature is disabled.

### Bundle size

Target:

```text
< 15 KB gzip
```

Stretch goal:

```text
< 10 KB gzip
```

Bundle size is checked automatically during CI.

The goal is not to fit as many features as possible into the package.

The goal is to keep the useful core small.

---

## Accessibility of the Widget

An accessibility widget should itself be accessible.

A11yAdjust therefore aims to support:

* complete keyboard navigation
* semantic HTML controls
* visible focus states
* screen readers
* correct ARIA states
* sufficient contrast
* large enough touch targets
* reduced-motion preferences
* focus restoration
* logical tab order

The launcher uses a real:

```html
<button type="button">
```

instead of clickable `<div>` elements.

The panel can be closed using:

```text
Escape
```

When the panel closes, focus returns to the launcher button.

A11yAdjust should be regularly tested with automated accessibility tooling and manual keyboard testing.

---

## Native User Preferences

Where possible, A11yAdjust respects browser and operating system preferences.

Examples include:

```css
@media (prefers-reduced-motion: reduce)
```

and:

```css
@media (prefers-color-scheme: dark)
```

Native preferences should take priority over unnecessary custom behavior.

---

## Framework Support

A11yAdjust does not depend on a framework.

It should work with websites built using:

* plain HTML
* WordPress
* Shopify
* Webflow
* React
* Next.js
* Vue
* Nuxt
* Svelte
* Astro
* Laravel
* Symfony
* Django
* Rails
* Shopware
* TYPO3

No framework-specific package is required.

Use the same script tag everywhere.

---

## CSS Isolation

The widget interface is rendered inside a Shadow DOM.

This protects the interface from common host styles such as:

```css
button {
  all: unset;
}

svg {
  width: 100%;
}

* {
  box-sizing: content-box;
}
```

A11yAdjust's own UI should remain stable even when used inside sites built with Bootstrap, Tailwind, WordPress themes or page builders.

Accessibility preferences that intentionally affect the host website are applied outside the Shadow DOM using clearly namespaced classes.

Example:

```text
a11y-adjust-reduce-motion
a11y-adjust-grayscale
a11y-adjust-readable-font
```

---

## Browser Support

The target is the current stable versions of:

* Chrome
* Edge
* Firefox
* Safari
* Mobile Safari
* Chrome for Android

Internet Explorer is not supported.

---

## Package Structure

Planned package output:

```text
dist/
  a11y-adjust.js
  a11y-adjust.min.js
```

The minified file is intended for production and CDN use.

The readable build is provided for debugging, auditing and development.

---

## Development

Clone the repository:

```bash
git clone https://github.com/YOUR-USERNAME/a11y-adjust.git
cd a11y-adjust
```

Install development dependencies:

```bash
npm install
```

Start the development environment:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Run tests:

```bash
npm test
```

Run browser tests:

```bash
npm run test:e2e
```

Run accessibility tests:

```bash
npm run test:a11y
```

Exact commands may change while the initial project structure is being developed.

---

## Testing

A11yAdjust should be tested against multiple types of websites.

Example fixtures:

```text
Plain HTML
Bootstrap
Tailwind
SPA
Long-form article
Shop
Dashboard
Landing page
```

Special cases to test include:

* sticky navigation
* fixed elements
* modals
* high z-index values
* CSS transforms
* overflow containers
* responsive layouts
* mobile safe areas
* dynamically rendered content

Automated browser tests should use Playwright.

Accessibility tests may use axe-core as a development dependency.

axe-core is never included in the production bundle.

---

## Contributing

Contributions are welcome.

Useful contribution areas include:

* browser testing
* accessibility testing
* translations
* bug reports
* performance improvements
* documentation
* compatibility fixes
* reduced-motion testing
* screen reader testing

Before proposing a new feature, consider whether it fits the project's core philosophy.

A feature should ideally:

1. work completely locally
2. require no runtime dependency
3. require no additional network request
4. collect no personal data
5. be fully reversible
6. avoid aggressive DOM manipulation
7. provide clear user value
8. justify its bundle-size cost

If not, it may belong outside the core package.

---

## Translations

Translations are welcome.

Initial languages are planned to include:

```text
English
German
French
Spanish
Italian
Portuguese
Dutch
Polish
```

Translation strings must contain plain text only.

HTML inside translations is not supported.

---

## Reporting Security Issues

Please do not publish security vulnerabilities as public GitHub issues.

Use GitHub Private Vulnerability Reporting when available.

See:

```text
SECURITY.md
```

for the current reporting process.

Responsible disclosure is appreciated.

---

## Roadmap

### v0.1

Core foundation:

* launcher
* preferences panel
* Shadow DOM
* English
* German
* storage
* reset
* text size
* line height
* letter spacing
* readable font
* grayscale
* highlight links
* reduce motion
* focus highlight
* public API

### v0.x

Additional preferences:

* high contrast
* highlight headings
* large cursor
* reading guide
* reading mask
* additional translations

### v1.0

Production-ready release:

* complete MVP feature set
* at least eight languages
* browser test suite
* accessibility test suite
* security test suite
* documented CSP compatibility
* npm provenance
* SRI hashes
* self-hosting documentation
* stable JavaScript API
* stable preference storage format

---

## Design Philosophy

A11yAdjust intentionally does less.

It does not want to become:

```text
an AI accessibility platform
a compliance scanner
a cloud service
a website rewriting engine
```

It should remain understandable enough that a developer can inspect the package and understand what it does.

The project optimizes for:

**small**

**local**

**predictable**

**auditable**

**useful**

The goal is that installing A11yAdjust feels as simple as adding any other tiny frontend utility:

```html
<script
  src="https://cdn.jsdelivr.net/npm/a11y-adjust@1/dist/a11y-adjust.min.js"
  defer>
</script>
```

Done.

---

## FAQ

### Does A11yAdjust make my website WCAG compliant?

No.

Accessibility requires accessible design, semantics, content, forms, navigation, keyboard support and many other considerations.

A11yAdjust only adds optional user preferences.

### Does A11yAdjust send visitor data anywhere?

No.

After the JavaScript bundle loads, A11yAdjust makes no runtime network requests.

### Does it use cookies?

No.

### Where are preferences stored?

Locally in the visitor's browser using `localStorage`.

### Does it require an account?

No.

### Does it require an API key?

No.

### Does it require a backend?

No.

### Can I self-host it?

Yes.

### Does it work with WordPress?

Yes. It is framework agnostic.

### Does it work with React or Vue?

Yes.

### Can I use it commercially?

Yes, under the MIT License.

### Can I modify it?

Yes.

### Why not automatically fix accessibility issues?

Automatic runtime modification of semantics and accessibility attributes can introduce unexpected behavior and can hide underlying accessibility problems.

A11yAdjust intentionally limits itself to explicit user preferences.

---

## License

MIT License.

See:

```text
LICENSE
```

for details.

---

## Project Principles

**One script.**

**Zero dependencies.**

**Zero tracking.**

**Zero runtime network requests.**

**Fully open source.**

**No compliance theater.**

**Just useful accessibility preferences.**

---

**A11yAdjust**

*Tiny accessibility preferences for any website.*
