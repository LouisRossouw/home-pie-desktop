import { updateDotSquadActivity } from '@main/src/app'
import { handleError, requireSession } from '@main/src/session'

export async function apiInstaInsightsRemoveAccount({ account }: { account: string }) {
  const apiClient = await requireSession()

  try {
    const response = await apiClient.delete(`/api/insta-insights/accounts/${account}`)

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
