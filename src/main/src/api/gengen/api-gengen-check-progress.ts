import { updateDotSquadActivity } from '@main/src/app'
import { handleError, requireSession } from '@main/src/session'

export async function apiGenGenCheckProgress({ project }: { project: string }) {
  const apiClient = await requireSession()

  try {
    const response = await apiClient.get('/api/gengen/check-progress', {
      headers: { 'Content-Type': 'application/json' },
      params: { project }
    })

    if (response.status === 200) {
      updateDotSquadActivity({ activity: 'simpleCheck' })
      return response.data
    }

    console.error('Something went wrong')

    return { ok: false }
  } catch (error) {
    handleError(error)
    return undefined
  }
}
