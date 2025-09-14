import { updateDotSquadActivity } from '@main/src/app'
import { getApiBaseURL } from '@shared/constants'
import { paths } from '@shared/lib/generated/api'

export async function apiGetLoginKey() {
  const { default: createClient } = await import('openapi-fetch')

  const apiClient = createClient<paths>({
    baseUrl: getApiBaseURL,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const { response, data } = await apiClient.POST('/auth/login-key')

  if (response.status === 201) {
    updateDotSquadActivity({ activity: 'singleBlink' })
    return data?.loginKey
  }

  console.error('Something went wrong with get login key')

  return undefined
}
