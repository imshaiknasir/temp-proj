// @ts-check
import path from 'node:path';
import { test, expect } from '@playwright/test';
import { attachment, attachmentPath } from 'allure-js-commons';

const uploadFiles = [
  {
    name: 'upload-one.txt',
    filePath: path.resolve('tests/fixtures/upload-one.txt'),
    contentType: 'text/plain',
  },
  {
    name: 'upload-two.txt',
    filePath: path.resolve('tests/fixtures/upload-two.txt'),
    contentType: 'text/plain',
  },
];

test('selects multiple files and adds them to Allure', async ({ page }) => {
  await test.step('Open the multiple file upload page', async () => {
    await page.goto('https://demo.automationtesting.in/FileUpload.html');
    await expect(page).toHaveTitle(/File input - Multi select/i);
  });

  const fileInput = page.locator('#input-4');

  await test.step('Select multiple files', async () => {
    await expect(fileInput).toHaveAttribute('multiple', '');
    await fileInput.setInputFiles(uploadFiles.map((file) => file.filePath));

    await expect
      .poll(async () => {
        return fileInput.evaluate((element) => {
          const input = /** @type {HTMLInputElement} */ (element);
          return Array.from(input.files ?? []).map((file) => file.name);
        });
      })
      .toEqual(uploadFiles.map((file) => file.name));
  });

  await test.step('Verify the upload widget preview', async () => {
    const previewFrames = page.locator('.file-preview-frame');
    await expect(previewFrames).toHaveCount(uploadFiles.length);

    const previewArea = page.locator('.file-preview').first();
    await expect(previewArea).toBeVisible();

    for (const file of uploadFiles) {
      await expect(previewArea).toContainText(file.name.replace(/-/g, '_'));
    }
  });

  await test.step('Attach uploaded files in Allure', async () => {
    await attachment(
      'selected-files.json',
      JSON.stringify(
        {
          files: uploadFiles.map((file) => file.name),
          source: 'https://demo.automationtesting.in/FileUpload.html',
        },
        null,
        2,
      ),
      'application/json',
    );

    for (const file of uploadFiles) {
      await attachmentPath(`uploaded-file-${file.name}`, file.filePath, file.contentType);
    }

    const previewScreenshot = await page.locator('.file-preview').first().screenshot();
    await attachment('multi-file-upload-preview.png', previewScreenshot, 'image/png');
  });
});