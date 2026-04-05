// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
/** @type {import('@playwright/test').ScreenshotMode} */
const screenshotMode = process.env.PLAYWRIGHT_SCREENSHOT_MODE === 'only-on-failure' ? 'only-on-failure' : 'on';

/** @type {import('@playwright/test').TraceMode} */
const traceMode = process.env.PLAYWRIGHT_TRACE_MODE === 'on'
  ? 'on'
  : process.env.PLAYWRIGHT_TRACE_MODE === 'retain-on-failure'
    ? 'retain-on-failure'
    : 'on-first-retry';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: [['html' ,{open: 'never'}], ['allure-playwright']],
  use: {
    screenshot: screenshotMode,
    trace: traceMode,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ],

});

