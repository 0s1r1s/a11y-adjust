// Styles for the widget UI inside the Shadow DOM. Pixel units are used on
// purpose so the host text-size preference does not distort the panel.

export function widgetCss(accent) {
  return `
:host{all:initial!important;display:contents!important}
[hidden]{display:none!important}
*,*::before,*::after{box-sizing:border-box}
.root{--accent:${accent};--bg:#fff;--fg:#1a1a1a;--muted:#4b5563;--line:#d1d5db;--hover:#f3f4f6;--track:#6b7280;
font:15px/1.4 system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;color:var(--fg);letter-spacing:normal;word-spacing:normal;text-align:left;text-transform:none}
@media (prefers-color-scheme:dark){.root{--bg:#1c1f24;--fg:#f3f4f6;--muted:#c4c9d1;--line:#4b5563;--hover:#2a2e35;--track:#9ca3af}}
button{font:inherit;color:inherit;margin:0;cursor:pointer;-webkit-tap-highlight-color:transparent}
button:focus-visible{outline:3px solid var(--accent);outline-offset:2px}
h2:focus{outline:none}
svg{display:block;width:24px;height:24px;flex:none;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.sr{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
.launcher{position:fixed;z-index:2147483000;width:56px;height:56px;border-radius:50%;border:2px solid #fff;background:var(--accent);color:#fff;display:grid;place-items:center;padding:0;box-shadow:0 2px 10px rgba(0,0,0,.3)}
.launcher svg{width:32px;height:32px}
.launcher:focus-visible{outline-offset:3px}
.panel{position:fixed;z-index:2147483001;width:min(360px,calc(100vw - 32px));max-height:calc(100vh - 104px);max-height:calc(100dvh - 104px);display:flex;flex-direction:column;background:var(--bg);color:var(--fg);border:1px solid var(--line);border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.25)}
.bottom-right .launcher{right:calc(16px + env(safe-area-inset-right));bottom:calc(16px + env(safe-area-inset-bottom))}
.bottom-left .launcher{left:calc(16px + env(safe-area-inset-left));bottom:calc(16px + env(safe-area-inset-bottom))}
.top-right .launcher{right:calc(16px + env(safe-area-inset-right));top:calc(16px + env(safe-area-inset-top))}
.top-left .launcher{left:calc(16px + env(safe-area-inset-left));top:calc(16px + env(safe-area-inset-top))}
.bottom-right .panel{right:calc(16px + env(safe-area-inset-right));bottom:calc(84px + env(safe-area-inset-bottom))}
.bottom-left .panel{left:calc(16px + env(safe-area-inset-left));bottom:calc(84px + env(safe-area-inset-bottom))}
.top-right .panel{right:calc(16px + env(safe-area-inset-right));top:calc(84px + env(safe-area-inset-top))}
.top-left .panel{left:calc(16px + env(safe-area-inset-left));top:calc(84px + env(safe-area-inset-top))}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 8px 8px 16px;border-bottom:1px solid var(--line)}
h2{margin:0;font-size:17px;font-weight:700}
h3{margin:12px 0 4px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--muted)}
.icon{width:44px;height:44px;display:grid;place-items:center;border:0;border-radius:8px;background:transparent;padding:0}
.icon:hover,.toggle:hover{background:var(--hover)}
.body{overflow-y:auto;overscroll-behavior:contain;padding:0 8px 8px}
section{padding:0 8px}
.toggle{width:calc(100% + 16px);margin:0 -8px;min-height:44px;display:flex;align-items:center;justify-content:space-between;gap:12px;border:0;border-radius:8px;background:transparent;padding:6px 8px;text-align:left}
.switch{position:relative;flex:none;width:40px;height:24px;border-radius:12px;background:var(--track);border:2px solid transparent}
.switch::after{content:"";position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#fff;transition:transform .15s}
[aria-pressed="true"] .switch{background:var(--accent)}
[aria-pressed="true"] .switch::after{transform:translateX(16px)}
.stepper{display:flex;align-items:center;justify-content:space-between;gap:8px;min-height:48px}
.stepper .controls{display:flex;align-items:center;gap:4px}
.stepper .icon{border:1px solid var(--line)}
.stepper .icon[aria-disabled="true"]{opacity:.45;cursor:not-allowed}
output{min-width:52px;text-align:center;font-variant-numeric:tabular-nums;font-weight:600}
.foot{border-top:1px solid var(--line);padding:12px 16px;display:flex;flex-direction:column;gap:8px}
.reset{min-height:44px;border:1px solid var(--line);border-radius:8px;background:transparent;padding:8px 12px;display:flex;align-items:center;justify-content:center;gap:8px;font-weight:600}
.reset:hover{background:var(--hover)}
.reset svg{width:20px;height:20px}
.note{margin:0;font-size:13px;color:var(--muted)}
.guide{position:fixed;z-index:2147482999;left:0;right:0;height:8px;margin-top:-4px;background:var(--accent);border-top:2px solid #fff;border-bottom:2px solid #fff;pointer-events:none}
.mask{position:fixed;z-index:2147482998;left:0;right:0;background:rgba(0,0,0,.6);pointer-events:none}
.mask.top{top:0}
.mask.bottom{bottom:0}
@media (prefers-reduced-motion:reduce){.switch::after{transition:none}}
.no-motion .switch::after{transition:none}
@media (forced-colors:active){.launcher,.switch{border-color:ButtonText}.switch::after{background:ButtonText}[aria-pressed="true"] .switch{background:Highlight}.guide{background:Highlight}}
@media print{.root{display:none}}
`;
}
