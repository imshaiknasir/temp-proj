// @ts-check
import { defineConfig, devices } from '@playwright/test';
import * as os from 'node:os';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */

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
  globalSetup: './global-setup.js',
  fullyParallel: true,
  reporter: [
    ['html', { open: 'never' }],
    [
      'allure-playwright',
      {
        resultsDir: 'allure-results',
        detail: true,
        suiteTitle: true,
        environmentInfo: {
          OS: `${os.platform()} ${os.release()}`,
          Host: os.hostname(),
          Build: process.env.BUILD_NUMBER || process.env.GITHUB_RUN_NUMBER || 'local',
          Environment: process.env.TEST_ENV || 'local',
          Execution_Mode: process.env.GITHUB_ACTIONS ? 'GitHub Actions' : 'Local',
          Node_Version: process.version,
        },
      },
    ],
  ],
  use: {
    ignoreHTTPSErrors: true,
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

