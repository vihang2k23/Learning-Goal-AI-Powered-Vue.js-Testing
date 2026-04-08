import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import UserForm from '../src/components/UserForm.vue'

// Mock the external validator utility
vi.mock('../src/utils/validator.js', () => ({
  UserValidator: {
    validateUser: vi.fn()
  },
  DateHelper: {
    formatDate: vi.fn(),
    getDaysUntil: vi.fn()
  }
}))

import { UserValidator, DateHelper } from '../src/utils/validator.js'

describe('UserForm - External Dependencies and Modules', () => {
  let wrapper

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(UserForm)
  })

  describe('External Module Mocking', () => {
    it('mocks UserValidator.validateUser', () => {
      UserValidator.validateUser.mockReturnValue({
        isValid: false,
        errors: ['Name must be at least 2 characters long']
      })

      wrapper.vm.validateField('name')

      expect(UserValidator.validateUser).toHaveBeenCalledWith(wrapper.vm.formData)
      expect(wrapper.vm.errors.name).toBe('Name must be at least 2 characters long')
    })

    it('mocks DateHelper.formatDate', () => {
      const mockDate = '2023-12-25'
      const formattedDate = 'December 25, 2023'
      
      DateHelper.formatDate.mockReturnValue(formattedDate)
      
      wrapper.setData({ birthdate: mockDate })
      
      expect(DateHelper.formatDate).toHaveBeenCalledWith(mockDate)
      expect(wrapper.vm.formattedBirthdate).toBe(formattedDate)
    })

    it('mocks DateHelper.getDaysUntil', () => {
      const mockDate = '2023-12-25'
      const daysUntil = 30
      
      DateHelper.getDaysUntil.mockReturnValue(daysUntil)
      
      wrapper.setData({ birthdate: mockDate })
      
      expect(DateHelper.getDaysUntil).toHaveBeenCalledWith(mockDate)
      expect(wrapper.vm.daysUntilBirthday).toBe(daysUntil)
    })
  })

  describe('Form Validation with Mocked Dependencies', () => {
    it('validates form correctly when UserValidator returns valid', () => {
      UserValidator.validateUser.mockReturnValue({
        isValid: true,
        errors: []
      })

      wrapper.setData({
        formData: {
          name: 'John Doe',
          email: 'john@example.com',
          age: 25,
          birthdate: '1998-01-01'
        }
      })

      expect(wrapper.vm.isFormValid).toBe(true)
    })

    it('invalidates form when UserValidator returns errors', () => {
      UserValidator.validateUser.mockReturnValue({
        isValid: false,
        errors: ['Invalid email format', 'Name must be at least 2 characters long']
      })

      wrapper.setData({
        formData: {
          name: 'J',
          email: 'invalid-email',
          age: 15
        }
      })

      expect(wrapper.vm.isFormValid).toBe(false)
    })

    it('validates individual fields on input', async () => {
      UserValidator.validateUser.mockReturnValue({
        isValid: false,
        errors: ['Name must be at least 2 characters long']
      })

      const nameInput = wrapper.find('#name')
      await nameInput.setValue('J')

      expect(UserValidator.validateUser).toHaveBeenCalled()
      expect(wrapper.vm.errors.name).toBe('Name must be at least 2 characters long')
    })

    it('clears field errors when validation passes', async () => {
      // First, set an error
      UserValidator.validateUser.mockReturnValueOnce({
        isValid: false,
        errors: ['Name must be at least 2 characters long']
      })

      wrapper.setData({ 'formData.name': 'J' })
      wrapper.vm.validateField('name')

      expect(wrapper.vm.errors.name).toBeDefined()

      // Then, validate successfully
      UserValidator.validateUser.mockReturnValueOnce({
        isValid: true,
        errors: []
      })

      wrapper.setData({ 'formData.name': 'John Doe' })
      wrapper.vm.validateField('name')

      expect(wrapper.vm.errors.name).toBeUndefined()
    })
  })

  describe('Form Submission', () => {
    it('submits form successfully with valid data', async () => {
      UserValidator.validateUser.mockReturnValue({
        isValid: true,
        errors: []
      })

      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 25,
        birthdate: '1998-01-01'
      }

      wrapper.setData({ formData: userData })

      const form = wrapper.find('form')
      await form.trigger('submit')

      // Wait for the simulated API call
      await new Promise(resolve => setTimeout(resolve, 1100))

      expect(wrapper.emitted('user-created')).toBeTruthy()
      expect(wrapper.emitted('user-created')[0][0]).toEqual(userData)
    })

    it('does not submit form when invalid', async () => {
      UserValidator.validateUser.mockReturnValue({
        isValid: false,
        errors: ['Invalid email']
      })

      const form = wrapper.find('form')
      await form.trigger('submit')

      expect(wrapper.emitted('user-created')).toBeFalsy()
    })

    it('handles submission errors', async () => {
      UserValidator.validateUser.mockReturnValue({
        isValid: true,
        errors: []
      })

      // Mock the setTimeout to reject
      const originalSetTimeout = global.setTimeout
      global.setTimeout = vi.fn((callback, delay) => {
        if (delay === 1000) {
          return originalSetTimeout(() => {
            throw new Error('Network error')
          }, 10)
        }
        return originalSetTimeout(callback, delay)
      })

      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 25,
        birthdate: '1998-01-01'
      }

      wrapper.setData({ formData: userData })

      const form = wrapper.find('form')
      await form.trigger('submit')

      await new Promise(resolve => setTimeout(resolve, 50))

      expect(wrapper.vm.submitError).toBe('Failed to create user. Please try again.')

      // Restore original setTimeout
      global.setTimeout = originalSetTimeout
    })

    it('resets form after successful submission', async () => {
      UserValidator.validateUser.mockReturnValue({
        isValid: true,
        errors: []
      })

      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 25,
        birthdate: '1998-01-01'
      }

      wrapper.setData({ formData: userData })

      const form = wrapper.find('form')
      await form.trigger('submit')

      // Wait for the simulated API call
      await new Promise(resolve => setTimeout(resolve, 1100))

      expect(wrapper.vm.formData).toEqual({
        name: '',
        email: '',
        age: null,
        birthdate: ''
      })
      expect(Object.keys(wrapper.vm.errors)).toHaveLength(0)
    })
  })

  describe('UI State Management', () => {
    it('disables submit button when form is invalid', () => {
      UserValidator.validateUser.mockReturnValue({
        isValid: false,
        errors: ['Invalid email']
      })

      const submitBtn = wrapper.find('.submit-btn')
      expect(submitBtn.attributes('disabled')).toBeDefined()
    })

    it('enables submit button when form is valid', () => {
      UserValidator.validateUser.mockReturnValue({
        isValid: true,
        errors: []
      })

      wrapper.setData({
        formData: {
          name: 'John Doe',
          email: 'john@example.com',
          age: 25,
          birthdate: '1998-01-01'
        }
      })

      const submitBtn = wrapper.find('.submit-btn')
      expect(submitBtn.attributes('disabled')).toBeUndefined()
    })

    it('shows loading state during submission', async () => {
      UserValidator.validateUser.mockReturnValue({
        isValid: true,
        errors: []
      })

      wrapper.setData({
        formData: {
          name: 'John Doe',
          email: 'john@example.com',
          age: 25,
          birthdate: '1998-01-01'
        }
      })

      const form = wrapper.find('form')
      form.trigger('submit')

      expect(wrapper.vm.isSubmitting).toBe(true)
      expect(wrapper.find('.submit-btn').text()).toBe('Creating...')

      // Wait for completion
      await new Promise(resolve => setTimeout(resolve, 1100))
      expect(wrapper.vm.isSubmitting).toBe(false)
    })

    it('displays formatted birthdate', () => {
      const mockDate = '2023-12-25'
      const formattedDate = 'December 25, 2023'
      
      DateHelper.formatDate.mockReturnValue(formattedDate)
      
      wrapper.setData({ birthdate: mockDate })
      
      expect(wrapper.find('.date-info').text()).toContain(formattedDate)
    })

    it('displays days until birthday', () => {
      const mockDate = '2023-12-25'
      const daysUntil = 30
      
      DateHelper.getDaysUntil.mockReturnValue(daysUntil)
      
      wrapper.setData({ birthdate: mockDate })
      
      expect(wrapper.find('.date-info').text()).toContain('30 days until birthday')
    })

    it('shows birthday passed message', () => {
      const mockDate = '2023-01-01'
      
      DateHelper.getDaysUntil.mockReturnValue(-10)
      
      wrapper.setData({ birthdate: mockDate })
      
      expect(wrapper.find('.date-info').text()).toContain('Birthday passed this year')
    })
  })
})
