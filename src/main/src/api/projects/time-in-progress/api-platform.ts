import { updateDotSquadActivity } from '@main/src/app'
import { requireSession } from '@main/src/session'
import { ApiTimeInProgressInsertHistoricalData } from '@shared/types'

export async function apiTimeInProgressInsertHistoricalData({
  platform,
  followers,
  following,
  // posts,
  likes
  // videos,
  // subscribers,
  // views
}: ApiTimeInProgressInsertHistoricalData) {
  const apiClient = await requireSession()

  try {
    const { response, data } = await apiClient.POST(`/api/time-in-progress/{platform}/data`, {
      params: {
        path: { platform },
        query: { followers, following, likes }
      }
    })

    if (response.status === 200) {
      updateDotSquadActivity({ activity: 'simpleCheck' })
      return data
    }

    console.error('Something went wrong')

    return { ok: false }
  } catch (error) {
    return undefined
  }
}
