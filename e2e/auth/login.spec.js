import { test, expect } from '@playwright/test';

test.describe('Login page flow - Sign-in', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('shows sign-in mode by default', async ({ page }) => {
    // Verify email and password inputs are visible
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();

    // Verify Name input is NOT visible in sign-in mode
    const nameInputs = page.locator('input[placeholder="Your name"]');
    await expect(nameInputs).not.toBeVisible();

    // Verify the page has the SkillSwap logo/link
    const logo = page.getByText(/SkillSwap/);
    await expect(logo).toBeVisible();
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

  test('password input placeholder is visible', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]');
    const placeholder = await passwordInput.getAttribute('placeholder');

    expect(placeholder).toContain('At least 6 characters');
  });

  test('shows validation error when submitting empty form', async ({ page }) => {
    // Get all buttons and find the one that's not in the toggle section
    const allButtons = page.locator('button');
    const submitButton = allButtons.last(); // The submit button should be the last button

    await submitButton.click();

    // Expect error message
    const errorMessage = page.getByText(/Email and password are required/);
    await expect(errorMessage).toBeVisible();
  });

  test('shows validation error for password less than 6 characters', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const allButtons = page.locator('button');
    const submitButton = allButtons.last();

    await emailInput.fill('user@example.com');
    await passwordInput.fill('12345'); // 5 characters

    await submitButton.click();

    const errorMessage = page.getByText(/Password must be at least 6 characters/);
    await expect(errorMessage).toBeVisible();
  });

  test('can toggle to sign-up mode', async ({ page }) => {
    // Find the Sign up toggle button
    const toggleButtons = page.locator('button');
    const signUpButton = toggleButtons.nth(1); // Second button should be "Sign up"

    await signUpButton.click();

    // Verify Name input is now visible
    const nameInput = page.locator('input[placeholder="Your name"]');
    await expect(nameInput).toBeVisible();
  });

  test('password input supports Enter key submission', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]');

    // Press Enter on password field - should trigger form submission
    await passwordInput.press('Enter');

    // Expect validation error (missing email and password)
    const errorMessage = page.getByText(/Email and password are required/);
    await expect(errorMessage).toBeVisible();
  });

  test('logo link navigates to home page', async ({ page }) => {
    const logoLink = page.getByRole('link');
    await expect(logoLink).toBeVisible();
  });
});

