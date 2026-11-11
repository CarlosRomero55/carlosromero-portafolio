import { defineConfig, devices } from '@playwright/test'

const BASE = process.env.BASE_URL || 'http://localhost:3000'

export default defineConfig({
  testDir: './tests/e2e',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: { baseURL: BASE, trace: 'on-first-retry' },
  projects: [
    { name: 'escritorio', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'movil', use: { ...devices['Pixel 7'] } },
  ],
  webServer: process.env.BASE_URL
    ? undefined
    : { command: 'pnpm start', url: `${BASE}/es`, reuseExistingServer: true, timeout: 120_000 },
})
