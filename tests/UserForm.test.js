import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
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
    UserValidator.validateUser.mockReturnValue({ isValid: true, errors: [] })
    DateHelper.formatDate.mockReturnValue('')
    DateHelper.getDaysUntil.mockReturnValue(0)
    wrapper = mount(UserForm)
  })

  afterEach(() => {
    vi.restoreAllMocks()
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

    it('mocks DateHelper.formatDate', async () => {
      const mockDate = '2023-12-25'
      const formattedDate = 'December 25, 2023'

      DateHelper.formatDate.mockReturnValue(formattedDate)

      await wrapper.setData({
        formData: { ...wrapper.vm.formData, birthdate: mockDate },
      })
      await wrapper.vm.$nextTick()

      expect(DateHelper.formatDate).toHaveBeenCalledWith(mockDate)
      expect(wrapper.vm.formattedBirthdate).toBe(formattedDate)
    })

    it('mocks DateHelper.getDaysUntil', async () => {
      const mockDate = '2023-12-25'
      const daysUntil = 30

      DateHelper.getDaysUntil.mockReturnValue(daysUntil)

      await wrapper.setData({
        formData: { ...wrapper.vm.formData, birthdate: mockDate },
      })
      await wrapper.vm.$nextTick()

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

      vi.spyOn(wrapper.vm, 'simulateUserCreate').mockRejectedValueOnce(
        new Error('Network error')
      )

      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 25,
        birthdate: '1998-01-01'
      }

      await wrapper.setData({ formData: userData })

      const form = wrapper.find('form')
      await form.trigger('submit')
      await vi.waitFor(() => {
        expect(wrapper.vm.submitError).toBe(
          'Failed to create user. Please try again.'
        )
      })
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
    it('disables submit button when form is invalid', async () => {
      UserValidator.validateUser.mockReturnValue({
        isValid: false,
        errors: ['Invalid email']
      })

      await wrapper.setData({ errors: { email: 'Invalid email' } })
      await wrapper.vm.$nextTick()

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

      let resolveCreate
      vi.spyOn(wrapper.vm, 'simulateUserCreate').mockImplementation(
        () =>
          new Promise(resolve => {
            resolveCreate = resolve
          })
      )

      await wrapper.setData({
        formData: {
          name: 'John Doe',
          email: 'john@example.com',
          age: 25,
          birthdate: '1998-01-01'
        }
      })

      const form = wrapper.find('form')
      const submitPromise = form.trigger('submit')
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.isSubmitting).toBe(true)
      expect(wrapper.find('.submit-btn').text()).toBe('Creating...')

      resolveCreate()
      await submitPromise
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.isSubmitting).toBe(false)
    })

    it('displays formatted birthdate', async () => {
      const mockDate = '2023-12-25'
      const formattedDate = 'December 25, 2023'

      DateHelper.formatDate.mockReturnValue(formattedDate)

      await wrapper.setData({
        formData: { ...wrapper.vm.formData, birthdate: mockDate },
      })
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.date-info').text()).toContain(formattedDate)
    })

    it('displays days until birthday', async () => {
      const mockDate = '2023-12-25'
      const daysUntil = 30

      DateHelper.getDaysUntil.mockReturnValue(daysUntil)

      await wrapper.setData({
        formData: { ...wrapper.vm.formData, birthdate: mockDate },
      })
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.date-info').text()).toContain('30 days until birthday')
    })

    it('shows birthday passed message', async () => {
      const mockDate = '2023-01-01'

      DateHelper.getDaysUntil.mockReturnValue(-10)

      await wrapper.setData({
        formData: { ...wrapper.vm.formData, birthdate: mockDate },
      })
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.date-info').text()).toContain('Birthday passed this year')
    })
  })
})
