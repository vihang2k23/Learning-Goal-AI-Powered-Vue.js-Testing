# 🛠️ Setup Exercise

## Exercise: Configure Your Testing Environment

### 📋 Task Checklist

- [ ] Install all required dependencies
- [ ] Create or extend `vite.config.js` (Vite + Vitest — see module README)
- [ ] Create tests/setup.js
- [ ] Create playwright.config.js
- [ ] Update package.json scripts
- [ ] Verify installation with sample tests

### 🎯 Step-by-Step Instructions

#### Step 1: Install Dependencies
```bash
# Component testing
npm install --save-dev @vue/test-utils vitest jsdom @vitest/ui

# E2E testing
npm install --save-dev @playwright/test

# Vue and build tools
npm install --save-dev vue @vitejs/plugin-vue vite
```

#### Step 2: Create Configuration Files

Create or verify `vite.config.js` with the Vitest `test` block from README.md

Create `tests/setup.js` with the content from README.md

Create `playwright.config.js` with the content from README.md

#### Step 3: Update Package.json
Add the test scripts to your package.json

#### Step 4: Create Test Structure
```bash
mkdir -p tests/components
mkdir -p e2e
```

#### Step 5: Verify Installation
Create `tests/verification.test.js`:
```javascript
import { describe, it, expect } from 'vitest'

describe('Environment Verification', () => {
  it('vitest is working', () => {
    expect(true).toBe(true)
  })
  
  it('can import Vue Test Utils', async () => {
    const { mount } = await import('@vue/test-utils')
    expect(typeof mount).toBe('function')
  })
})
```

Run the verification:
```bash
npm run test:run
```

### ✅ Success Criteria

You're done when:
- All dependencies install without errors
- `npm run test:run` passes
- `npx playwright install` completes successfully
- Sample test files run without issues

### 🆘 Troubleshooting

If you encounter issues:
1. Check Node.js version (requires v18+)
2. Clear node_modules and reinstall
3. Verify file paths in configuration
4. Check for conflicting dependencies

## 🎉 Completion

Once complete, continue with **[Unit testing](../02-unit-testing/README.md)**.
