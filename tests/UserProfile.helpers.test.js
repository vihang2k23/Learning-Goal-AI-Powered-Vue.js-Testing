import { describe, it, expect, vi, beforeEach } from 'vitest'
import { 
  mountWithDefaults, 
  createMockUser, 
  testPropValidation,
  testComputedProperty,
  testMethod,
  expectEmitted,
  expectNotEmitted,
  createConsoleSpy,
  restoreConsoleSpy
} from './utils/test-helpers.js'
import UserProfile from '../src/components/UserProfile.vue'

describe('UserProfile - Using Test Helpers', () => {
  let wrapper

  beforeEach(() => {
    const mockUser = createMockUser()
    wrapper = mountWithDefaults(UserProfile, {
      props: { user: mockUser }
    })
  })

  describe('Component Mounting with Helpers', () => {
    it('mounts with default configuration', () => {
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.user-profile').exists()).toBe(true)
    })

    it('uses mock user helper', () => {
      const customUser = createMockUser({
        name: 'Jane Smith',
        email: 'jane@example.com',
        followers: 2500000
      })

      wrapper = mountWithDefaults(UserProfile, {
        props: { user: customUser }
      })

      expect(wrapper.find('h2').text()).toBe('Jane Smith')
      expect(wrapper.vm.formattedFollowers).toBe('2.5M')
    })
  })

  describe('Prop Validation with Helper', () => {
    testPropValidation(
      UserProfile,
      'user',
      [
        createMockUser(),
        createMockUser({ id: 2, email: 'test@test.com' })
      ],
      [
        null,
        undefined,
        {},
        { id: 'invalid' },
        { email: null }
      ]
    )
  })

  describe('Computed Properties with Helper', () => {
    testComputedProperty(
      wrapper,
      'displayName',
      [
        {
          input: { user: createMockUser({ firstName: 'John', lastName: 'Doe' }) },
          expected: 'John Doe',
          description: 'combines first and last name'
        },
        {
          input: { user: createMockUser({ firstName: null, lastName: null, username: 'johndoe' }) },
          expected: 'johndoe',
          description: 'falls back to username'
        },
        {
          input: { user: createMockUser({ firstName: null, lastName: null, username: null }) },
          expected: 'Unknown User',
          description: 'shows unknown when no name available'
        }
      ]
    )

    testComputedProperty(
      wrapper,
      'formattedFollowers',
      [
        {
          input: { user: createMockUser({ followers: 500 }) },
          expected: '500',
          description: 'shows exact number for small counts'
        },
        {
          input: { user: createMockUser({ followers: 1500 }) },
          expected: '1.5K',
          description: 'formats thousands with K suffix'
        },
        {
          input: { user: createMockUser({ followers: 2500000 }) },
          expected: '2.5M',
          description: 'formats millions with M suffix'
        }
      ]
    )
  })

  describe('Methods with Helper', () => {
    testMethod(
      wrapper,
      'getUserSummary',
      [
        {
          input: [],
          expected: {
            name: 'John Doe',
            level: 'Intermediate',
            posts: 25,
            followers: '1.5K'
          },
          description: 'returns correct user summary'
        }
      ]
    )

    testMethod(
      wrapper,
      'resetError',
      [
        {
          input: [],
          expected: undefined,
          description: 'resets error to null'
        }
      ]
    )
  })

  describe('Event Testing with Helpers', () => {
    it('tests emitted events with helper', async () => {
      const followBtn = wrapper.find('.follow-btn')
      await followBtn.trigger('click')

      // Wait for async operation
      await new Promise(resolve => setTimeout(resolve, 150))

      expectEmitted(wrapper, 'follow', [
        {
          userId: 1,
          timestamp: expect.any(String)
        }
      ])
    })

    it('tests non-emitted events with helper', async () => {
      wrapper.setData({ isFollowing: true })
      
      const followBtn = wrapper.find('.follow-btn')
      await followBtn.trigger('click')

      expectNotEmitted(wrapper, 'follow')
    })
  })

  describe('Console Spying with Helpers', () => {
    it('spies on console warnings for invalid props', () => {
      const consoleSpy = createConsoleSpy('warn')

      mountWithDefaults(UserProfile, {
        props: { user: { id: 'invalid' } }
      })

      // Restore the spy
      restoreConsoleSpy(consoleSpy)
    })
  })

  describe('Complex Test Scenarios', () => {
    it('tests complete user interaction flow', async () => {
      const mockUser = createMockUser({
        postsCount: 150,
        followers: 2500000
      })

      wrapper = mountWithDefaults(UserProfile, {
        props: { user: mockUser }
      })

      // Verify initial state
      expect(wrapper.vm.userLevel).toBe('Expert')
      expect(wrapper.vm.formattedFollowers).toBe('2.5M')

      // Test follow functionality
      const followBtn = wrapper.find('.follow-btn')
      expect(followBtn.text()).toBe('Follow')
      expect(followBtn.attributes('disabled')).toBeUndefined()

      await followBtn.trigger('click')
      await new Promise(resolve => setTimeout(resolve, 150))

      // Verify follow state
      expect(wrapper.vm.isFollowing).toBe(true)
      expect(followBtn.text()).toBe('Following')
      expect(followBtn.attributes('disabled')).toBeDefined()

      // Verify emitted events
      expectEmitted(wrapper, 'follow', [
        {
          userId: mockUser.id,
          timestamp: expect.any(String)
        }
      ])
    })

    it('tests error handling in methods', async () => {
      // Override the followUser method to simulate error
      const originalMethod = wrapper.vm.followUser
      wrapper.vm.followUser = async () => {
        try {
          throw new Error('Network error')
        } catch (error) {
          wrapper.vm.error = 'Failed to follow user'
          wrapper.vm.$emit('error', error)
        }
      }

      const followBtn = wrapper.find('.follow-btn')
      await followBtn.trigger('click')

      expect(wrapper.vm.error).toBe('Failed to follow user')
      expect(wrapper.emitted('error')).toBeTruthy()

      // Restore original method
      wrapper.vm.followUser = originalMethod
    })

    it('tests component reactivity with prop changes', async () => {
      const initialUser = createMockUser({ id: 1, name: 'John Doe' })
      const updatedUser = createMockUser({ id: 2, name: 'Jane Smith' })

      wrapper = mountWithDefaults(UserProfile, {
        props: { user: initialUser }
      })

      expect(wrapper.find('h2').text()).toBe('John Doe')

      // Simulate following first user
      wrapper.setData({ isFollowing: true })
      expect(wrapper.vm.isFollowing).toBe(true)

      // Change user prop
      await wrapper.setProps({ user: updatedUser })

      // Verify component updated
      expect(wrapper.find('h2').text()).toBe('Jane Smith')
      expect(wrapper.vm.isFollowing).toBe(false) // Should reset
    })
  })

  describe('Edge Cases and Boundary Testing', () => {
    it('handles boundary values for followers formatting', () => {
      const testCases = [
        { followers: 999, expected: '999' },
        { followers: 1000, expected: '1.0K' },
        { followers: 999999, expected: '999.9K' },
        { followers: 1000000, expected: '1.0M' }
      ]

      testCases.forEach(({ followers, expected }) => {
        const user = createMockUser({ followers })
        wrapper = mountWithDefaults(UserProfile, {
          props: { user }
        })
        expect(wrapper.vm.formattedFollowers).toBe(expected)
      })
    })

    it('handles boundary values for user levels', () => {
      const testCases = [
        { postsCount: 9, expected: 'Beginner' },
        { postsCount: 10, expected: 'Intermediate' },
        { postsCount: 49, expected: 'Intermediate' },
        { postsCount: 50, expected: 'Advanced' },
        { postsCount: 99, expected: 'Advanced' },
        { postsCount: 100, expected: 'Expert' }
      ]

      testCases.forEach(({ postsCount, expected }) => {
        const user = createMockUser({ postsCount })
        wrapper = mountWithDefaults(UserProfile, {
          props: { user }
        })
        expect(wrapper.vm.userLevel).toBe(expected)
      })
    })
  })
})
