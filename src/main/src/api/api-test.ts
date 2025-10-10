import { requireSession } from '@main/src/session'
import { updateDotSquadActivity } from '@main/src/app'

let ledStatus = false

export async function apiTest() {
  const apiClient = await requireSession()

  const { response, data } = await apiClient.GET('/api/timeinprogress/overview-data', {
    headers: { 'Content-Type': 'application/json' }
  })

  if (response.status === 200) {
    updateDotSquadActivity({ activity: 'singleBlink' })
    return { ok: true, data: data }
  }

  console.error('Something went wrong')

  return { ok: false }
}
