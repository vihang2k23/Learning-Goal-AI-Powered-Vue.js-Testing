# 🌐 E2E Testing Exercises

## Exercise 1: Basic Navigation and Interaction

### 📋 Task: Test a Simple Todo App

**Application Features:**
- Add new todos
- Mark todos as complete
- Delete todos
- Filter todos (all, active, completed)

**Requirements:**
- [ ] Navigate to the todo app
- [ ] Add a new todo item
- [ ] Mark todo as complete
- [ ] Delete a todo
- [ ] Test filtering functionality
- [ ] Verify todo count updates

**Test File:** `exercises/todo-app.spec.js`

**Sample Structure:**
```javascript
import { test, expect } from '@playwright/test'

test.describe('Todo App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/todos')
  })

  test('adds new todo', async ({ page }) => {
    // Your implementation
  })

  test('completes todo', async ({ page }) => {
    // Your implementation
  })

  test('deletes todo', async ({ page }) => {
    // Your implementation
  })

  test('filters todos', async ({ page }) => {
    // Your implementation
  })
})
```

---

## Exercise 2: Form Testing

### 📋 Task: Test a Registration Form

**Form Fields:**
- Name (required, min 2 characters)
- Email (required, valid email format)
- Password (required, min 8 characters)
- Confirm Password (required, must match password)
- Terms Checkbox (required)

**Requirements:**
- [ ] Test form validation for all fields
- [ ] Test successful form submission
- [ ] Test password confirmation matching
- [ ] Test terms checkbox requirement
- [ ] Test error message display
- [ ] Test form reset functionality

**Test File:** `exercises/registration-form.spec.js`

**Validation Rules to Test:**
```javascript
const validationRules = {
  name: {
    required: 'Name is required',
    minLength: 'Name must be at least 2 characters'
  },
  email: {
    required: 'Email is required',
    format: 'Please enter a valid email'
  },
  password: {
    required: 'Password is required',
    minLength: 'Password must be at least 8 characters'
  },
  confirmPassword: {
    required: 'Please confirm your password',
    match: 'Passwords do not match'
  },
  terms: {
    required: 'You must accept the terms'
  }
}
```

---

## Exercise 3: E-commerce Workflow

### 📋 Task: Test Complete Shopping Journey

**User Flow:**
1. Browse products
2. Search for specific product
3. Add product to cart
4. View cart
5. Update quantity
6. Proceed to checkout
7. Fill shipping information
8. Complete purchase

**Requirements:**
- [ ] Browse product categories
- [ ] Search functionality
- [ ] Add products to cart
- [ ] Update cart quantities
- [ ] Remove items from cart
- [ ] Fill checkout form
- [ ] Apply discount code
- [ ] Complete purchase
- [ ] Verify order confirmation

**Test File:** `exercises/ecommerce-flow.spec.js`

**Sample Test Structure:**
```javascript
test.describe('E-commerce Flow', () => {
  test('complete purchase workflow', async ({ page }) => {
    // 1. Browse products
    await page.goto('/products')
    
    // 2. Search for product
    // 3. Add to cart
    // 4. View cart
    // 5. Checkout
    // 6. Complete purchase
  })

  test('cart management', async ({ page }) => {
    // Test cart operations
  })

  test('checkout validation', async ({ page }) => {
    // Test checkout form validation
  })
})
```

---

## Exercise 4: Authentication Flow

### 📋 Task: Test User Authentication

**Authentication Features:**
- Login with email/password
- Registration
- Password reset
- Logout
- Protected routes
- Remember me functionality

**Requirements:**
- [ ] Test successful login
- [ ] Test invalid credentials
- [ ] Test password reset flow
- [ ] Test registration
- [ ] Test logout functionality
- [ ] Test protected route access
- [ ] Test remember me feature
- [ ] Test session timeout

**Test File:** `exercises/auth-flow.spec.js`

**Test Scenarios:**
```javascript
test.describe('Authentication', () => {
  test('successful login redirects to dashboard', async ({ page }) => {
    // Implementation
  })

  test('shows error for invalid credentials', async ({ page }) => {
    // Implementation
  })

  test('password reset flow', async ({ page }) => {
    // Implementation
  })

  test('registration creates new account', async ({ page }) => {
    // Implementation
  })

  test('logout clears session', async ({ page }) => {
    // Implementation
  })

  test('protected routes redirect to login', async ({ page }) => {
    // Implementation
  })
})
```

---

## Exercise 5: Responsive Design Testing

### 📋 Task: Test Cross-Device Compatibility

**Devices to Test:**
- Mobile (iPhone 13)
- Tablet (iPad Pro)
- Desktop (Chrome, Firefox, Safari)

**Requirements:**
- [ ] Test navigation on mobile
- [ ] Test touch interactions
- [ ] Test layout breakpoints
- [ ] Test form inputs on different devices
- [ ] Test modal/dialog behavior
- [ ] Test image responsiveness

**Test File:** `exercises/responsive-design.spec.js`

**Device Configuration:**
```javascript
import { devices, test, expect } from '@playwright/test'

const deviceTests = [
  { ...devices['iPhone 13'], name: 'Mobile' },
  { ...devices['iPad Pro'], name: 'Tablet' },
  { ...devices['Desktop Chrome'], name: 'Desktop' }
]

deviceTests.forEach(({ name, ...device }) => {
  test(`responsive behavior on ${name}`, async ({ page }) => {
    await page.setViewportSize(device.viewport)
    // Test responsive behavior
  })
})
```

---

## Exercise 6: API Integration Testing

### 📋 Task: Test Application with Real API

**API Endpoints:**
- GET /api/users - Get user list
- POST /api/users - Create user
- PUT /api/users/:id - Update user
- DELETE /api/users/:id - Delete user

**Requirements:**
- [ ] Test data loading
- [ ] Test API error handling
- [ ] Test loading states
- [ ] Test network failures
- [ ] Test retry mechanisms
- [ ] Test data validation

**Test File:** `exercises/api-integration.spec.js`

**Network Mocking:**
```javascript
test.describe('API Integration', () => {
  test('handles successful API responses', async ({ page }) => {
    await page.route('/api/users', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ id: 1, name: 'John' }])
      })
    })
    
    await page.goto('/users')
    await expect(page.locator('.user-list')).toContainText('John')
  })

  test('handles API errors', async ({ page }) => {
    await page.route('/api/users', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Server error' })
      })
    })
    
    await page.goto('/users')
    await expect(page.locator('.error-message')).toBeVisible()
  })
})
```

---

## 🎯 Running Exercises

### Setup
```bash
# Install browsers
npx playwright install

# Run all exercises
npm run test:e2e

# Run specific exercise
npm run test:e2e exercises/todo-app.spec.js

# Run with UI
npm run test:e2e:ui

# Debug mode
npm run test:e2e:debug
```

### Test Organization
```
e2e/
├── exercises/
│   ├── todo-app.spec.js
│   ├── registration-form.spec.js
│   ├── ecommerce-flow.spec.js
│   ├── auth-flow.spec.js
│   ├── responsive-design.spec.js
│   └── api-integration.spec.js
├── pages/
│   ├── BasePage.js
│   ├── LoginPage.js
│   └── ProductPage.js
└── fixtures/
    └── test-data.js
```

### Success Criteria
- All tests pass consistently
- Tests cover all major user flows
- Tests are reliable and not flaky
- Tests run efficiently
- Proper error handling is tested
- Cross-browser compatibility is verified

## 🏆 Advanced Challenge

Create a comprehensive E2E test suite for a complex application that includes:
- Multiple user roles (admin, user, guest)
- Real-time features (chat, notifications)
- File upload/download
- WebSocket connections
- Third-party integrations
- Performance monitoring

This will prepare you for enterprise-level E2E testing!
