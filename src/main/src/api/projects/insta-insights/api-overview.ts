import { updateDotSquadActivity } from '@main/src/app'
import { requireSession } from '@main/src/session'
import { Range } from '@shared/types'

export async function apiInstaInsightsGetAccountsOverview({
  accounts,
  range,
  interval,
  platform
}: {
  accounts: string[]
  range: Range
  interval: number
  platform: string
}) {
  const apiClient = await requireSession()

  try {
    const { response, data } = await apiClient.GET('/api/insta-insights/overview', {
      params: {
        query: {
          accounts,
          platform,
          range,
          interval
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
