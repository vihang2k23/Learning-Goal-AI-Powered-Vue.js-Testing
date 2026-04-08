import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import PlannerPal from '@/components/PlannerPal.vue'
import * as api from '@/services/plannerPalApi.js'

vi.mock('@/services/plannerPalApi.js', () => ({
  fetchPlannerProfile: vi.fn(),
  savePlannerProfile: vi.fn(),
}))

const sampleProfile = {
  id: 1,
  name: 'Alex Planner',
  email: 'alex@example.com',
  avatar: 'https://example.com/a.png',
  bio: 'Hello',
  created_at: '2024-06-01T12:00:00.000Z',
}

describe('PlannerPal', () => {
  beforeEach(() => {
    vi.mocked(api.fetchPlannerProfile).mockResolvedValue(sampleProfile)
    vi.mocked(api.savePlannerProfile).mockImplementation(async (_id, p) => ({
      ...sampleProfile,
      ...p,
    }))
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading then view mode with profile data', async () => {
    const wrapper = mount(PlannerPal, { props: { userId: 1 } })
    expect(wrapper.find('[data-testid="loading"]').exists()).toBe(true)
    await flushPromises()
    expect(wrapper.find('[data-testid="view-mode"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="display-name"]').text()).toBe('Alex Planner')
    expect(wrapper.find('[data-testid="display-email"]').text()).toBe('alex@example.com')
    expect(wrapper.find('[data-testid="display-bio"]').text()).toBe('Hello')
  })

  it('emits profile-loaded after successful fetch', async () => {
    const wrapper = mount(PlannerPal, { props: { userId: 1 } })
    await flushPromises()
    expect(wrapper.emitted('profile-loaded')).toBeTruthy()
    expect(wrapper.emitted('profile-loaded')[0][0]).toEqual(sampleProfile)
  })

  it('shows load error when fetch fails', async () => {
    vi.mocked(api.fetchPlannerProfile).mockRejectedValueOnce(
      Object.assign(new Error('Failed to load profile (500)'), { status: 500 }),
    )
    const wrapper = mount(PlannerPal, { props: { userId: 1 } })
    await flushPromises()
    expect(wrapper.find('[data-testid="load-error"]').text()).toContain('Failed to load')
    expect(wrapper.emitted('profile-error')).toBeTruthy()
  })

  it('shows generic load error when rejection has no message', async () => {
    vi.mocked(api.fetchPlannerProfile).mockRejectedValueOnce({})
    const wrapper = mount(PlannerPal, { props: { userId: 1 } })
    await flushPromises()
    expect(wrapper.find('[data-testid="load-error"]').text()).toContain('Could not load profile')
  })

  it('toggles edit mode and cancel returns to view', async () => {
    const wrapper = mount(PlannerPal, { props: { userId: 1 } })
    await flushPromises()
    await wrapper.get('[data-testid="edit-toggle"]').trigger('click')
    expect(wrapper.find('[data-testid="edit-mode"]').exists()).toBe(true)
    await wrapper.get('[data-testid="cancel-btn"]').trigger('click')
    expect(wrapper.find('[data-testid="view-mode"]').exists()).toBe(true)
  })

  it('validates required name', async () => {
    const wrapper = mount(PlannerPal, { props: { userId: 1 } })
    await flushPromises()
    await wrapper.get('[data-testid="edit-toggle"]').trigger('click')
    await wrapper.setData({
      draft: { name: '', email: 'alex@example.com', bio: 'Hello' },
    })
    await wrapper.get('[data-testid="edit-mode"]').trigger('submit')
    await flushPromises()
    expect(wrapper.find('[data-testid="name-error"]').text()).toContain('required')
    expect(api.savePlannerProfile).not.toHaveBeenCalled()
  })

  it('validates email format', async () => {
    const wrapper = mount(PlannerPal, { props: { userId: 1 } })
    await flushPromises()
    await wrapper.get('[data-testid="edit-toggle"]').trigger('click')
    await wrapper.setData({
      draft: { name: 'Alex', email: 'not-an-email', bio: 'Hello' },
    })
    await wrapper.get('[data-testid="edit-mode"]').trigger('submit')
    await flushPromises()
    expect(wrapper.find('[data-testid="email-error"]').text()).toContain('valid email')
  })

  it('validates missing email', async () => {
    const wrapper = mount(PlannerPal, { props: { userId: 1 } })
    await flushPromises()
    await wrapper.get('[data-testid="edit-toggle"]').trigger('click')
    await wrapper.setData({
      draft: { name: 'Alex', email: '', bio: 'Hello' },
    })
    await wrapper.get('[data-testid="edit-mode"]').trigger('submit')
    await flushPromises()
    expect(wrapper.find('[data-testid="email-error"]').text()).toContain('required')
  })

  it('validates bio max length', async () => {
    const wrapper = mount(PlannerPal, { props: { userId: 1 } })
    await flushPromises()
    await wrapper.get('[data-testid="edit-toggle"]').trigger('click')
    await wrapper.setData({
      draft: { name: 'Alex', email: 'alex@example.com', bio: 'x'.repeat(501) },
    })
    await wrapper.get('[data-testid="edit-mode"]').trigger('submit')
    await flushPromises()
    expect(wrapper.find('[data-testid="bio-error"]').text()).toMatch(/500/)
  })

  it('saves valid form and emits profile-updated', async () => {
    const wrapper = mount(PlannerPal, { props: { userId: 1 } })
    await flushPromises()
    await wrapper.get('[data-testid="edit-toggle"]').trigger('click')
    await wrapper.setData({
      draft: {
        name: 'Taylor',
        email: 'taylor@example.com',
        bio: 'Updated bio',
      },
    })
    await wrapper.get('[data-testid="edit-mode"]').trigger('submit')
    await flushPromises()
    expect(api.savePlannerProfile).toHaveBeenCalledWith(1, {
      name: 'Taylor',
      email: 'taylor@example.com',
      bio: 'Updated bio',
    })
    expect(wrapper.emitted('profile-updated')).toBeTruthy()
    expect(wrapper.find('[data-testid="view-mode"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="display-name"]').text()).toBe('Taylor')
  })

  it('shows generic save error when rejection has no message', async () => {
    vi.mocked(api.savePlannerProfile).mockRejectedValueOnce({})
    const wrapper = mount(PlannerPal, { props: { userId: 1 } })
    await flushPromises()
    await wrapper.get('[data-testid="edit-toggle"]').trigger('click')
    await wrapper.setData({
      draft: {
        name: 'Alex Planner',
        email: 'alex@example.com',
        bio: 'Hello',
      },
    })
    await wrapper.get('[data-testid="edit-mode"]').trigger('submit')
    await flushPromises()
    expect(wrapper.find('[data-testid="save-error"]').text()).toContain('Could not save profile')
  })

  it('shows save error when API rejects', async () => {
    vi.mocked(api.savePlannerProfile).mockRejectedValueOnce(
      Object.assign(new Error('Failed to save profile (503)'), { status: 503 }),
    )
    const wrapper = mount(PlannerPal, { props: { userId: 1 } })
    await flushPromises()
    await wrapper.get('[data-testid="edit-toggle"]').trigger('click')
    await wrapper.setData({
      draft: {
        name: 'Alex Planner',
        email: 'alex@example.com',
        bio: 'Hello',
      },
    })
    await wrapper.get('[data-testid="edit-mode"]').trigger('submit')
    await flushPromises()
    expect(wrapper.find('[data-testid="save-error"]').text()).toContain('Failed to save')
    expect(wrapper.emitted('profile-error')).toBeTruthy()
  })

  it('disables save while saving', async () => {
    let resolveSave
    vi.mocked(api.savePlannerProfile).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSave = () => resolve({ ...sampleProfile })
        }),
    )
    const wrapper = mount(PlannerPal, { props: { userId: 1 } })
    await flushPromises()
    await wrapper.get('[data-testid="edit-toggle"]').trigger('click')
    await wrapper.setData({
      draft: {
        name: 'Alex Planner',
        email: 'alex@example.com',
        bio: 'Hello',
      },
    })
    const saveBtn = wrapper.get('[data-testid="save-btn"]')
    const submitPromise = wrapper.get('[data-testid="edit-mode"]').trigger('submit')
    await flushPromises()
    expect(saveBtn.element.disabled).toBe(true)
    resolveSave()
    await submitPromise
    await flushPromises()
  })

  it('reloads when userId prop changes', async () => {
    const wrapper = mount(PlannerPal, { props: { userId: 1 } })
    await flushPromises()
    vi.mocked(api.fetchPlannerProfile).mockResolvedValueOnce({ ...sampleProfile, id: 2, name: 'Two' })
    await wrapper.setProps({ userId: 2 })
    await flushPromises()
    expect(api.fetchPlannerProfile).toHaveBeenCalledWith(2)
    expect(wrapper.find('[data-testid="display-name"]').text()).toBe('Two')
  })

  it('formats created_at for display', async () => {
    const wrapper = mount(PlannerPal, { props: { userId: 1 } })
    await flushPromises()
    const meta = wrapper.find('[data-testid="display-created"]').text()
    expect(meta).toMatch(/Joined/)
    expect(meta.length).toBeGreaterThan(10)
  })

  it('still shows joined line when created_at is not a valid date', async () => {
    vi.mocked(api.fetchPlannerProfile).mockResolvedValueOnce({
      ...sampleProfile,
      created_at: 'not-a-real-date-but-string',
    })
    const wrapper = mount(PlannerPal, { props: { userId: 1 } })
    await flushPromises()
    expect(wrapper.find('[data-testid="display-created"]').text()).toContain('Joined')
  })

  it('formattedCreated catch returns raw string when locale throws', async () => {
    const spy = vi.spyOn(Date.prototype, 'toLocaleDateString').mockImplementation(() => {
      throw new Error('locale')
    })
    vi.mocked(api.fetchPlannerProfile).mockResolvedValueOnce({
      ...sampleProfile,
      created_at: '2024-02-02',
    })
    const wrapper = mount(PlannerPal, { props: { userId: 1 } })
    await flushPromises()
    expect(wrapper.find('[data-testid="display-created"]').text()).toContain('2024-02-02')
    spy.mockRestore()
  })

  it('omits date when created_at is missing', async () => {
    vi.mocked(api.fetchPlannerProfile).mockResolvedValueOnce({
      ...sampleProfile,
      created_at: undefined,
    })
    const wrapper = mount(PlannerPal, { props: { userId: 1 } })
    await flushPromises()
    expect(wrapper.find('[data-testid="display-created"]').text().trim()).toBe('Joined')
  })
})
