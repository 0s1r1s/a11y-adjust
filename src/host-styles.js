// Styles that intentionally affect the host page. Every rule is scoped to a
// namespaced class on <html>, so removing the class fully reverts the effect.

const P = 'html.a11y-adjust-';
const HOST = 'a11y-adjust';
const EVERY = ` body *:not(${HOST})`;

function cursor(fill, hotspot, fallback) {
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">' +
    `<path d="M5 2v30l8-7 5 12 6-2.5-5-11.5h11z" fill="${fill}" stroke="#fff" stroke-width="2.5" stroke-linejoin="round"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") ${hotspot}, ${fallback}`;
}

export function hostCss(accent) {
  const interactive = 'a[href],button,[role="button"],label,select,summary,input[type="checkbox"],input[type="radio"],input[type="submit"]';
  return `
${P}text-size{font-size:var(--a11y-adjust-root-size)!important}
${P}line-height${EVERY}{line-height:1.8!important}
${P}letter-spacing${EVERY}{letter-spacing:.12em!important;word-spacing:.16em!important}
${P}readable-font${EVERY}:not(code,pre,kbd,samp,.fa,[class*="fa-"],[class*="icon"],[class*="material-symbols"],[class*="material-icons"],[aria-hidden="true"]){font-family:system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif!important}
${P}high-contrast,${P}high-contrast body{background:#000!important;color:#fff!important}
${P}high-contrast${EVERY}:not(img,video,picture,canvas,iframe,svg,svg *){background-color:#000!important;color:#fff!important;border-color:#fff!important;text-shadow:none!important;box-shadow:none!important}
${P}high-contrast body a[href],${P}high-contrast body a[href] *{color:#ff0!important}
${P}high-contrast body :is(button,input,select,textarea){border:1px solid #fff!important}
${P}high-contrast body ::placeholder{color:#ccc!important;opacity:1!important}
${P}grayscale{filter:grayscale(1)!important}
${P}highlight-links body a[href]{text-decoration:underline!important;text-decoration-thickness:2px!important;text-underline-offset:3px!important;outline:2px solid ${accent}!important;outline-offset:2px!important}
${P}highlight-headings body :is(h1,h2,h3,h4,h5,h6,[role="heading"]){outline:2px dashed ${accent}!important;outline-offset:4px!important}
${P}reduce-motion,${P}reduce-motion *,${P}reduce-motion *::before,${P}reduce-motion *::after{animation-duration:.001ms!important;animation-delay:0s!important;animation-iteration-count:1!important;transition-duration:.001ms!important;transition-delay:0s!important;scroll-behavior:auto!important}
${P}focus-highlight body :focus-visible{outline:3px solid ${accent}!important;outline-offset:3px!important;box-shadow:0 0 0 6px #fff!important}
${P}large-cursor,${P}large-cursor body *{cursor:${cursor('#000', '5 2', 'auto')}!important}
${P}large-cursor body :is(${interactive}){cursor:${cursor('#1d4ed8', '5 2', 'pointer')}!important}
`;
}

// Installs a stylesheet into a document or shadow root. Constructable
// stylesheets are not affected by CSP style-src restrictions, which keeps
// the widget compatible with strict policies. Returns an update function.
export function installSheet(target, css) {
  if ('adoptedStyleSheets' in target && typeof CSSStyleSheet === 'function' && 'replaceSync' in CSSStyleSheet.prototype) {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(css);
    target.adoptedStyleSheets = [...target.adoptedStyleSheets, sheet];
    return (next) => sheet.replaceSync(next);
  }
  const style = document.createElement('style');
  style.textContent = css;
  (target === document ? document.head || document.documentElement : target).append(style);
  return (next) => {
    style.textContent = next;
  };
}
