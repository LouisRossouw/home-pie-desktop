import { updateDotSquadActivity } from '@main/src/app'
import { requireSession } from '@main/src/session'

export async function apiGenGenCheckProgress({ project }: { project: string }) {
  const apiClient = await requireSession()

  try {
    const { response, data } = await apiClient.GET('/api/gengen/check-progress', {
      params: { query: { project } }
    })

    if (response.status === 200) {
      updateDotSquadActivity({ activity: 'simpleCheck' })
      return data
    }

    console.error('Something went wrong')

    return { ok: false }
  } catch (error) {
    return undefined
  }
}
