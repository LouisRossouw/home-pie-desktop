import { requireSession } from '@main/src/session'
import { updateDotSquadActivity } from '@main/src/app'

export async function apiTest() {
  const apiClient = await requireSession()

  const response = await apiClient.get('/api/timeinprogress/overview-data', {
    headers: { 'Content-Type': 'application/json' }
  })

  if (response.status === 200) {
    updateDotSquadActivity({ activity: 'singleBlink' })
    return { ok: true, data: response.data }
  }

  console.error('Something went wrong')

  return { ok: false }
}
