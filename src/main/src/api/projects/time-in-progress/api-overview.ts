import { ApiTimeInProgressOverview } from '@shared/types'

import { updateDotSquadActivity } from '@main/src/app'
import { handleError, requireSession } from '@main/src/session'

export async function apiTimeInProgressOverview({
  account,
  range,
  interval
}: ApiTimeInProgressOverview) {
  const apiClient = await requireSession()

  try {
    const response = await apiClient.get('/api/timeinprogress/overview-data', {
      headers: { 'Content-Type': 'application/json' },
      params: { account, range, interval }
    })

    if (response.status === 200) {
      updateDotSquadActivity({ activity: 'selectProject' })
      return response.data
    }

    console.error('Something went wrong')

    return { ok: false }
  } catch (error) {
    handleError(error)
    return undefined
  }
}
