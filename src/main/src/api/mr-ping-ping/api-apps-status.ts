import { updateDotSquadActivity } from '@main/src/app'
import { handleError, requireSession } from '@main/src/session'

// TODO; Rename
export async function apiMrPingPingAppsStatus() {
  const apiClient = await requireSession()

  try {
    const response = await apiClient.get(`/api/mr-ping-ping/apps/status`)

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
