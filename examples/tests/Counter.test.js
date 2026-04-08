import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import Counter from '@/components/Counter.vue'

describe('Counter Component', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Counter, {
      props: {
        initialCount: 5,
        min: 0,
        max: 10
      }
    })
  })

  describe('Rendering', () => {
    it('renders correctly with default props', () => {
      const wrapper = mount(Counter)
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.counter').exists()).toBe(true)
      expect(wrapper.find('h2').text()).toContain('Count: 0')
    })

    it('renders with custom initial count', () => {
      expect(wrapper.find('h2').text()).toContain('Count: 5')
    })

    it('renders all control buttons', () => {
      const buttons = wrapper.findAll('button')
      expect(buttons).toHaveLength(3)
      expect(buttons[0].text()).toBe('Increment')
      expect(buttons[1].text()).toBe('Decrement')
      expect(buttons[2].text()).toBe('Reset')
    })
  })

  describe('Props', () => {
    it('accepts initialCount prop', () => {
      const wrapper = mount(Counter, {
        props: { initialCount: 3 }
      })
      expect(wrapper.vm.count).toBe(3)
    })

    it('accepts min and max props', () => {
      const wrapper = mount(Counter, {
        props: { min: -5, max: 20 }
      })
      expect(wrapper.vm.min).toBe(-5)
      expect(wrapper.vm.max).toBe(20)
    })

    it('uses default values when props not provided', () => {
      const wrapper = mount(Counter)
      expect(wrapper.vm.initialCount).toBe(0)
      expect(wrapper.vm.min).toBe(0)
      expect(wrapper.vm.max).toBe(10)
    })
  })

  describe('User Interactions', () => {
    it('increments count when increment button is clicked', async () => {
      expect(wrapper.vm.count).toBe(5)
      
      await wrapper.find('button').trigger('click')
      expect(wrapper.vm.count).toBe(6)
      expect(wrapper.find('h2').text()).toContain('Count: 6')
    })

    it('decrements count when decrement button is clicked', async () => {
      expect(wrapper.vm.count).toBe(5)
      
      const buttons = wrapper.findAll('button')
      await buttons[1].trigger('click')
      expect(wrapper.vm.count).toBe(4)
      expect(wrapper.find('h2').text()).toContain('Count: 4')
    })

    it('resets count when reset button is clicked', async () => {
      const buttons = wrapper.findAll('button')
      
      // Change count first
      await buttons[0].trigger('click') // increment
      expect(wrapper.vm.count).toBe(6)
      
      // Reset
      await buttons[2].trigger('click')
      expect(wrapper.vm.count).toBe(5) // back to initial count
    })

    it('does not increment beyond max value', async () => {
      const wrapper = mount(Counter, {
        props: { initialCount: 9, max: 10 }
      })
      
      const incrementButton = wrapper.find('button')
      
      await incrementButton.trigger('click')
      expect(wrapper.vm.count).toBe(10)
      
      await incrementButton.trigger('click')
      expect(wrapper.vm.count).toBe(10) // should not change
    })

    it('does not decrement below min value', async () => {
      const wrapper = mount(Counter, {
        props: { initialCount: 1, min: 0 }
      })
      
      const buttons = wrapper.findAll('button')
      
      await buttons[1].trigger('click') // decrement
      expect(wrapper.vm.count).toBe(0)
      
      await buttons[1].trigger('click') // decrement again
      expect(wrapper.vm.count).toBe(0) // should not change
    })
  })

  describe('Button States', () => {
    it('disables increment button at max value', async () => {
      const wrapper = mount(Counter, {
        props: { initialCount: 10, max: 10 }
      })
      
      const incrementButton = wrapper.find('button')
      expect(incrementButton.attributes('disabled')).toBeDefined()
    })

    it('disables decrement button at min value', async () => {
      const wrapper = mount(Counter, {
        props: { initialCount: 0, min: 0 }
      })
      
      const buttons = wrapper.findAll('button')
      expect(buttons[1].attributes('disabled')).toBeDefined()
    })

    it('enables buttons when within range', () => {
      const wrapper = mount(Counter, {
        props: { initialCount: 5, min: 0, max: 10 }
      })
      
      const buttons = wrapper.findAll('button')
      expect(buttons[0].attributes('disabled')).toBeUndefined()
      expect(buttons[1].attributes('disabled')).toBeUndefined()
      expect(buttons[2].attributes('disabled')).toBeUndefined()
    })
  })

  describe('Message Display', () => {
    it('shows message at max value', () => {
      const wrapper = mount(Counter, {
        props: { initialCount: 10, max: 10 }
      })
      
      expect(wrapper.find('.message').exists()).toBe(true)
      expect(wrapper.find('.message').text()).toBe('Maximum reached!')
    })

    it('shows message at min value', () => {
      const wrapper = mount(Counter, {
        props: { initialCount: 0, min: 0 }
      })
      
      expect(wrapper.find('.message').exists()).toBe(true)
      expect(wrapper.find('.message').text()).toBe('Minimum reached!')
    })

    it('hides message when within range', () => {
      expect(wrapper.find('.message').exists()).toBe(false)
    })
  })

  describe('Events', () => {
    it('emits count-changed event on increment', async () => {
      await wrapper.find('button').trigger('click')
      
      expect(wrapper.emitted('count-changed')).toBeTruthy()
      expect(wrapper.emitted('count-changed')[0]).toEqual([{ new: 6, old: 5 }])
    })

    it('emits count-changed event on decrement', async () => {
      const buttons = wrapper.findAll('button')
      await buttons[1].trigger('click')
      
      expect(wrapper.emitted('count-changed')).toBeTruthy()
      expect(wrapper.emitted('count-changed')[0]).toEqual([{ new: 4, old: 5 }])
    })

    it('emits max-reached event when max is reached', async () => {
      const wrapper = mount(Counter, {
        props: { initialCount: 9, max: 10 }
      })
      
      await wrapper.find('button').trigger('click')
      
      expect(wrapper.emitted('max-reached')).toBeTruthy()
      expect(wrapper.emitted('max-reached')[0]).toEqual([10])
    })

    it('emits min-reached event when min is reached', async () => {
      const wrapper = mount(Counter, {
        props: { initialCount: 1, min: 0 }
      })
      
      const buttons = wrapper.findAll('button')
      await buttons[1].trigger('click')
      
      expect(wrapper.emitted('min-reached')).toBeTruthy()
      expect(wrapper.emitted('min-reached')[0]).toEqual([0])
    })
  })

  describe('Computed Properties', () => {
    it('computes showMessage correctly', () => {
      expect(wrapper.vm.showMessage).toBe(false)
      
      const wrapperMax = mount(Counter, { props: { initialCount: 10, max: 10 } })
      expect(wrapperMax.vm.showMessage).toBe(true)
      
      const wrapperMin = mount(Counter, { props: { initialCount: 0, min: 0 } })
      expect(wrapperMin.vm.showMessage).toBe(true)
    })

    it('computes message correctly', () => {
      const wrapperMax = mount(Counter, { props: { initialCount: 10, max: 10 } })
      expect(wrapperMax.vm.message).toBe('Maximum reached!')
      
      const wrapperMin = mount(Counter, { props: { initialCount: 0, min: 0 } })
      expect(wrapperMin.vm.message).toBe('Minimum reached!')
    })
  })

  describe('Accessibility', () => {
    it('has proper button text for screen readers', () => {
      const buttons = wrapper.findAll('button')
      expect(buttons[0].text()).toBe('Increment')
      expect(buttons[1].text()).toBe('Decrement')
      expect(buttons[2].text()).toBe('Reset')
    })

    it('provides visual feedback for disabled state', () => {
      const wrapper = mount(Counter, {
        props: { initialCount: 10, max: 10 }
      })
      
      const incrementButton = wrapper.find('button')
      expect(incrementButton.attributes('disabled')).toBeDefined()
    })
  })
})
