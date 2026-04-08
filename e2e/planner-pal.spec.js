import { test, expect } from '@playwright/test'

const baseProfile = {
  id: 1,
  name: 'Alex Planner',
  email: 'alex@example.com',
  avatar: 'https://example.com/avatar.png',
  bio: 'Organizing my week with Planner Pal.',
  created_at: '2024-01-15T10:00:00.000Z',
}

/**
 * Mock profile API so parallel browsers do not share Vite middleware state.
 */
async function mockProfileApi(page, handlers = {}) {
  await page.route('**/api/planner-profile/**', async (route) => {
    const method = route.request().method()
    if (method === 'GET' && handlers.onGet) {
      return handlers.onGet(route)
    }
    if (method === 'PUT' && handlers.onPut) {
      return handlers.onPut(route)
    }
    if (method === 'GET') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(baseProfile),
      })
    }
    if (method === 'PUT') {
      let data = {}
      try {
        data = route.request().postDataJSON()
      } catch {
        /* empty */
      }
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ...baseProfile, ...data }),
      })
    }
    return route.continue()
  })
}

async function openPlannerPal(page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await expect(page.getByTestId('nav-planner-pal')).toBeVisible()
  await page.getByTestId('nav-planner-pal').click()
}

test.describe('Planner Pal', () => {
  test('view profile flow', async ({ page }) => {
    await mockProfileApi(page)
    await openPlannerPal(page)
    await expect(page.getByTestId('view-mode')).toBeVisible({ timeout: 15_000 })
    await expect(page.getByTestId('display-name')).toContainText('Alex')
    await expect(page.getByTestId('display-email')).toContainText('alex@')
  })

  test('edit and save profile flow', async ({ page }) => {
    await mockProfileApi(page)
    await openPlannerPal(page)
    await expect(page.getByTestId('view-mode')).toBeVisible({ timeout: 15_000 })
    await page.getByTestId('edit-toggle').click()
    await expect(page.getByTestId('edit-mode')).toBeVisible()
    await page.getByTestId('field-name').fill('Jamie Planner')
    await page.getByTestId('field-email').fill('jamie@example.com')
    await page.getByTestId('field-bio').fill('Saved via E2E')
    await page.getByTestId('save-btn').click()
    await expect(page.getByTestId('view-mode')).toBeVisible()
    await expect(page.getByTestId('display-name')).toHaveText('Jamie Planner')
    await expect(page.getByTestId('display-bio')).toHaveText('Saved via E2E')
  })

  test('validation: empty name shows error', async ({ page }) => {
    await mockProfileApi(page)
    await openPlannerPal(page)
    await expect(page.getByTestId('view-mode')).toBeVisible({ timeout: 15_000 })
    await page.getByTestId('edit-toggle').click()
    await page.getByTestId('field-name').fill('')
    await page.getByTestId('save-btn').click()
    await expect(page.getByTestId('name-error')).toBeVisible()
  })

  test('API error on load', async ({ page }) => {
    await mockProfileApi(page, {
      onGet: (route) => route.fulfill({ status: 500, body: '{}' }),
    })
    await openPlannerPal(page)
    await expect(page.getByTestId('load-error')).toBeVisible({ timeout: 15_000 })
  })

  test('API error on save', async ({ page }) => {
    await mockProfileApi(page, {
      onPut: (route) => route.fulfill({ status: 502, body: '{}' }),
    })
    await openPlannerPal(page)
    await expect(page.getByTestId('view-mode')).toBeVisible({ timeout: 15_000 })
    await page.getByTestId('edit-toggle').click()
    await page.getByTestId('save-btn').click()
    await expect(page.getByTestId('save-error')).toBeVisible({ timeout: 10_000 })
  })

  test('narrow viewport still shows planner', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await mockProfileApi(page)
    await openPlannerPal(page)
    await expect(page.getByTestId('view-mode')).toBeVisible({ timeout: 15_000 })
    await expect(page.getByTestId('display-name')).toBeVisible()
  })
})
