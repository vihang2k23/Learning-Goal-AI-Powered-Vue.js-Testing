# E2E testing basics

## 🎯 Learning Objectives

By the end of this module, you will:
- Set up Cypress or Playwright for E2E testing
- Write basic E2E test scenarios
- Navigate pages and interact with elements
- Assert on page content and behavior

## 🌐 E2E Testing Overview

End-to-End (E2E) testing simulates real user interactions with your application from the browser's perspective. Unlike unit tests, E2E tests verify that multiple components work together correctly.

### Why E2E Testing?
- Tests complete user workflows
- Verifies integration between components
- Catches issues that unit tests miss
- Provides confidence in application behavior

## 🛠️ Playwright vs Cypress

### Playwright (Recommended)
```javascript
// Modern, fast, and reliable
import { test, expect } from '@playwright/test'

test('basic example', async ({ page }) => {
  await page.goto('/')
  await page.click('button')
  await expect(page.locator('.result')).toBeVisible()
})
```

### Cypress (Alternative)
```javascript
// Popular and feature-rich
describe('basic example', () => {
  it('works', () => {
    cy.visit('/')
    cy.get('button').click()
    cy.get('.result').should('be.visible')
  })
})
```

## 🎭 Playwright Fundamentals

### Basic Test Structure

```javascript
import { test, expect } from '@playwright/test'

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Runs before each test
    await page.goto('/login')
  })

  test('successful login', async ({ page }) => {
    // Test implementation
  })
})
```

### Page Navigation

```javascript
test('page navigation', async ({ page }) => {
  // Navigate to URL
  await page.goto('/login')
  
  // Verify current URL
  expect(page.url()).toContain('/login')
  
  // Navigate back/forward
  await page.goBack()
  await page.goForward()
  
  // Reload page
  await page.reload()
})
```

### Element Selection

```javascript
test('element selection', async ({ page }) => {
  // By CSS selector
  const button = page.locator('button.submit')
  
  // By text content
  const heading = page.locator('text=Welcome')
  
  // By test ID (recommended)
  const input = page.locator('[data-testid="email-input"]')
  
  // By role
  const mainButton = page.locator('role=button[name="Submit"]')
  
  // Multiple selectors
  const items = page.locator('ul > li')
})
```

### User Interactions

```javascript
test('user interactions', async ({ page }) => {
  // Click elements
  await page.locator('button').click()
  
  // Double click
  await page.locator('.element').dblclick()
  
  // Right click
  await page.locator('.element').click({ button: 'right' })
  
  // Type text
  await page.locator('input').fill('Hello World')
  
  // Clear input
  await page.locator('input').clear()
  
  // Select dropdown
  await page.locator('select').selectOption('option1')
  
  // Hover over element
  await page.locator('.menu-item').hover()
  
  // Scroll
  await page.locator('.footer').scrollIntoViewIfNeeded()
})
```

### Assertions

```javascript
test('assertions', async ({ page }) => {
  // Element visibility
  await expect(page.locator('.message')).toBeVisible()
  await expect(page.locator('.loading')).toBeHidden()
  
  // Text content
  await expect(page.locator('h1')).toHaveText('Welcome')
  await expect(page.locator('.content')).toContainText('Lorem ipsum')
  
  // Attributes
  await expect(page.locator('input')).toHaveAttribute('type', 'email')
  
  // CSS classes
  await expect(page.locator('.button')).toHaveClass('btn primary')
  
  // Count of elements
  await expect(page.locator('li')).toHaveCount(5)
  
  // Page URL
  await expect(page).toHaveURL('/dashboard')
  
  // Page title
  await expect(page).toHaveTitle('Dashboard - My App')
})
```

## 🔄 Waiting and Timeouts

### Automatic Waiting
```javascript
test('automatic waiting', async ({ page }) => {
  await page.goto('/slow-page')
  
  // Playwright automatically waits for:
  // - Element to be visible
  // - Network requests to complete
  // - Page to be stable
  
  await page.locator('.loaded-content').click()
})
```

### Manual Waiting
```javascript
test('manual waiting', async ({ page }) => {
  // Wait for specific selector
  await page.waitForSelector('.dynamic-content')
  
  // Wait for specific state
  await page.waitForFunction(() => {
    return window.appLoaded === true
  })
  
  // Wait for timeout (use sparingly)
  await page.waitForTimeout(2000)
  
  // Wait for navigation
  await page.waitForURL('/dashboard')
})
```

## 📱 Responsive Testing

```javascript
import { devices, test, expect } from '@playwright/test'

const devicesToTest = [
  { ...devices['iPhone 13'], name: 'Mobile' },
  { ...devices['iPad Pro'], name: 'Tablet' },
  { ...devices['Desktop Chrome'], name: 'Desktop' }
]

devicesToTest.forEach(({ name, ...device }) => {
  test(`responsive layout on ${name}`, async ({ page }) => {
    await page.setViewportSize(device.viewport)
    await page.goto('/')
    
    // Test mobile-specific behavior
    if (name === 'Mobile') {
      await expect(page.locator('.mobile-menu')).toBeVisible()
    } else {
      await expect(page.locator('.desktop-nav')).toBeVisible()
    }
  })
})
```

## 🌐 Network Interception

### Mocking API Responses
```javascript
test('API mocking', async ({ page }) => {
  // Mock API response
  await page.route('/api/users', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' }
      ])
    })
  })
  
  await page.goto('/users')
  await expect(page.locator('.user-list')).toContainText('John Doe')
})
```

### Waiting for Network
```javascript
test('network waiting', async ({ page }) => {
  // Wait for specific request
  const responsePromise = page.waitForResponse('/api/data')
  await page.goto('/page-with-api')
  const response = await responsePromise
  
  expect(response.status()).toBe(200)
})
```

## 📸 Screenshots and Videos

### Taking Screenshots
```javascript
test('screenshots', async ({ page }) => {
  await page.goto('/')
  
  // Full page screenshot
  await page.screenshot({ path: 'full-page.png' })
  
  // Element screenshot
  await page.locator('.header').screenshot({ path: 'header.png' })
  
  // On failure (automatic with config)
  await expect(page.locator('.important')).toBeVisible()
})
```

### Recording Videos
```javascript
// Videos are recorded automatically on failure
// Configure in playwright.config.js:
test.use({
  video: 'retain-on-failure' // or 'on', 'off'
})
```

## 🎯 Real-World Examples

### Login Flow Test
```javascript
test('complete login flow', async ({ page }) => {
  await page.goto('/login')
  
  // Fill login form
  await page.locator('[data-testid="email"]').fill('user@example.com')
  await page.locator('[data-testid="password"]').fill('password123')
  
  // Submit form
  await page.locator('[data-testid="login-button"]').click()
  
  // Wait for redirect
  await expect(page).toHaveURL('/dashboard')
  
  // Verify logged in state
  await expect(page.locator('[data-testid="user-menu"]')).toBeVisible()
  await expect(page.locator('[data-testid="welcome-message"]')).toContainText('Welcome')
})
```

### Shopping Cart Test
```javascript
test('shopping cart workflow', async ({ page }) => {
  await page.goto('/products')
  
  // Add product to cart
  await page.locator('[data-testid="product-1"]').click()
  await page.locator('[data-testid="add-to-cart"]').click()
  
  // Verify cart notification
  await expect(page.locator('[data-testid="cart-notification"]')).toBeVisible()
  
  // Go to cart
  await page.locator('[data-testid="cart-icon"]').click()
  await expect(page).toHaveURL('/cart')
  
  // Verify item in cart
  await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(1)
  
  // Checkout
  await page.locator('[data-testid="checkout-button"]').click()
  await expect(page).toHaveURL('/checkout')
})
```

### Form Validation Test
```javascript
test('form validation', async ({ page }) => {
  await page.goto('/register')
  
  // Submit empty form
  await page.locator('button[type="submit"]').click()
  
  // Check validation errors
  await expect(page.locator('[data-testid="email-error"]')).toBeVisible()
  await expect(page.locator('[data-testid="password-error"]')).toBeVisible()
  
  // Fill with invalid data
  await page.locator('[data-testid="email"]').fill('invalid-email')
  await page.locator('[data-testid="password"]').fill('123')
  
  await page.locator('button[type="submit"]').click()
  
  // Check specific error messages
  await expect(page.locator('[data-testid="email-error"]')).toContainText('Invalid email format')
  await expect(page.locator('[data-testid="password-error"]')).toContainText('Password too short')
})
```

## 🏗️ Test Organization

### Page Object Model
```javascript
// pages/LoginPage.js
export class LoginPage {
  constructor(page) {
    this.page = page
    this.emailInput = page.locator('[data-testid="email"]')
    this.passwordInput = page.locator('[data-testid="password"]')
    this.loginButton = page.locator('[data-testid="login-button"]')
  }

  async login(email, password) {
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.loginButton.click()
  }

  async goto() {
    await this.page.goto('/login')
  }
}

// tests/login.spec.js
import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'

test('login with page object', async ({ page }) => {
  const loginPage = new LoginPage(page)
  
  await loginPage.goto()
  await loginPage.login('user@example.com', 'password123')
  
  await expect(page).toHaveURL('/dashboard')
})
```

## 🚀 Best Practices

### 1. Use Data Test IDs
```html
<!-- Good -->
<button data-testid="submit-button">Submit</button>

<!-- Avoid -->
<button class="btn btn-primary submit-btn">Submit</button>
```

### 2. Write Independent Tests
```javascript
// Good - each test is independent
test('test 1', async ({ page }) => {
  await page.goto('/')
  // ... test logic
})

test('test 2', async ({ page }) => {
  await page.goto('/')
  // ... test logic
})
```

### 3. Use Meaningful Assertions
```javascript
// Good - specific assertion
await expect(page.locator('.error')).toHaveText('Email is required')

// Avoid - generic assertion
await expect(page.locator('.error')).toBeVisible()
```

### 4. Handle Asynchronous Operations
```javascript
// Good - wait for specific condition
await expect(page.locator('.loaded')).toBeVisible()

// Avoid - arbitrary timeouts
await page.waitForTimeout(3000)
```

## 🔧 Configuration

### playwright.config.js
```javascript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})
```

## 🚀 Next Steps

After mastering E2E testing:
1. Practice with the exercises
2. Learn advanced patterns (Page Objects, Fixtures)
3. Try the [assignments](../04-assignments/README.md) and the [Planner Pal sample](../planner-pal.md)
4. Combine unit and E2E tests for comprehensive coverage
