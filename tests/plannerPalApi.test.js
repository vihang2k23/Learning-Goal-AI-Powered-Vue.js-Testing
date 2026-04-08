import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fetchPlannerProfile, savePlannerProfile } from '@/services/plannerPalApi.js'

describe('plannerPalApi', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ id: 1, name: 'A' }),
      }),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('fetchPlannerProfile throws with status on failure', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false, status: 404 })
    await expect(fetchPlannerProfile(9)).rejects.toMatchObject({
      message: expect.stringContaining('404'),
      status: 404,
    })
  })

  it('savePlannerProfile sends PUT JSON body', async () => {
    await savePlannerProfile(1, { name: 'N' })
    expect(fetch).toHaveBeenCalledWith('/api/planner-profile/1', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'N' }),
    })
  })

  it('fetchPlannerProfile returns parsed JSON on success', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ id: 3, name: 'OK' }),
    })
    await expect(fetchPlannerProfile(3)).resolves.toEqual({ id: 3, name: 'OK' })
  })

  it('savePlannerProfile returns parsed JSON on success', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ id: 1, name: 'Saved' }),
    })
    await expect(savePlannerProfile(1, { name: 'Saved' })).resolves.toEqual({
      id: 1,
      name: 'Saved',
    })
  })

  it('savePlannerProfile attaches status on HTTP error', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false, status: 503 })
    await expect(savePlannerProfile(1, {})).rejects.toMatchObject({
      status: 503,
    })
  })
})
