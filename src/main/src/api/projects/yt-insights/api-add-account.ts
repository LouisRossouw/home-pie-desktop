import { updateDotSquadActivity } from '@main/src/app'
import { requireSession } from '@main/src/session'

export async function apiYTInsightsAddAccount({
  account,
  id,
  active
}: {
  account: string
  id: string
  active: boolean
}) {
  const apiClient = await requireSession()

  try {
    const { response, data } = await apiClient.POST('/api/yt-insights/accounts', {
      params: {
        query: { account, accountId: id, active }
      }
    })

    if (response.status === 201) {
      updateDotSquadActivity({ activity: 'selectProject' })
      return data
    }

    console.error('Something went wrong')

    return { ok: false }
  } catch (error) {
    return undefined
  }
}
