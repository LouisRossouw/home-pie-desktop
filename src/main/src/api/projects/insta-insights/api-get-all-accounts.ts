import { updateDotSquadActivity } from '@main/src/app'
import { handleError, requireSession } from '@main/src/session'

export async function apiInstaInsightsGetAllAccounts() {
  const apiClient = await requireSession()

  try {
    const response = await apiClient.get('/api/insta-insights/get-all-accounts', {
      headers: { 'Content-Type': 'application/json' }
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
