import { updateDotSquadActivity } from '@main/src/app'
import { requireSession } from '@main/src/session'

export async function apiYTInsightsGetAllAccounts() {
  const apiClient = await requireSession()

  try {
    const { response, data } = await apiClient.GET('/api/yt-insights/accounts')

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
