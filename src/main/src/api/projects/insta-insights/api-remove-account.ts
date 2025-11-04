import { updateDotSquadActivity } from '@main/src/app'
import { requireSession } from '@main/src/session'

export async function apiInstaInsightsRemoveAccount({ account }: { account: string }) {
  const apiClient = await requireSession()

  try {
    const { response, data } = await apiClient.DELETE(
      '/api/insta-insights/accounts/{accountName}',
      {
        params: {
          path: {
            accountName: account
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
