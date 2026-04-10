

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import UserProfile from '../src/components/UserProfile.vue'

describe('UserProfile - Component Props and Validation', () => {
  const mockUser = {
    id: 1,
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe',
    status: 'active',
    postsCount: 25,
    followers: 1500
  }

  it('renders with required props', () => {
    const wrapper = mount(UserProfile, {
      props: { user: mockUser }
    })
    
    expect(wrapper.find('.user-profile').exists()).toBe(true)
    expect(wrapper.find('h2').text()).toBe('John Doe')
    expect(wrapper.find('.email').text()).toBe('test@example.com')
  })

  it('validates user prop structure', () => {
    const wrapper1 = mount(UserProfile, {
      props: { user: { id: 'invalid' } },
    })
    expect(wrapper1.find('.user-profile').exists()).toBe(true)

    const wrapper2 = mount(UserProfile, {
      props: { user: null },
    })
    expect(wrapper2.find('[data-testid="missing-user"]').exists()).toBe(true)
    expect(wrapper2.text()).toContain('No user data')
  })

  it('handles missing user gracefully', () => {
    const wrapper = mount(UserProfile, {
      props: { user: { id: 1, email: 'test@test.com', firstName: null, lastName: null, username: null } }
    })
    
    expect(wrapper.find('h2').text()).toBe('Unknown User')
  })

  it('respects showEmail prop', () => {
    const wrapper = mount(UserProfile, {
      props: { 
        user: mockUser,
        showEmail: true
      }
    })
    
    expect(wrapper.find('.email').exists()).toBe(true)
  })

  it('shows email by default', () => {
    const wrapper = mount(UserProfile, {
      props: { user: mockUser }
    })
    
    expect(wrapper.find('.email').exists()).toBe(true)
  })

  it('displays username when name is missing', () => {
    const userWithoutName = {
      ...mockUser,
      firstName: null,
      lastName: null
    }
    
    const wrapper = mount(UserProfile, {
      props: { user: userWithoutName }
    })
    
    expect(wrapper.find('h2').text()).toBe('johndoe')
  })
})

describe('UserProfile - Computed Properties', () => {
  const mockUser = {
    id: 1,
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    status: 'active',
    postsCount: 25,
    followers: 1500
  }

  it('computes display name correctly', () => {
    const wrapper = mount(UserProfile, {
      props: { user: mockUser }
    })
    
    expect(wrapper.vm.displayName).toBe('John Doe')
  })

  it('computes status text correctly', () => {
    const statuses = [
      { status: 'active', expected: 'Active' },
      { status: 'inactive', expected: 'Inactive' },
      { status: 'pending', expected: 'Pending Verification' }
    ]
    
    statuses.forEach(({ status, expected }) => {
      const wrapper = mount(UserProfile, {
        props: { user: { ...mockUser, status } }
      })
      
      expect(wrapper.vm.statusText).toBe(expected)
    })
  })

  it('computes status class correctly', () => {
    const wrapper = mount(UserProfile, {
      props: { user: mockUser }
    })
    
    expect(wrapper.vm.statusClass).toBe('status-active')
    expect(wrapper.find('.status').classes()).toContain('status-active')
  })

  it('formats followers count correctly', () => {
    const testCases = [
      { followers: 500, expected: '500' },
      { followers: 1500, expected: '1.5K' },
      { followers: 2500000, expected: '2.5M' }
    ]
    
    testCases.forEach(({ followers, expected }) => {
      const wrapper = mount(UserProfile, {
        props: { user: { ...mockUser, followers } }
      })
      
      expect(wrapper.vm.formattedFollowers).toBe(expected)
      expect(wrapper.find('.stat:last-child .value').text()).toBe(expected)
    })
  })

  it('computes user level based on posts count', () => {
    const testCases = [
      { postsCount: 5, expected: 'Beginner' },
      { postsCount: 15, expected: 'Intermediate' },
      { postsCount: 75, expected: 'Advanced' },
      { postsCount: 150, expected: 'Expert' }
    ]
    
    testCases.forEach(({ postsCount, expected }) => {
      const wrapper = mount(UserProfile, {
        props: { user: { ...mockUser, postsCount } }
      })
      
      expect(wrapper.vm.userLevel).toBe(expected)
    })
  })
})

describe('UserProfile - Methods', () => {
  const mockUser = {
    id: 1,
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    status: 'active',
    postsCount: 25,
    followers: 1500
  }

  it('getUserSummary returns correct data', () => {
    const wrapper = mount(UserProfile, {
      props: { user: mockUser }
    })
    
    const summary = wrapper.vm.getUserSummary()
    expect(summary).toEqual({
      name: 'John Doe',
      level: 'Intermediate',
      posts: 25,
      followers: '1.5K'
    })
  })

  it('resetError clears error state', async () => {
    const wrapper = mount(UserProfile, {
      props: { user: mockUser }
    })
    
    wrapper.setData({ error: 'Some error' })
    expect(wrapper.vm.error).toBe('Some error')
    
    wrapper.vm.resetError()
    expect(wrapper.vm.error).toBe(null)
  })

  it('watch user.id resets following state', async () => {
    const wrapper = mount(UserProfile, {
      props: { user: mockUser }
    })
    
    wrapper.setData({ isFollowing: true, error: 'Some error' })
    
    await wrapper.setProps({ 
      user: { ...mockUser, id: 2 } 
    })
    
    expect(wrapper.vm.isFollowing).toBe(false)
    expect(wrapper.vm.error).toBe(null)
  })
})

describe('UserProfile - Emitted Events', () => {
  const mockUser = {
    id: 1,
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    status: 'active',
    postsCount: 25,
    followers: 1500
  }

  it('emits follow event when follow button is clicked', async () => {
    const wrapper = mount(UserProfile, {
      props: { user: mockUser }
    })
    
    const followBtn = wrapper.find('.follow-btn')
    await followBtn.trigger('click')
    
    // Wait for the async operation
    await new Promise(resolve => setTimeout(resolve, 150))
    
    expect(wrapper.emitted('follow')).toBeTruthy()
    expect(wrapper.emitted('follow')[0][0]).toEqual({
      userId: 1,
      timestamp: expect.any(String)
    })
  })

  it('does not emit follow event when already following', async () => {
    const wrapper = mount(UserProfile, {
      props: { user: mockUser }
    })
    
    wrapper.setData({ isFollowing: true })
    
    const followBtn = wrapper.find('.follow-btn')
    await followBtn.trigger('click')
    
    expect(wrapper.emitted('follow')).toBeFalsy()
  })

  it('emits error event when follow fails', async () => {
    // Mock the followUser method to throw an error
    const wrapper = mount(UserProfile, {
      props: { user: mockUser }
    })
    
    // Override the method to simulate error
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
    
    expect(wrapper.emitted('error')).toBeTruthy()
    expect(wrapper.vm.error).toBe('Failed to follow user')
  })
})
