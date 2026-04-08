/**
 * HTTP helpers for Planner Pal profile CRUD (dev server mocks GET/PUT).
 */

export async function fetchPlannerProfile(userId) {
  const res = await fetch(`/api/planner-profile/${userId}`)
  if (!res.ok) {
    const err = new Error(`Failed to load profile (${res.status})`)
    err.status = res.status
    throw err
  }
  return res.json()
}

export async function savePlannerProfile(userId, payload) {
  const res = await fetch(`/api/planner-profile/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = new Error(`Failed to save profile (${res.status})`)
    err.status = res.status
    throw err
  }
  return res.json()
}
