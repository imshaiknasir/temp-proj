// @ts-check
import { test as base, expect } from '@playwright/test';
import * as os from 'node:os';
import * as allure from 'allure-js-commons';

/** @type {any} */
const fixtureBase = base;

/** @type {(args: Record<string, unknown>, use: (value: void) => Promise<void>) => Promise<void>} */
const applyAllureLabels = async ({}, use) => {
  await allure.label('os', `${os.platform()} ${os.release()}`);
  await allure.label('build', process.env.BUILD_NUMBER || process.env.GITHUB_RUN_NUMBER || 'local');
  await allure.label('environment', process.env.TEST_ENV || 'local');
  await allure.label('execution_mode', process.env.GITHUB_ACTIONS ? 'GitHub Actions' : 'Local');
  await use();
};

/**
 * @param {string} title
 */
function sanitizeStepTitle(title) {
  const normalizedTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return normalizedTitle || 'step';
}

export const test = fixtureBase.extend({
  allureLabels: [applyAllureLabels, { auto: true }],

  /**
   * @param {{ page: import('@playwright/test').Page }} args
   * @param {(value: (title: string, body: () => unknown | Promise<unknown>, screenshotOptions?: import('@playwright/test').PageScreenshotOptions) => Promise<unknown>) => Promise<void>} use
   * @param {import('@playwright/test').TestInfo} testInfo
   */
  step: async ({ page }, use, testInfo) => {
    let stepIndex = 0;

    await use(
      /**
       * @param {string} title
       * @param {() => unknown | Promise<unknown>} body
       * @param {import('@playwright/test').PageScreenshotOptions} [screenshotOptions]
       */
      async (title, body, screenshotOptions = {}) => {
      stepIndex += 1;

      return await base.step(title, async () => {
        let result;
        let stepError;

        try {
          result = await body();
        } catch (error) {
          stepError = error;
        }

        if (!page.isClosed()) {
          try {
            await testInfo.attach(
              `${String(stepIndex).padStart(2, '0')}-${sanitizeStepTitle(title)}.png`,
              {
                body: await page.screenshot(screenshotOptions),
                contentType: 'image/png',
              },
            );
          } catch (screenshotError) {
            if (!stepError) {
              throw screenshotError;
            }
          }
        }

        if (stepError) {
          throw stepError;
        }

        return result;
      });
      },
    );
  },
});

export { expect };