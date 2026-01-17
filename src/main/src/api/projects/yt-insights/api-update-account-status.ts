import { updateDotSquadActivity } from '@main/src/app'
import { requireSession } from '@main/src/session'

export async function apiYTInsightsUpdateAccountStatus({
  account,
  key,
  value
}: {
  account: string
  key: string
  value: string | boolean | number
}) {
  const apiClient = await requireSession()

  try {
    const { response, data } = await apiClient.PATCH('/api/yt-insights/accounts/{accountName}', {
      params: {
        path: { accountName: account },
        query: {
          key,
          value
        }
      }
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
