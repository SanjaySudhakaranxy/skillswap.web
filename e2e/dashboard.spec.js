import { test, expect } from '@playwright/test';

test.describe('Dashboard & Protected Routes Flow', () => {
  test('redirects unauthenticated users from dashboard to login page', async ({ page }) => {
    await page.goto('/dashboard');
    // The middleware should intercept this and redirect to /login
    await expect(page).toHaveURL(/.*\/login/);
    
    // Verify the login page is actually rendered
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
  });

  test('redirects unauthenticated users from profile to login page', async ({ page }) => {
    await page.goto('/profile');
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('redirects unauthenticated users from browse to login page', async ({ page }) => {
    await page.goto('/browse');
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('redirects unauthenticated users from sessions to login page', async ({ page }) => {
    await page.goto('/sessions');
    await expect(page).toHaveURL(/.*\/login/);
  });
});
