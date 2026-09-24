import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;
// Set PW_ALL_BROWSERS=1 to also run Firefox and WebKit (they must be installed).
const browsers = process.env.PW_ALL_BROWSERS
  ? [['chromium', devices['Desktop Chrome']], ['firefox', devices['Desktop Firefox']], ['webkit', devices['Desktop Safari']]]
  : [['chromium', devices['Desktop Chrome']]];

const projects = [];
for (const [suite, testDir] of [['e2e', 'tests/e2e'], ['a11y', 'tests/a11y']]) {
  for (const [name, device] of browsers) {
    projects.push({ name: browsers.length > 1 ? `${suite}-${name}` : suite, testDir, use: { ...device } });
  }
}

export default defineConfig({
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: { baseURL: `http://localhost:${PORT}` },
  projects,
  webServer: {
    command: `node scripts/serve.mjs`,
    env: { PORT: String(PORT) },
    url: `http://localhost:${PORT}/demo/`,
    reuseExistingServer: !process.env.CI
  }
});
