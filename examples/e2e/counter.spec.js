import { test, expect } from '@playwright/test'

test.describe('Counter E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('displays initial count', async ({ page }) => {
    await expect(page.locator('h2')).toContainText('Count: 5')
  })

  test('increments count when increment button is clicked', async ({ page }) => {
    const incrementButton = page.locator('button').first()
    
    await incrementButton.click()
    await expect(page.locator('h2')).toContainText('Count: 6')
    
    await incrementButton.click()
    await expect(page.locator('h2')).toContainText('Count: 7')
  })

  test('decrements count when decrement button is clicked', async ({ page }) => {
    const decrementButton = page.locator('button').nth(1)
    
    await decrementButton.click()
    await expect(page.locator('h2')).toContainText('Count: 4')
    
    await decrementButton.click()
    await expect(page.locator('h2')).toContainText('Count: 3')
  })

  test('resets count to initial value', async ({ page }) => {
    const incrementButton = page.locator('button').first()
    const resetButton = page.locator('button').nth(2)
    
    // Change count first
    await incrementButton.click()
    await expect(page.locator('h2')).toContainText('Count: 6')
    
    // Reset
    await resetButton.click()
    await expect(page.locator('h2')).toContainText('Count: 5')
  })

  test('shows maximum reached message', async ({ page }) => {
    const incrementButton = page.locator('button').first()
    
    // Click increment until max is reached
    for (let i = 0; i < 5; i++) {
      await incrementButton.click()
    }
    
    await expect(page.locator('.message')).toBeVisible()
    await expect(page.locator('.message')).toContainText('Maximum reached!')
    await expect(incrementButton).toBeDisabled()
  })

  test('shows minimum reached message', async ({ page }) => {
    const decrementButton = page.locator('button').nth(1)
    
    // Click decrement until min is reached
    for (let i = 0; i < 5; i++) {
      await decrementButton.click()
    }
    
    await expect(page.locator('.message')).toBeVisible()
    await expect(page.locator('.message')).toContainText('Minimum reached!')
    await expect(decrementButton).toBeDisabled()
  })

  test('buttons are enabled when within range', async ({ page }) => {
    const incrementButton = page.locator('button').first()
    const decrementButton = page.locator('button').nth(1)
    
    await expect(incrementButton).toBeEnabled()
    await expect(decrementButton).toBeEnabled()
  })

  test('counter has proper styling and layout', async ({ page }) => {
    const counter = page.locator('.counter')
    await expect(counter).toBeVisible()
    await expect(counter).toHaveCSS('text-align', 'center')
    
    const controls = page.locator('.controls')
    await expect(controls).toBeVisible()
    
    const buttons = page.locator('button')
    await expect(buttons).toHaveCount(3)
  })

  test('rapid button clicks work correctly', async ({ page }) => {
    const incrementButton = page.locator('button').first()
    
    // Rapid clicks
    await incrementButton.click()
    await incrementButton.click()
    await incrementButton.click()
    
    await expect(page.locator('h2')).toContainText('Count: 8')
  })

  test('keyboard navigation works', async ({ page }) => {
    const incrementButton = page.locator('button').first()
    
    // Tab to first button
    await page.keyboard.press('Tab')
    await expect(incrementButton).toBeFocused()
    
    // Activate with Enter
    await page.keyboard.press('Enter')
    await expect(page.locator('h2')).toContainText('Count: 6')
    
    // Tab to next button
    await page.keyboard.press('Tab')
    const decrementButton = page.locator('button').nth(1)
    await expect(decrementButton).toBeFocused()
    
    // Activate with Space
    await page.keyboard.press('Space')
    await expect(page.locator('h2')).toContainText('Count: 5')
  })
})
