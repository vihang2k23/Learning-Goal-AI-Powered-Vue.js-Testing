import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import DataFetcher from '../src/components/DataFetcher.vue'

const mockFetch = vi.fn()
global.fetch = mockFetch

vi.mock('lodash-es', () => ({
  debounce: (fn) => fn,
}))

describe('DataFetcher - API Calls and Mocking', () => {
  let wrapper

  const mockUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'active' },
  ]

  const mockApiResponse = {
    users: mockUsers,
    totalPages: 3,
    currentPage: 1,
  }

  async function mountWithLoadedUsers() {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse,
    })
    const w = mount(DataFetcher)
    await flushPromises()
    return w
  }

  beforeEach(() => {
    mockFetch.mockReset()
  })

  afterEach(() => {
    wrapper?.unmount()
  })

  describe('Basic API Fetching', () => {
    it('fetches users on component creation', async () => {
      wrapper = await mountWithLoadedUsers()
      expect(mockFetch).toHaveBeenCalledWith('/api/users?page=1&search=&status=')
      expect(wrapper.vm.users).toEqual(mockUsers)
      expect(wrapper.vm.loading).toBe(false)
    })

    it('handles fetch errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))
      wrapper = mount(DataFetcher)
      await flushPromises()
      expect(wrapper.vm.error).toContain('Failed to fetch users: Network error')
      expect(wrapper.vm.loading).toBe(false)
      expect(wrapper.find('.error').exists()).toBe(true)
    })

    it('handles HTTP error responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      })
      wrapper = mount(DataFetcher)
      await flushPromises()
      expect(wrapper.vm.error).toContain('HTTP error! status: 404')
    })
  })

  describe('User CRUD Operations', () => {
    beforeEach(async () => {
      wrapper = await mountWithLoadedUsers()
      mockFetch.mockClear()
    })

    it('creates a new user successfully', async () => {
      const newUser = {
        name: 'Alice Wilson',
        email: 'alice@example.com',
        status: 'active',
      }
      const createdUser = { id: 4, ...newUser }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => createdUser,
      })

      await wrapper.vm.createUser(newUser)

      expect(mockFetch).toHaveBeenCalledWith('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      })
      expect(wrapper.vm.users).toContainEqual(createdUser)
      expect(wrapper.emitted('user-created')).toBeTruthy()
      expect(wrapper.emitted('user-created')[0][0]).toEqual(createdUser)
    })

    it('handles user creation errors', async () => {
      const newUser = { name: 'Alice Wilson', email: 'alice@example.com' }
      mockFetch.mockResolvedValueOnce({ ok: false, status: 400 })

      await expect(wrapper.vm.createUser(newUser)).rejects.toThrow()

      expect(wrapper.vm.error).toContain('Failed to create user: 400')
      expect(wrapper.emitted('create-error')).toBeTruthy()
    })

    it('updates a user successfully', async () => {
      const updatedData = {
        name: 'John Updated',
        email: 'john.updated@example.com',
      }
      const updatedUser = {
        id: 1,
        name: 'John Updated',
        email: 'john.updated@example.com',
        status: 'active',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => updatedUser,
      })

      await wrapper.vm.updateUser(1, updatedData)

      expect(wrapper.vm.users.find((u) => u.id === 1)).toEqual(updatedUser)
      expect(wrapper.emitted('user-updated')).toBeTruthy()
    })

    it('deletes a user successfully', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true })
      await wrapper.vm.deleteUser(1)
      expect(mockFetch).toHaveBeenCalledWith('/api/users/1', { method: 'DELETE' })
      expect(wrapper.vm.users.find((u) => u.id === 1)).toBeUndefined()
      expect(wrapper.emitted('user-deleted')).toBeTruthy()
      expect(wrapper.emitted('user-deleted')[0][0]).toBe(1)
    })
  })

  describe('Search and Filtering', () => {
    beforeEach(async () => {
      wrapper = await mountWithLoadedUsers()
      mockFetch.mockClear()
    })

    it('filters users by search term', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          users: [mockUsers[0]],
          totalPages: 1,
          currentPage: 1,
        }),
      })
      await wrapper.setData({ searchTerm: 'John' })
      await wrapper.vm.fetchUsers()
      await flushPromises()
      expect(mockFetch).toHaveBeenCalledWith('/api/users?page=1&search=John&status=')
    })

    it('filters users by status', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          users: mockUsers.filter((u) => u.status === 'active'),
          totalPages: 1,
          currentPage: 1,
        }),
      })
      await wrapper.setData({ filterStatus: 'active' })
      await wrapper.vm.fetchUsers()
      await flushPromises()
      expect(mockFetch).toHaveBeenCalledWith('/api/users?page=1&search=&status=active')
    })

    it('computes filtered users locally', async () => {
      await wrapper.setData({ searchTerm: 'Jane' })
      const filtered = wrapper.vm.filteredUsers
      expect(filtered).toHaveLength(1)
      expect(filtered[0].name).toBe('Jane Smith')
    })
  })

  describe('Pagination', () => {
    beforeEach(async () => {
      wrapper = await mountWithLoadedUsers()
      mockFetch.mockClear()
    })

    it('navigates to next page', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          users: [],
          totalPages: 3,
          currentPage: 2,
        }),
      })
      await wrapper.vm.nextPage()
      await flushPromises()
      expect(wrapper.vm.currentPage).toBe(2)
      expect(mockFetch).toHaveBeenCalledWith('/api/users?page=2&search=&status=')
    })

    it('navigates to previous page', async () => {
      await wrapper.setData({ currentPage: 2 })
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          users: [],
          totalPages: 3,
          currentPage: 1,
        }),
      })
      await wrapper.vm.prevPage()
      await flushPromises()
      expect(wrapper.vm.currentPage).toBe(1)
      expect(mockFetch).toHaveBeenCalledWith('/api/users?page=1&search=&status=')
    })

    it('does not go beyond page limits', async () => {
      await wrapper.vm.prevPage()
      expect(wrapper.vm.currentPage).toBe(1)
      await wrapper.setData({ currentPage: 3, totalPages: 3 })
      await wrapper.vm.nextPage()
      expect(wrapper.vm.currentPage).toBe(3)
    })
  })

  describe('User Selection', () => {
    beforeEach(async () => {
      wrapper = await mountWithLoadedUsers()
    })

    it('selects a user when clicked', async () => {
      const userItem = wrapper.findAll('.user-item')[0]
      await userItem.trigger('click')
      expect(wrapper.vm.selectedUser).toEqual(mockUsers[0])
      expect(wrapper.emitted('user-selected')).toBeTruthy()
      expect(wrapper.emitted('user-selected')[0][0]).toEqual(mockUsers[0])
    })
  })

  describe('Component State', () => {
    it('shows loading state', async () => {
      let resolveFetch
      mockFetch.mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveFetch = resolve
          }),
      )
      wrapper = mount(DataFetcher)
      expect(wrapper.vm.loading).toBe(true)
      expect(wrapper.find('.loading').exists()).toBe(true)
      resolveFetch({
        ok: true,
        json: async () => mockApiResponse,
      })
      await flushPromises()
      expect(wrapper.vm.loading).toBe(false)
    })

    it('shows empty state when no users', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          users: [],
          totalPages: 0,
          currentPage: 1,
        }),
      })
      wrapper = mount(DataFetcher)
      await flushPromises()
      expect(wrapper.find('.empty').exists()).toBe(true)
      expect(wrapper.find('.empty').text()).toBe('No users found')
    })

    it('resets filters correctly', async () => {
      wrapper = await mountWithLoadedUsers()
      mockFetch.mockClear()
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      })
      await wrapper.setData({
        searchTerm: 'test',
        filterStatus: 'active',
        currentPage: 2,
      })
      wrapper.vm.resetFilters()
      await flushPromises()
      expect(wrapper.vm.searchTerm).toBe('')
      expect(wrapper.vm.filterStatus).toBe('')
      expect(wrapper.vm.currentPage).toBe(1)
    })
  })
})
