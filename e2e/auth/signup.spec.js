import { test, expect } from '@playwright/test';

test.describe('Login page flow - Sign-up', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Switch to sign-up mode
    const toggleButtons = page.locator('button');
    const signUpButton = toggleButtons.nth(1); // Second button is "Sign up"
    await signUpButton.click();

    // Verify we're in sign-up mode by checking Name input is visible
    const nameInput = page.locator('input[placeholder="Your name"]');
    await expect(nameInput).toBeVisible();
  });

  test('shows sign-up mode after toggling', async ({ page }) => {
    // Verify Name input is visible
    const nameInput = page.locator('input[placeholder="Your name"]');
    await expect(nameInput).toBeVisible();

    // Verify email and password are still visible
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });

  test('name input accepts text', async ({ page }) => {
    const nameInput = page.locator('input[placeholder="Your name"]');
    const testName = 'John Doe';

    await nameInput.fill(testName);
    const value = await nameInput.inputValue();

    expect(value).toBe(testName);
  });

  test('email input accepts text', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    const testEmail = 'user@example.com';

    await emailInput.fill(testEmail);
    const value = await emailInput.inputValue();

    expect(value).toBe(testEmail);
  });

  test('password input accepts text', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]');
    const testPassword = 'MySecurePassword123';

    await passwordInput.fill(testPassword);
    const value = await passwordInput.inputValue();

    expect(value).toBe(testPassword);
  });

  test('shows validation error when submitting with empty name', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const allButtons = page.locator('button');
    const submitButton = allButtons.last();

    // Leave name empty, fill others
    await emailInput.fill('user@example.com');
    await passwordInput.fill('password123');

    await submitButton.click();

    const errorMessage = page.getByText(/Please enter your name/);
    await expect(errorMessage).toBeVisible();
  });

  test('shows validation error when submitting empty form', async ({ page }) => {
    const allButtons = page.locator('button');
    const submitButton = allButtons.last();

    await submitButton.click();

    const errorMessage = page.getByText(/Email and password are required/);
    await expect(errorMessage).toBeVisible();
  });

  test('shows validation error for password less than 6 characters', async ({ page }) => {
    const nameInput = page.locator('input[placeholder="Your name"]');
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const allButtons = page.locator('button');
    const submitButton = allButtons.last();

    await nameInput.fill('John Doe');
    await emailInput.fill('user@example.com');
    await passwordInput.fill('12345'); // 5 characters

    await submitButton.click();

    const errorMessage = page.getByText(/Password must be at least 6 characters/);
    await expect(errorMessage).toBeVisible();
  });

  test('shows SkillCoins signup message', async ({ page }) => {
    const skillCoinsMessage = page.getByText(/You will receive 100 SkillCoins on signup/);
    await expect(skillCoinsMessage).toBeVisible();
  });

  test('can toggle back to sign-in mode', async ({ page }) => {
    const toggleButtons = page.locator('button');
    const signInButton = toggleButtons.nth(0); // First button is "Sign in"

    await signInButton.click();

    // Verify Name input is no longer visible
    const nameInput = page.locator('input[placeholder="Your name"]');
    await expect(nameInput).not.toBeVisible();
  });
});

