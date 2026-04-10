import { mount } from '@vue/test-utils'

/**
 * Custom mount function with common configuration
 */
export function mountWithDefaults(component, options = {}) {
  return mount(component, {
    global: {
      stubs: {
        'router-link': true,
        'router-view': true,
        'transition': true,
        'transition-group': true
      }
    },
    ...options
  })
}

/**
 * Wait for next tick and DOM updates
 */
export async function nextTick() {
  await new Promise(resolve => setTimeout(resolve, 0))
}

/**
 * Wait for a specific amount of time
 */
export async function wait(ms = 0) {
  await new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Create a mock user object
 */
export function createMockUser(overrides = {}) {
  return {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    status: 'active',
    postsCount: 25,
    followers: 1500,
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe',
    age: 30,
    birthdate: '1993-01-01',
    ...overrides
  }
}

/**
 * Create multiple mock users
 */
export function createMockUsers(count = 3, baseOverrides = {}) {
  return Array.from({ length: count }, (_, index) => 
    createMockUser({
      id: index + 1,
      name: `User ${index + 1}`,
      email: `user${index + 1}@example.com`,
      username: `user${index + 1}`,
      ...baseOverrides
    })
  )
}

/**
 * Mock fetch response
 */
export function createMockFetchResponse(data, options = {}) {
  const {
    ok = true,
    status = 200,
    statusText = 'OK'
  } = options

  return Promise.resolve({
    ok,
    status,
    statusText,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data))
  })
}

/**
 * Mock fetch error
 */
export function createMockFetchError(message = 'Network error', status = 500) {
  const error = new Error(message)
  error.status = status
  return Promise.reject(error)
}

/**
 * Setup fetch mock with multiple responses
 */
export function setupFetchMock(responses) {
  const mockFetch = vi.fn()
  
  responses.forEach((response, index) => {
    if (response instanceof Error) {
      mockFetch.mockRejectedValueOnce(response)
    } else {
      mockFetch.mockResolvedValueOnce(response)
    }
  })
  
  global.fetch = mockFetch
  return mockFetch
}

/**
 * Assert that an element exists and has specific text
 */
export function expectElementWithText(wrapper, selector, text) {
  const element = wrapper.find(selector)
  expect(element.exists()).toBe(true)
  expect(element.text()).toContain(text)
  return element
}

/**
 * Assert that an element does not exist
 */
export function expectElementNotExists(wrapper, selector) {
  expect(wrapper.find(selector).exists()).toBe(false)
}

/**
 * Assert that a component emitted a specific event
 */
export function expectEmitted(wrapper, eventName, expectedPayload) {
  expect(wrapper.emitted(eventName)).toBeTruthy()
  if (expectedPayload !== undefined) {
    expect(wrapper.emitted(eventName)[0]).toEqual(expectedPayload)
  }
}

/**
 * Assert that a component did not emit an event
 */
export function expectNotEmitted(wrapper, eventName) {
  expect(wrapper.emitted(eventName)).toBeFalsy()
}

/**
 * Fill form fields with data
 */
export async function fillForm(wrapper, formData) {
  for (const [field, value] of Object.entries(formData)) {
    const input = wrapper.find(`[data-testid="${field}"]`) || 
                  wrapper.find(`#${field}`) || 
                  wrapper.find(`[name="${field}"]`)
    
    if (input.exists()) {
      await input.setValue(value)
    }
  }
}

/**
 * Trigger form submission
 */
export async function submitForm(wrapper) {
  const form = wrapper.find('form')
  if (form.exists()) {
    await form.trigger('submit')
  }
}

/**
 * Test component prop validation
 */
export function testPropValidation(component, propName, validValues, invalidValues) {
  describe(`prop validation for ${propName}`, () => {
    validValues.forEach(value => {
      it(`accepts valid value: ${JSON.stringify(value)}`, () => {
        expect(() => {
          mount(component, {
            props: { [propName]: value }
          })
        }).not.toThrow()
      })
    })

    invalidValues.forEach(value => {
      it(`handles invalid value: ${JSON.stringify(value)}`, () => {
        const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
        
        expect(() => {
          mount(component, {
            props: { [propName]: value }
          })
        }).not.toThrow() // Vue doesn't throw, just warns
        
        consoleSpy.mockRestore()
      })
    })
  })
}

/**
 * Test computed property
 */
/** @param {() => import('@vue/test-utils').VueWrapper} getWrapper - called inside each test (after beforeEach mounts). */
export function testComputedProperty(getWrapper, propertyName, testCases) {
  describe(`computed property: ${propertyName}`, () => {
    testCases.forEach(({ input, expected, description }) => {
      it(`${description || `returns ${expected} for ${JSON.stringify(input)}`}`, async () => {
        const wrapper = getWrapper()
        if (input?.user !== undefined) {
          await wrapper.setProps({ user: input.user })
        } else if (input && Object.keys(input).length > 0) {
          await wrapper.setData(input)
        }
        expect(wrapper.vm[propertyName]).toBe(expected)
      })
    })
  })
}

/**
 * Test method with different inputs
 */
/** @param {() => import('@vue/test-utils').VueWrapper} getWrapper */
export function testMethod(getWrapper, methodName, testCases) {
  describe(`method: ${methodName}`, () => {
    testCases.forEach(({ input, expected, description, shouldThrow }) => {
      it(`${description || `returns ${expected} for ${JSON.stringify(input)}`}`, async () => {
        const wrapper = getWrapper()
        const method = wrapper.vm[methodName]
        const args = Array.isArray(input) ? input : input !== undefined ? [input] : []
        if (shouldThrow) {
          await expect(method.apply(wrapper.vm, args)).rejects.toThrow()
        } else {
          const result = method.apply(wrapper.vm, args)
          const resolved = result && typeof result.then === 'function' ? await result : result
          expect(resolved).toEqual(expected)
        }
      })
    })
  })
}

/**
 * Create a spy for console methods
 */
export function createConsoleSpy(method = 'warn') {
  return vi.spyOn(console, method).mockImplementation(() => {})
}

/**
 * Restore console spy
 */
export function restoreConsoleSpy(spy) {
  spy.mockRestore()
}

/**
 * Test component accessibility
 */
export function testAccessibility(wrapper) {
  describe('accessibility', () => {
    it('has proper ARIA labels', () => {
      const interactiveElements = wrapper.findAll('button, input, select, textarea')
      interactiveElements.forEach(element => {
        const hasLabel = element.attributes('aria-label') || 
                        element.attributes('aria-labelledby') ||
                        wrapper.find(`label[for="${element.attributes('id')}"]`).exists()
        
        if (element.element.tagName === 'INPUT' && element.attributes('type') !== 'hidden') {
          expect(hasLabel).toBe(true)
        }
      })
    })

    it('has proper heading hierarchy', () => {
      const headings = wrapper.findAll('h1, h2, h3, h4, h5, h6')
      if (headings.length > 0) {
        // Check that headings are not skipped (e.g., h1 followed by h3)
        for (let i = 1; i < headings.length; i++) {
          const currentLevel = parseInt(headings[i].element.tagName[1])
          const previousLevel = parseInt(headings[i - 1].element.tagName[1])
          expect(currentLevel - previousLevel).toBeLessThanOrEqual(1)
        }
      }
    })
  })
}

/**
 * Test responsive design
 */
export async function testResponsiveDesign(wrapper, breakpoints) {
  describe('responsive design', () => {
    breakpoints.forEach(({ width, height, expectedBehavior }) => {
      it(`behaves correctly at ${width}x${height}`, async () => {
        // This would typically be used with Playwright or similar
        // For Vue Test Utils, we can test CSS classes or computed properties
        if (expectedBehavior.classes) {
          expectedBehavior.classes.forEach(className => {
            expect(wrapper.classes()).toContain(className)
          })
        }
        
        if (expectedBehavior.computed) {
          for (const [prop, value] of Object.entries(expectedBehavior.computed)) {
            expect(wrapper.vm[prop]).toBe(value)
          }
        }
      })
    })
  })
}
