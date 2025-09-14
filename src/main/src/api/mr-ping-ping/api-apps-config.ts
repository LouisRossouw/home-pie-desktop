import { updateDotSquadActivity } from '@main/src/app'
import { requireSession } from '@main/src/session'

// TODO; Rename
export async function apiMrPingPingAppsConfig() {
  const apiClient = await requireSession()

  try {
    const { response, data } = await apiClient.GET(`/api/mr-ping-ping/apps/configs`)

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
