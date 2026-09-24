// Reading guide and reading mask. Listeners exist only while one of the
// features is enabled and are removed again when both are disabled.

const BAND = 60;

export function readingTools(host, guide, maskTop, maskBottom) {
  let y = Math.round(window.innerHeight / 2);
  let frame = 0;
  let active = false;

  const render = () => {
    frame = 0;
    guide.style.top = y + 'px';
    maskTop.style.height = Math.max(0, y - BAND) + 'px';
    maskBottom.style.top = y + BAND + 'px';
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(render);
  };
  const onPointer = (event) => {
    y = event.clientY;
    schedule();
  };
  // Keyboard users: follow the focused element.
  const onFocus = (event) => {
    const target = event.target;
    if (!target || target === host || !target.getBoundingClientRect) return;
    const rect = target.getBoundingClientRect();
    y = Math.round(rect.top + rect.height / 2);
    schedule();
  };

  return function update(showGuide, showMask) {
    guide.hidden = !showGuide;
    maskTop.hidden = maskBottom.hidden = !showMask;
    const wanted = showGuide || showMask;
    if (wanted && !active) {
      window.addEventListener('pointermove', onPointer, { passive: true });
      document.addEventListener('focusin', onFocus);
      active = true;
      render();
    } else if (!wanted && active) {
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('focusin', onFocus);
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      active = false;
    }
  };
}
