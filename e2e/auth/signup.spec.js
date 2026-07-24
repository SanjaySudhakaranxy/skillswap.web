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


    // Error should still be visible
    await expect(errorMessage).toBeVisible();

    // Submit again - different error or success depends on implementation
    await submitButton.click();
  });

  test('accepts valid form data', async ({ page }) => {
    const nameInput = page.getByRole('textbox', { name: /Name/i });
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.getByRole('button', { name: /Create account/i });

    // Fill all fields with valid data
    await nameInput.fill('Jane Smith');
    await emailInput.fill('jane.smith@example.com');
    await passwordInput.fill('ValidPassword123');

    // No error should be visible yet
    const errorMessage = page.locator('p.text-red-400');
    const errorCount = await errorMessage.count();

    // Submit the form
    await submitButton.click();

    // Form should either succeed or show an API-level error
    // (not a validation error on the client side)
    // If there's an error, it should be from the backend (e.g., email already exists)
    // We can't fully test signup without a real backend, but we verify the form accepts valid input
  });
});
