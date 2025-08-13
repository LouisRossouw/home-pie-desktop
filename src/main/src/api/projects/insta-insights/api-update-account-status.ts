import { updateDotSquadActivity } from '@main/src/app'
import { handleError, requireSession } from '@main/src/session'

export async function apiInstaInsightsUpdateAccountStatus({
  account,
  active
}: {
  account: string
  active: boolean
}) {
  const apiClient = await requireSession()

  try {
    const response = await apiClient.patch(`/api/insta-insights/accounts/${account}`, {
      active
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
