import { getApiBaseURL } from '@shared/constants'
import { paths } from '@shared/lib/generated/api'
import { ApiCompleteAuth } from '@shared/types'

export async function apiGetCompleteAuthentication({ loginKey }: ApiCompleteAuth) {
  const { default: createClient } = await import('openapi-fetch')

  const apiClient = createClient<paths>({
    baseUrl: getApiBaseURL,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const { response, data } = await apiClient.GET('/auth/login-key/{key}', {
    params: {
      path: { key: loginKey }
    }
  })

  if (response.status === 200) {
    return data
  }

  return undefined
}
