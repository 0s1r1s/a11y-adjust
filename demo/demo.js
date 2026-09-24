// Demo helpers: API buttons and an event log. Not part of the widget.
const log = document.getElementById('event-log');
const write = (line) => {
  log.textContent = (line + '\n' + log.textContent).split('\n').slice(0, 8).join('\n');
};
window.addEventListener('a11y:change', (e) => write('a11y:change ' + JSON.stringify(e.detail)));
window.addEventListener('a11y:reset', () => write('a11y:reset'));

const actions = {
  open: () => A11yAdjust.open(),
  contrast: () => A11yAdjust.set('highContrast', !A11yAdjust.getPreferences().highContrast),
  size: () => A11yAdjust.set('textSize', 1.25),
  read: () => write('getPreferences() ' + JSON.stringify(A11yAdjust.getPreferences())),
  reset: () => A11yAdjust.reset()
};
document.querySelectorAll('[data-demo]').forEach((button) => {
  button.addEventListener('click', () => actions[button.dataset.demo]());
});
document.getElementById('signup').addEventListener('submit', (e) => {
  e.preventDefault();
  write('Form submitted (nothing was sent anywhere).');
});
