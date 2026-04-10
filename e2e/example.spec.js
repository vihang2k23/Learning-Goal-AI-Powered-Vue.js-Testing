import { test, expect } from '@playwright/test';

test('homepage has correct title', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Vue Testing Fundamentals/);
});

test('HelloWorld component renders and works', async ({ page }) => {
  await page.goto('/');

  const hello = page.locator('.hello');
  const countBtn = hello.getByRole('button', { name: /Count:/ });

  await expect(hello.locator('h1')).toBeVisible();
  await expect(countBtn).toBeVisible();
  await expect(countBtn).toContainText('Count: 0');

  await countBtn.click();
  await expect(countBtn).toContainText('Count: 1');

  for (let i = 0; i < 5; i++) {
    await countBtn.click();
  }

  await expect(hello.locator('p')).toContainText('Great job!');
});

test('responsive design works on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');

  const hello = page.locator('.hello');
  const countBtn = hello.getByRole('button', { name: /Count:/ });

  await expect(hello).toBeVisible();
  await expect(countBtn).toBeVisible();

  await countBtn.click();
  await expect(countBtn).toContainText('Count: 1');
});
