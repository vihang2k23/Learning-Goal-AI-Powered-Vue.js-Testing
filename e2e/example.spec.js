import { test, expect } from '@playwright/test';

test('homepage has correct title', async ({ page }) => {
  await page.goto('/');
  
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Vue App/);
});

test('HelloWorld component renders and works', async ({ page }) => {
  await page.goto('/');
  
  // Check if the component is rendered
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('button')).toBeVisible();
  
  // Check initial state
  await expect(page.locator('button')).toContainText('Count: 0');
  
  // Click the button and check if count increments
  await page.locator('button').click();
  await expect(page.locator('button')).toContainText('Count: 1');
  
  // Click multiple times
  for (let i = 0; i < 5; i++) {
    await page.locator('button').click();
  }
  
  // Check if encouragement message appears
  await expect(page.locator('p')).toContainText('Great job!');
});

test('responsive design works on mobile', async ({ page }) => {
  // Set mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');
  
  // Check if component is still visible and functional on mobile
  await expect(page.locator('.hello')).toBeVisible();
  await expect(page.locator('button')).toBeVisible();
  
  // Test interaction on mobile
  await page.locator('button').tap();
  await expect(page.locator('button')).toContainText('Count: 1');
});
