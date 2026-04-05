// @ts-check
import { test, expect } from './support/step-screenshot.js';

test('navigates to Facebook and verifies the page', async ({ page }) => {
  await page.goto('https://www.facebook.com');
  await expect(page).toHaveTitle(/Facebook/i);
});
