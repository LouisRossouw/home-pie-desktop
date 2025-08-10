import { updateDotSquadActivity } from '@main/src/app'
import { handleError, requireSession } from '@main/src/session'

export async function apiGenGenStart({ project }: { project: string }) {
  const apiClient = await requireSession()

  try {
    const response = await apiClient.post('/api/gengen/start', {
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
