// @ts-check
import { test, expect } from './support/step-screenshot.js';

test('navigates to Google and verifies the page', async ({ page, step }) => {
  await step('Open Google homepage', async () => {
    await page.goto('https://www.google.com');
    await expect(page).toHaveTitle(/Google/i);
  });

  await step('Verify the search input is visible', async () => {
    const searchInput = page.locator('textarea[name="q"], input[name="q"]');
    await expect(searchInput.first()).toBeVisible();
  });
});
