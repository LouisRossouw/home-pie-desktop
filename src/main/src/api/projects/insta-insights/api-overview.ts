import { updateDotSquadActivity } from '@main/src/app'
import { handleError, requireSession } from '@main/src/session'
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
    const response = await apiClient.get('/api/insta-insights/overview', {
      params: {
        accounts: JSON.stringify(accounts),
        platform,
        range,
        interval
      }
    })

    if (response.status === 200) {
      updateDotSquadActivity({ activity: 'selectProject' })
      return response.data
    }

    console.error('Something went wrong')

    return { ok: false }
  } catch (error) {
    handleError(error)
    return undefined
  }
}
