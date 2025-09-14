import { updateDotSquadActivity } from '@main/src/app'
import { requireSession } from '@main/src/session'

export async function apiInstaInsightsUpdateAccountStatus({
  account,
  active
}: {
  account: string
  active: boolean
}) {
  const apiClient = await requireSession()

  try {
    const { response, data } = await apiClient.PATCH(
      '/api/insta-insights/accounts/{account_name}',
      {
        params: {
          path: { account_name: account },
          query: {
            active
          }
        }
      }
    )
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
