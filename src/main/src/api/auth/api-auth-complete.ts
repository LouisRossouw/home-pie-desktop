import { updateDotSquadActivity } from '@main/src/app'
import { getApiBaseURL } from '@shared/constants'

import { paths } from '@shared/lib/generated/api'
import { ApiCompleteAuth } from '@shared/types'

// Completes the auth process; calls the API with the loginKey, and the API
// Returns the correct loginKey with the accociated user, and returns the
// access_token and users profile.

export async function apiCompleteAuthentication({ loginKey }: ApiCompleteAuth) {
  const { default: createClient } = await import('openapi-fetch')

  const apiClient = createClient<paths>({
    baseUrl: getApiBaseURL,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  // Remove quotes if they exist
  const cleanKey = loginKey.replace(/^"|"$/g, '')

  const { response, data } = await apiClient.GET('/auth/login-key/{key}', {
    params: {
      path: { key: cleanKey }
    }
  })

  if (response.status === 200) {
    updateDotSquadActivity({ activity: 'singleBlink' })
    return data
  }

  console.error('Something went wrong with get login key')

  return undefined
}
