import { test, expect } from '@playwright/test';

test('lead form happy path posts and renders the success state', async ({
  page,
}) => {
  await page.goto('/en/form');
  // Form fields keyed by autoComplete (stable across copy edits).
  await page.getByRole('textbox', { name: /name/i }).fill('Playwright Test');
  await page.getByRole('textbox', { name: /email/i }).fill('pw@example.com');
  await page
    .getByRole('textbox', { name: /message/i })
    .fill('Smoke test from CI.');

  const post = page.waitForResponse(
    (r) => r.url().endsWith('/api/leads') && r.request().method() === 'POST'
  );
  await page.getByRole('button', { name: /send|submit/i }).click();
  const res = await post;
  expect(res.ok()).toBeTruthy();

  // The form swaps to the success card after a 2xx.
  await expect(page.getByRole('status')).toBeVisible({ timeout: 5_000 });
});

test('lead form blocks submit when required fields are empty', async ({
  page,
}) => {
  await page.goto('/en/form');
  await page.getByRole('button', { name: /send|submit/i }).click();
  // Expect at least one inline error to appear (the form sets aria-invalid).
  const invalid = page.locator('[aria-invalid="true"]');
  await expect(invalid.first()).toBeVisible({ timeout: 5_000 });
});
