# Testing setup

## 🎯 Learning Objectives

By the end of this module, you will:
- Install and configure Vue Test Utils
- Set up Vitest as your test runner
- Configure testing environment and plugins
- Install Cypress or Playwright for E2E testing

## 📦 Required Dependencies

### Component Testing Dependencies
```bash
npm install --save-dev @vue/test-utils vitest jsdom @vitest/ui
```

### E2E Testing Dependencies
```bash
# For Playwright
npm install --save-dev @playwright/test

# For Cypress (alternative)
npm install --save-dev cypress
```

### Vue and Build Tools
```bash
npm install --save-dev vue @vitejs/plugin-vue vite
```

## ⚙️ Configuration Files

### 1. Vite + Vitest (`vite.config.js`)

This repository uses **one** config file for Vite and Vitest (`defineConfig` from `vitest/config`). That keeps aliases, plugins, and `server.port` in sync with Playwright’s `baseURL`.

Minimal shape:

```javascript
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { '@': resolve(__dirname, './src') },
  },
  server: { port: 3000 },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.js'],
  },
})
```

See the repo root `vite.config.js` for coverage and the Planner Pal dev API mock.

### 2. Test Setup (`tests/setup.js`)
```javascript
import { config } from '@vue/test-utils'
import { vi } from 'vitest'

// Global test configuration
config.global.stubs = {
  // Stub out components
  'router-link': true,
  'router-view': true
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
```

### 3. Playwright Configuration (`playwright.config.js`)
```javascript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
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
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

## 📋 Package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug"
  }
}
```

## 🗂️ Project Structure

```
your-project/
├── src/
│   ├── components/
│   ├── views/
│   └── main.js
├── tests/
│   ├── setup.js
│   └── components/
├── e2e/
│   └── *.spec.js
├── vite.config.js
├── playwright.config.js
└── package.json
```

## ✅ Verification Steps

### 1. Test Vitest Installation
```bash
npm run test
```

### 2. Test Playwright Installation
```bash
npx playwright install
npm run test:e2e
```

### 3. Create a Sample Test
Create `tests/sample.test.js`:
```javascript
import { describe, it, expect } from 'vitest'

describe('Sample Test', () => {
  it('should pass', () => {
    expect(1 + 1).toBe(2)
  })
})
```

Run it: `npm run test:run`

## 🚀 Next Steps

Once setup is complete:
1. Read **[Unit testing](../02-unit-testing/README.md)**
2. Read **[E2E testing](../03-e2e-testing/README.md)**
3. Try files under **`examples/`** at the repo root

## 🔧 Common Issues & Solutions

### Issue: Vitest not found
**Solution**: Use `npx vitest` or ensure dependencies are installed

### Issue: Playwright browsers not installed
**Solution**: Run `npx playwright install`

### Issue: Import path resolution
**Solution**: Check `vite.config.js` alias and `test` options

## 📚 Additional Resources

- [Vue Test Utils Documentation](https://test-utils.vuejs.org/)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
