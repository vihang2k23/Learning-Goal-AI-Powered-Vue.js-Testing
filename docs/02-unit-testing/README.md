# Unit testing basics

## 🎯 Learning Objectives

By the end of this module, you will:
- Write basic component tests (mount, find, assertions)
- Test component props and emitted events
- Test computed properties and methods
- Mock API calls and external dependencies

## 🧪 Basic Component Testing

### Mounting Components

```javascript
import { mount } from '@vue/test-utils'
import MyComponent from '@/components/MyComponent.vue'

describe('MyComponent', () => {
  it('renders correctly', () => {
    const wrapper = mount(MyComponent)
    expect(wrapper.exists()).toBe(true)
  })
  
  it('renders with props', () => {
    const wrapper = mount(MyComponent, {
      props: {
        message: 'Hello World'
      }
    })
    expect(wrapper.text()).toContain('Hello World')
  })
})
```

### Finding Elements

```javascript
it('can find elements', () => {
  const wrapper = mount(MyComponent)
  
  // Find by selector
  const button = wrapper.find('button')
  expect(button.exists()).toBe(true)
  
  // Find by text
  const heading = wrapper.find('h1')
  expect(heading.text()).toBe('My Title')
  
  // Find multiple elements
  const items = wrapper.findAll('li')
  expect(items).toHaveLength(3)
})
```

### Making Assertions

```javascript
it('makes assertions on content', () => {
  const wrapper = mount(MyComponent)
  
  // Text content
  expect(wrapper.text()).toContain('Expected text')
  
  // HTML content
  expect(wrapper.html()).toContain('<div class="container">')
  
  // CSS classes
  expect(wrapper.find('.active').exists()).toBe(true)
  
  // Attributes
  expect(wrapper.find('input').attributes('type')).toBe('text')
})
```

## 🔧 Testing Props

### Basic Props Testing

```javascript
describe('Props Testing', () => {
  it('accepts and displays props', () => {
    const wrapper = mount(UserCard, {
      props: {
        name: 'John Doe',
        age: 30,
        isActive: true
      }
    })
    
    expect(wrapper.find('.name').text()).toBe('John Doe')
    expect(wrapper.find('.age').text()).toBe('30')
    expect(wrapper.find('.status').classes()).toContain('active')
  })
  
  it('validates required props', () => {
    // This should show a warning for missing required prop
    const wrapper = mount(UserCard)
    expect(wrapper.exists()).toBe(true)
  })
})
```

### Props Reactivity

```javascript
it('updates when props change', async () => {
  const wrapper = mount(UserCard, {
    props: {
      name: 'John'
    }
  })
  
  expect(wrapper.find('.name').text()).toBe('John')
  
  // Update props
  await wrapper.setProps({ name: 'Jane' })
  expect(wrapper.find('.name').text()).toBe('Jane')
})
```

## 📡 Testing Emitted Events

### Basic Event Testing

```javascript
describe('Event Testing', () => {
  it('emits events on user interaction', async () => {
    const wrapper = mount(Counter)
    
    await wrapper.find('button').trigger('click')
    
    // Check if event was emitted
    expect(wrapper.emitted()).toHaveProperty('increment')
    
    // Check event payload
    expect(wrapper.emitted().increment[0]).toEqual([1])
  })
  
  it('emits events with correct payload', async () => {
    const wrapper = mount(FormComponent)
    
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(wrapper.emitted()).toHaveProperty('submit')
    expect(wrapper.emitted().submit[0][0]).toEqual({
      name: 'John',
      email: 'john@example.com'
    })
  })
})
```

## 🧮 Testing Computed Properties

```javascript
describe('Computed Properties', () => {
  it('computes values correctly', () => {
    const wrapper = mount(Calculator, {
      props: {
        numbers: [1, 2, 3, 4]
      }
    })
    
    expect(wrapper.vm.sum).toBe(10)
    expect(wrapper.vm.average).toBe(2.5)
  })
  
  it('updates computed values when dependencies change', async () => {
    const wrapper = mount(Calculator, {
      props: {
        numbers: [1, 2, 3]
      }
    })
    
    expect(wrapper.vm.sum).toBe(6)
    
    await wrapper.setProps({ numbers: [1, 2, 3, 4, 5] })
    expect(wrapper.vm.sum).toBe(15)
  })
})
```

## 🔧 Testing Methods

```javascript
describe('Methods Testing', () => {
  it('calls methods correctly', () => {
    const wrapper = mount(MyComponent)
    
    // Call method directly
    const result = wrapper.vm.myMethod('input')
    expect(result).toBe('expected output')
  })
  
  it('methods update component state', async () => {
    const wrapper = mount(Counter)
    
    expect(wrapper.vm.count).toBe(0)
    
    wrapper.vm.increment()
    await wrapper.vm.$nextTick()
    
    expect(wrapper.vm.count).toBe(1)
  })
})
```

## 🎭 Mocking Dependencies

### Mocking API Calls

```javascript
import { vi } from 'vitest'

describe('API Mocking', () => {
  it('mocks API calls', async () => {
    // Mock the API module
    vi.mock('@/api/user', () => ({
      getUser: vi.fn(() => Promise.resolve({ id: 1, name: 'John' }))
    }))
    
    const wrapper = mount(UserProfile)
    
    // Wait for API call to complete
    await wrapper.vm.$nextTick()
    
    expect(wrapper.find('.user-name').text()).toBe('John')
  })
  
  it('handles API errors', async () => {
    vi.mock('@/api/user', () => ({
      getUser: vi.fn(() => Promise.reject(new Error('User not found')))
    }))
    
    const wrapper = mount(UserProfile)
    
    await wrapper.vm.$nextTick()
    
    expect(wrapper.find('.error').text()).toBe('User not found')
  })
})
```

### Mocking External Libraries

```javascript
describe('External Library Mocking', () => {
  it('mocks moment.js', () => {
    vi.mock('moment', () => ({
      default: vi.fn(() => ({
        format: vi.fn(() => '2023-01-01')
      }))
    }))
    
    const wrapper = mount(DateComponent)
    expect(wrapper.vm.formattedDate).toBe('2023-01-01')
  })
})
```

## 🎯 Best Practices

### 1. Test Structure
```javascript
describe('ComponentName', () => {
  describe('Rendering', () => {
    // Tests for component rendering
  })
  
  describe('Props', () => {
    // Tests for props behavior
  })
  
  describe('Events', () => {
    // Tests for event emission
  })
  
  describe('Computed Properties', () => {
    // Tests for computed properties
  })
})
```

### 2. Test Naming
```javascript
it('renders correctly with default props')
it('displays error message when validation fails')
it('emits save event with correct data')
it('computes total price including tax')
```

### 3. Assertion Patterns
```javascript
// Good: Specific assertions
expect(wrapper.find('.error').text()).toBe('Email is required')

// Bad: Generic assertions
expect(wrapper.text()).toBeTruthy()
```

## 📝 Common Patterns

### Form Testing
```javascript
it('validates form and submits', async () => {
  const wrapper = mount(ContactForm)
  
  // Fill form
  await wrapper.find('input[name="name"]').setValue('John')
  await wrapper.find('input[name="email"]').setValue('john@example.com')
  
  // Submit form
  await wrapper.find('form').trigger('submit.prevent')
  
  // Assert submission
  expect(wrapper.emitted()).toHaveProperty('submit')
})
```

### Conditional Rendering
```javascript
it('shows loading state', () => {
  const wrapper = mount(DataComponent, {
    props: { loading: true }
  })
  
  expect(wrapper.find('.loading').exists()).toBe(true)
  expect(wrapper.find('.content').exists()).toBe(false)
})

it('shows content when loaded', () => {
  const wrapper = mount(DataComponent, {
    props: { loading: false, data: { items: [] } }
  })
  
  expect(wrapper.find('.loading').exists()).toBe(false)
  expect(wrapper.find('.content').exists()).toBe(true)
})
```

## 🚀 Next Steps

After mastering these basics:
1. Work through **exercises** in this folder (`exercises.md`)
2. Read [E2E testing](../03-e2e-testing/README.md)
3. Try [Assignments](../04-assignments/README.md) and the [Planner Pal sample](../planner-pal.md)
