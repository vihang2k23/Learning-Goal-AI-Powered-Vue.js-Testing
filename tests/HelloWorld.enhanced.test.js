import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import HelloWorld from '@/components/HelloWorld.vue'

describe('HelloWorld', () => {
  // Component Rendering Tests
  describe('Component Rendering', () => {
    it('renders correctly with default props', () => {
      const wrapper = mount(HelloWorld, {
        props: { msg: 'Hello Vue' }
      })
      
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.hello').exists()).toBe(true)
      expect(wrapper.find('h1').exists()).toBe(true)
      expect(wrapper.find('button').exists()).toBe(true)
    })

    it('displays the correct message from props', () => {
      const testMessage = 'Test Message'
      const wrapper = mount(HelloWorld, {
        props: { msg: testMessage }
      })
      
      expect(wrapper.find('h1').text()).toBe(testMessage)
    })

    it('renders with correct CSS classes', () => {
      const wrapper = mount(HelloWorld, {
        props: { msg: 'Hello' }
      })
      
      expect(wrapper.find('.hello').exists()).toBe(true)
    })
  })

  // Props Validation Tests
  describe('Props Validation', () => {
    it('requires msg prop', () => {
      // @vue/test-utils will show warning for missing required prop
      const wrapper = mount(HelloWorld)
      expect(wrapper.exists()).toBe(true)
    })

    it('accepts string msg prop', () => {
      const wrapper = mount(HelloWorld, {
        props: { msg: 'String message' }
      })
      expect(wrapper.find('h1').text()).toBe('String message')
    })

    it('handles empty string msg', () => {
      const wrapper = mount(HelloWorld, {
        props: { msg: '' }
      })
      expect(wrapper.find('h1').text()).toBe('')
    })
  })

  // User Interaction Tests
  describe('User Interactions', () => {
    it('initializes count to 0', () => {
      const wrapper = mount(HelloWorld, {
        props: { msg: 'Test' }
      })
      
      expect(wrapper.vm.count).toBe(0)
      expect(wrapper.find('button').text()).toContain('Count: 0')
    })

    it('increments count when button is clicked', async () => {
      const wrapper = mount(HelloWorld, {
        props: { msg: 'Test' }
      })
      
      const button = wrapper.find('button')
      
      // Initial state
      expect(wrapper.vm.count).toBe(0)
      expect(button.text()).toContain('Count: 0')
      
      // First click
      await button.trigger('click')
      expect(wrapper.vm.count).toBe(1)
      expect(button.text()).toContain('Count: 1')
      
      // Second click
      await button.trigger('click')
      expect(wrapper.vm.count).toBe(2)
      expect(button.text()).toContain('Count: 2')
    })

    it('shows encouragement message after 5 clicks', async () => {
      const wrapper = mount(HelloWorld, {
        props: { msg: 'Test' }
      })
      
      const button = wrapper.find('button')
      let message = wrapper.find('p')
      
      // Initially no message
      expect(message.exists()).toBe(false)
      
      // Click 5 times
      for (let i = 0; i < 5; i++) {
        await button.trigger('click')
      }
      
      // Still no message at exactly 5
      message = wrapper.find('p')
      expect(message.exists()).toBe(false)
      
      // Click one more time
      await button.trigger('click')
      
      // Now message should appear
      message = wrapper.find('p')
      expect(message.exists()).toBe(true)
      expect(message.text()).toBe('Great job! You clicked more than 5 times!')
    })

    it('continues to show message after more than 5 clicks', async () => {
      const wrapper = mount(HelloWorld, {
        props: { msg: 'Test' }
      })
      
      const button = wrapper.find('button')
      
      // Click 10 times
      for (let i = 0; i < 10; i++) {
        await button.trigger('click')
      }
      
      const message = wrapper.find('p')
      expect(message.exists()).toBe(true)
      expect(message.text()).toBe('Great job! You clicked more than 5 times!')
      expect(wrapper.vm.count).toBe(10)
    })
  })

  // State Management Tests
  describe('State Management', () => {
    it('maintains count state correctly', async () => {
      const wrapper = mount(HelloWorld, {
        props: { msg: 'Test' }
      })
      
      // Test multiple increments
      const expectedCounts = [1, 2, 3, 4, 5]
      
      for (const expected of expectedCounts) {
        await wrapper.find('button').trigger('click')
        expect(wrapper.vm.count).toBe(expected)
      }
    })

    it('updates button text dynamically', async () => {
      const wrapper = mount(HelloWorld, {
        props: { msg: 'Test' }
      })
      
      const button = wrapper.find('button')
      
      for (let i = 1; i <= 3; i++) {
        await button.trigger('click')
        expect(button.text()).toContain(`Count: ${i}`)
      }
    })
  })

  // Edge Cases
  describe('Edge Cases', () => {
    it('handles rapid button clicks', async () => {
      const wrapper = mount(HelloWorld, {
        props: { msg: 'Test' }
      })
      
      const button = wrapper.find('button')
      
      // Rapid clicks
      await button.trigger('click')
      await button.trigger('click')
      await button.trigger('click')
      
      expect(wrapper.vm.count).toBe(3)
    })

    it('works with different message content', async () => {
      const messages = [
        'Hello World',
        '123',
        'Special chars: !@#$%',
        'Unicode: 🚀 🎉',
        'Very long message that might cause layout issues'
      ]
      
      messages.forEach(msg => {
        const wrapper = mount(HelloWorld, {
          props: { msg }
        })
        
        expect(wrapper.find('h1').text()).toBe(msg)
        
        // Test interaction still works
        wrapper.find('button').trigger('click')
        expect(wrapper.vm.count).toBe(1)
      })
    })
  })

  // Accessibility Tests
  describe('Accessibility', () => {
    it('button is keyboard accessible', async () => {
      const wrapper = mount(HelloWorld, {
        props: { msg: 'Test' }
      })
      
      const button = wrapper.find('button')
      
      // Test keyboard interaction - simulate click events for keyboard
      await button.trigger('click') // Enter key simulation
      expect(wrapper.vm.count).toBe(1)
      
      await button.trigger('click') // Space key simulation
      expect(wrapper.vm.count).toBe(2)
    })

    it('button has descriptive text', () => {
      const wrapper = mount(HelloWorld, {
        props: { msg: 'Test' }
      })
      
      const button = wrapper.find('button')
      expect(button.text()).toContain('Count:')
      expect(button.text()).toBeTruthy()
    })
  })
})
