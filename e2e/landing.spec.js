const { test, expect } = require('@playwright/test');

test('landing page shows hero and links', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Trade knowledge/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Get started/i })).toHaveAttribute('href', '/login');
  await expect(page.getByRole('link', { name: /Create a free account/i })).toHaveAttribute('href', '/login');
});
