import { updateDotSquadActivity } from '@main/src/app'
import { handleError, requireSession } from '@main/src/session'
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
    const response = await apiClient.post(`/api/time-in-progress/${platform}/data`, {
      followers,
      following,
      likes
    })

    if (response.status === 200) {
      updateDotSquadActivity({ activity: 'simpleCheck' })
      return response.data
    }

    console.error('Something went wrong')

    return { ok: false }
  } catch (error) {
    handleError(error)
    return undefined
  }
}
