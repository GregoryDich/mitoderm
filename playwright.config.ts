import { defineConfig, devices } from '@playwright/test';

/** Critical-path smoke suite. Targets the production-mode dev server
 *  (`next dev`) by default because that mirrors what we ship, but stays
 *  on the lightweight side — these are not screenshot or visual tests,
 *  they assert that public routes return 200 and the lead form works
 *  end-to-end. Run with `npx playwright test`. */
const PORT = Number(process.env.PORT ?? 3000);
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'list' : 'line',
  use: {
    baseURL,
    trace: 'retain-on-failure',
    actionTimeout: 8_000,
    navigationTimeout: 15_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Reuse an already-running dev / start server if PLAYWRIGHT_BASE_URL
  // is overridden; otherwise spin up `next dev` ourselves.
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: 'npm run dev',
        url: baseURL,
        timeout: 90_000,
        reuseExistingServer: !process.env.CI,
        env: {
          ADMIN_PASSWORD: 'playwright-test-password',
        },
      },
});
