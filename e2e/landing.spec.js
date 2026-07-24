const { test, expect } = require('@playwright/test');

test.describe('Landing page flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('shows the hero heading and intro text', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Trade knowledge/i })).toBeVisible();
    await expect(page.getByText(/SkillSwap is a peer-to-peer skill exchange/i)).toBeVisible();
  });

  test('renders the Get started button linking to login', async ({ page }) => {
    await expect(page.getByRole('link', { name: /Get started/i })).toHaveAttribute('href', '/login');
  });

  test('renders the Create a free account button linking to login', async ({ page }) => {
    await expect(page.getByRole('link', { name: /Create a free account/i })).toHaveAttribute('href', '/login');
  });

  test('shows step 1 Teach card', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Teach' })).toBeVisible();
    await expect(page.getByText(/List up to 5 skills you can teach/i)).toBeVisible();
  });

  test('shows step 3 Learn card', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Learn' })).toBeVisible();
    await expect(page.getByText(/Spend those coins booking anyone else/i)).toBeVisible();
  });

  test('shows the fair coin movement section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /How the coins stay fair/i })).toBeVisible();
    await expect(page.getByText(/Coins are locked in escrow/i)).toBeVisible();
  });

  test('renders the footer brand text', async ({ page }) => {
    await expect(page.getByText(/SkillSwap — Teach. Earn. Learn./i)).toBeVisible();
  });

  test('has three flow cards on the landing page', async ({ page }) => {
    await expect(page.locator('section').nth(1).getByRole('heading')).toHaveCount(3);
  });
});
