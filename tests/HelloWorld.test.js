import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HelloWorld from '../src/components/HelloWorld.vue'

describe('HelloWorld', () => {
  it('renders properly with required prop', () => {
    const msg = 'Hello Vue 3 + Vitest'
    const wrapper = mount(HelloWorld, { props: { msg } })
    
    expect(wrapper.find('h1').text()).toContain(msg)
  })

  it('displays initial count of 0', () => {
    const wrapper = mount(HelloWorld, { 
      props: { msg: 'Test Message' } 
    })
    
    expect(wrapper.find('button').text()).toContain('Count: 0')
  })

  it('increments count when button is clicked', async () => {
    const wrapper = mount(HelloWorld, { 
      props: { msg: 'Test Message' } 
    })
    
    const button = wrapper.find('button')
    await button.trigger('click')
    await button.trigger('click')
    
    expect(button.text()).toContain('Count: 2')
  })

  it('shows encouragement message after 5 clicks', async () => {
    const wrapper = mount(HelloWorld, { 
      props: { msg: 'Test Message' } 
    })
    
    const button = wrapper.find('button')
    
    // Click 6 times
    for (let i = 0; i < 6; i++) {
      await button.trigger('click')
    }
    
    expect(wrapper.find('p').exists()).toBe(true)
    expect(wrapper.find('p').text()).toContain('Great job!')
  })

  it('does not show encouragement message before 5 clicks', async () => {
    const wrapper = mount(HelloWorld, { 
      props: { msg: 'Test Message' } 
    })
    
    const button = wrapper.find('button')
    
    // Click 3 times
    for (let i = 0; i < 3; i++) {
      await button.trigger('click')
    }
    
    expect(wrapper.find('p').exists()).toBe(false)
  })
})
