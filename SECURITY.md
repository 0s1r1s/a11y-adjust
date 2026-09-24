# Security Policy

A11yAdjust runs inside the pages of every website that embeds it, so security
reports are taken seriously.

## Supported versions

| Version | Supported |
| ------- | --------- |
| 0.x     | Yes, latest release only |

## Reporting a vulnerability

Please **do not** open a public GitHub issue for security problems.

Use GitHub Private Vulnerability Reporting instead:
**Security** tab of this repository, then **Report a vulnerability**.

Please include:

* the affected version
* a description of the issue and its impact
* steps or a minimal page to reproduce it

You can expect an initial response within 7 days. Fixes are released as soon as
practical, and reporters are credited unless they prefer otherwise.

## Scope

In scope, for example:

* script execution through configuration attributes, stored preferences or translations
* the widget causing network requests or reading data it does not need
* bypasses of the preference validation
* CSP incompatibilities that require weakening a site's policy

Out of scope:

* accessibility problems of the host website
* issues that require an attacker who can already run script on the page
  (the Shadow DOM is used for style isolation, not as a security boundary)

## Verifying releases

Each release publishes SHA-256 checksums (`SHA256SUMS`) and SHA-384
Subresource Integrity hashes (`SRI.txt`) for the bundles, and the npm package
is published with provenance from GitHub Actions.
