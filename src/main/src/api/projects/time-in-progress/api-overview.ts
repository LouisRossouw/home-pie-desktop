import { ApiTimeInProgressOverview } from '@shared/types'

import { updateDotSquadActivity } from '@main/src/app'
import { requireSession } from '@main/src/session'

export async function apiTimeInProgressOverview({
  account,
  range,
  interval
}: ApiTimeInProgressOverview) {
  const apiClient = await requireSession()

  try {
    const { response, data } = await apiClient.GET('/api/time-in-progress/overview', {
      params: { query: { account, range, interval } }
    })

    if (response.status === 200) {
      updateDotSquadActivity({ activity: 'selectProject' })
      return data
    }

    console.error('Something went wrong')

    return { ok: false }
  } catch (error) {
    return undefined
  }
}
