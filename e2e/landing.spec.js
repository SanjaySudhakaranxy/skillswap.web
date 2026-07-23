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

  test('shows step 2 Earn card', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Earn' })).toBeVisible();
    await expect(page.getByText(/Run the session, both sides confirm/i)).toBeVisible();
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

  test('header logo navigates to the home page', async ({ page }) => {
    await page.getByRole('link', { name: /SkillSwap/i }).click();
    await expect(page).toHaveURL('/');
  });
});

test.describe('Login page flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('shows sign in mode by default', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Sign in' })).toHaveClass(/btn-primary/);
    await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible();
  });

  test('switches to sign up mode when clicked', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign up' }).click();
    await expect(page.getByRole('button', { name: 'Create account' })).toHaveClass(/btn-primary/);
    await expect(page.getByLabel('Name')).toBeVisible();
  });

  test('hides name field in sign in mode', async ({ page }) => {
    await expect(page.getByLabel('Name')).not.toBeVisible();
  });

  test('shows name field after toggling to sign up', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign up' }).click();
    await expect(page.getByLabel('Name')).toBeVisible();
  });

  test('email input accepts text', async ({ page }) => {
    const email = page.getByLabel('Email');
    await email.fill('test@example.com');
    await expect(email).toHaveValue('test@example.com');
  });

  test('password input accepts text', async ({ page }) => {
    const password = page.getByLabel('Password');
    await password.fill('secret123');
    await expect(password).toHaveValue('secret123');
  });

  test('shows validation error when submitting empty sign in form', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByText(/Email and password are required./i)).toBeVisible();
  });

  test('shows validation error for too short password in sign in mode', async ({ page }) => {
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('123');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByText(/Password must be at least 6 characters./i)).toBeVisible();
  });

  test('shows required name validation when signing up', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign up' }).click();
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('secret123');
    await page.getByRole('button', { name: 'Create account' }).click();
    await expect(page.getByText(/Please enter your name./i)).toBeVisible();
  });

  test('creates account button is visible in sign up mode', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign up' }).click();
    await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible();
  });

  test('switching back to sign in returns the sign in button label', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign up' }).click();
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByRole('button', { name: 'Sign in' })).toHaveClass(/btn-primary/);
  });

  test('sign up mode displays the SkillCoins signup message', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign up' }).click();
    await expect(page.getByText(/You will receive 100 SkillCoins on signup./i)).toBeVisible();
  });

  test('login page logo returns to landing page', async ({ page }) => {
    await page.getByRole('link', { name: /SkillSwap/i }).click();
    await expect(page).toHaveURL('/');
  });

  test('email input placeholder is visible', async ({ page }) => {
    await expect(page.getByPlaceholder('you@example.com')).toBeVisible();
  });

  test('password input placeholder is visible', async ({ page }) => {
    await expect(page.getByPlaceholder('At least 6 characters')).toBeVisible();
  });

  test('name input placeholder is visible in sign up mode', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign up' }).click();
    await expect(page.getByPlaceholder('Your name')).toBeVisible();
  });

  test('pressing Enter on password triggers validation', async ({ page }) => {
    await page.getByLabel('Password').press('Enter');
    await expect(page.getByText(/Email and password are required./i)).toBeVisible();
  });
});

test.describe('Unauthenticated page skeletons', () => {
  test('dashboard page shows title and loading state', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByText(/Loading.../i)).toBeVisible();
  });

  test('browse page shows title and loading state', async ({ page }) => {
    await page.goto('/browse');
    await expect(page.getByRole('heading', { name: 'Browse teachers' })).toBeVisible();
    await expect(page.getByText(/Loading.../i)).toBeVisible();
  });

  test('profile page shows title and loading state', async ({ page }) => {
    await page.goto('/profile');
    await expect(page.getByRole('heading', { name: 'Your profile' })).toBeVisible();
    await expect(page.getByText(/Loading.../i)).toBeVisible();
  });

  test('sessions page shows title and loading state', async ({ page }) => {
    await page.goto('/sessions');
    await expect(page.getByRole('heading', { name: 'Sessions' })).toBeVisible();
    await expect(page.getByText(/Loading.../i)).toBeVisible();
  });

  test('wallet page shows title and loading state', async ({ page }) => {
    await page.goto('/wallet');
    await expect(page.getByRole('heading', { name: 'Wallet' })).toBeVisible();
    await expect(page.getByText(/Loading.../i)).toBeVisible();
  });

  test('teacher page shows title and loading state', async ({ page }) => {
    await page.goto('/teacher/test-teacher');
    await expect(page.getByRole('heading', { name: 'Teacher' })).toBeVisible();
    await expect(page.getByText(/Loading.../i)).toBeVisible();
  });

  test('browse page search input is visible while loading', async ({ page }) => {
    await page.goto('/browse');
    await expect(page.getByPlaceholder('Try: react, guitar, sql...')).toBeVisible();
  });

  test('sessions page shows all tab buttons', async ({ page }) => {
    await page.goto('/sessions');
    await expect(page.getByRole('button', { name: /Pending/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Accepted/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Completed/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Declined/i })).toBeVisible();
  });

  test('dashboard page contains a Find a teacher link in the loading skeleton', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByRole('link', { name: /Find a teacher/i })).toBeVisible();
  });

  test('login page has two mode buttons available', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign up' })).toBeVisible();
  });

  test('profile page shows the profile form label', async ({ page }) => {
    await page.goto('/profile');
    await expect(page.getByRole('heading', { name: 'Your profile' })).toBeVisible();
    await expect(page.getByLabel('Name')).toBeVisible();
  });

  test('wallet page shows the Wallet heading and loading text', async ({ page }) => {
    await page.goto('/wallet');
    await expect(page.getByRole('heading', { name: 'Wallet' })).toBeVisible();
    await expect(page.getByText(/Loading.../i)).toBeVisible();
  });

  test('sessions page has four status tabs', async ({ page }) => {
    await page.goto('/sessions');
    await expect(page.getByRole('button', { name: /Pending/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Accepted/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Completed/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Declined/i })).toBeVisible();
  });

  test('browse page search input is visible with expected placeholder', async ({ page }) => {
    await page.goto('/browse');
    await expect(page.getByPlaceholder('Try: react, guitar, sql...')).toBeVisible();
  });

  test('landing page shows the 100 SkillCoins signup message', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText(/Every new account starts with 100 coins./i)).toBeVisible();
  });

  test('landing page hero includes Not money text', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText(/Not money./i)).toBeVisible();
  });

  test('landing page fair coin list contains four items', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('section').nth(2).locator('li')).toHaveCount(4);
  });

  test('login sign up mode shows Create account as the primary button', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: 'Sign up' }).click();
    await expect(page.getByRole('button', { name: 'Create account' })).toHaveClass(/btn-primary/);
  });

  test('login mode toggle updates Name field visibility', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: 'Sign up' }).click();
    await expect(page.getByLabel('Name')).toBeVisible();
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByLabel('Name')).not.toBeVisible();
  });

  test('login page continues to show form fields after toggling modes', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: 'Sign up' }).click();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
  });

  test('landing page Get started button navigates to login', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Get started/i }).click();
    await expect(page).toHaveURL('/login');
  });

  test('login page has a working site logo link back to landing', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('link', { name: /SkillSwap/i }).click();
    await expect(page).toHaveURL('/');
  });

  test('login page keeps the submit button visible after toggling modes', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: 'Sign up' }).click();
    await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible();
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
  });
});
