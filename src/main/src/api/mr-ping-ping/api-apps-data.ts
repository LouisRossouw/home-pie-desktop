import { updateDotSquadActivity } from '@main/src/app'
import { requireSession } from '@main/src/session'
import { Range } from '@shared/types'

// TODO; Rename
export async function apiMrPingPingAppsData({
  appName,
  range,
  interval
}: {
  appName: string
  range: Range
  interval: number
}) {
  const apiClient = await requireSession()

  try {
    const { response, data } = await apiClient.GET(`/api/mr-ping-ping/apps/data/{appName}`, {
      params: { path: { appName }, query: { range, interval } }
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
