import fs from 'node:fs';
import path from 'node:path';
import { defineConfig, devices } from '@playwright/test';

const ROOT_DIR = typeof __dirname !== 'undefined' ? __dirname : process.cwd();

const loadEnvFile = (process as unknown as { loadEnvFile?: (filePath?: string) => void }).loadEnvFile;
if (typeof loadEnvFile === 'function') {
  for (const envName of ['.env.local', '.env']) {
    const envPath = path.join(ROOT_DIR, envName);
    if (fs.existsSync(envPath)) {
      try {
        loadEnvFile(envPath);
      } catch {
        // Ignore optional env file read issues
      }
    }
  }
}

const PORT = process.env.PORT || '3000';
const baseURL = (process.env.BASE_URL || `http://localhost:${PORT}`).replace(/\/+$/, '');
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || baseURL).replace(/\/+$/, '');
process.env.NEXT_PUBLIC_SITE_URL = siteUrl;

const SYSTEM_CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const executablePath =
  process.env.PLAYWRIGHT_EXECUTABLE_PATH ||
  process.env.CHROME_PATH ||
  (process.platform === 'win32' && fs.existsSync(SYSTEM_CHROME_PATH) ? SYSTEM_CHROME_PATH : undefined);

const hasProductionBuild = fs.existsSync(path.join(ROOT_DIR, '.next', 'BUILD_ID'));

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/*.spec.ts',
  outputDir: 'test-results/artifacts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 45_000,
  expect: {
    timeout: 10_000,
  },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    locale: 'pt-BR',
    timezoneId: 'America/Bahia',
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
    ...(executablePath ? { launchOptions: { executablePath } } : {}),
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
        ...(executablePath ? { launchOptions: { executablePath } } : { channel: 'chrome' }),
      },
    },
  ],
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: hasProductionBuild ? 'npm run start' : 'npm run build && npm run start',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
        stdout: 'pipe',
        stderr: 'pipe',
        env: {
          ...process.env,
          PORT,
          NEXT_PUBLIC_SITE_URL: siteUrl,
          NODE_ENV: 'production',
        },
      },
});
