// import axios from 'axios'
import { paths } from '@shared/lib/generated/api'

import { mainWindow } from '@main/.'
import { getAllSessions, getSession, setSession } from './db/session'
import { appIpcKey, generatedUserId, getApiBaseURL, oAuthClients } from '@shared/constants'
import { getCoreSetting } from './db/core-settings'
import { getOauthClientForUserAuthType } from '@shared/auth'

export async function requireSession(requireAuth: boolean = true) {
  const { default: createClient } = await import('openapi-fetch')

  // TODO; What can we do to call the database less ?
  // I dont want to read the database everytime we do a request

  const userId = parseInt(
    (await getCoreSetting({ key: 'activeAccountId' })) ?? generatedUserId.toString()
  )
  const accessToken = await getSession({ userId, key: 'accessToken' })

  console.log('***** - Requiring the session yo ! userId', userId)

  let validToken: string | undefined

  if (requireAuth && accessToken) {
    validToken = await checkAccessToken({
      userId,
      accessToken
    })
    if (!validToken) {
      throw new Error('No valid token available')
    }
  }

  const apiClient = createClient<paths>({
    baseUrl: getApiBaseURL,
    headers: {
      ...(validToken ? { Authorization: `Bearer ${validToken}` } : {}),
      'Content-Type': 'application/json'
    }
  })

  return apiClient
}

export async function checkAccessToken({
  userId,
  accessToken
}: {
  userId: number
  accessToken?: string
}): Promise<string | undefined> {
  if (accessToken && !(await isTokenExpired({ userId }))) {
    return accessToken
  }

  console.log('* Expired, getting refresh token')
  const refreshToken = (await getSession({ userId, key: 'refreshToken' })) ?? ''
  const newAccessToken = await checkRefreshToken({ userId, refreshToken })

  if (newAccessToken) {
    return newAccessToken
  }

  // Set the account active to false after failure to refresh tokens.
  await setSession({ userId, key: 'active', value: false })

  return undefined
}

async function checkRefreshToken({
  userId,
  refreshToken
}: {
  userId: number
  refreshToken: string
}): Promise<string | undefined> {
  if (refreshToken) {
    const response = await refreshTokenFunction({ userId, refreshToken })

    if (response?.accessToken) {
      updateTokens({ userId, response })
      return response.accessToken
    }
  }

  return undefined
}

export async function findNextActiveAccessToken(): Promise<
  { userId: number; accessToken: string } | undefined
> {
  // Find the next available account, try switch to that account.
  const { ids } = await getAllExistingSessionIds()
  if (ids.length === 0) return undefined

  for (const id of ids) {
    const isActive = await getSession({ userId: id, key: 'active' })

    if (isActive) {
      const accessToken = await getSession({ userId: id, key: 'accessToken' })

      if (accessToken && !(await isTokenExpired({ userId: id }))) {
        return { userId: id, accessToken }
      }

      const refreshToken = (await getSession({ userId: id, key: 'refreshToken' })) ?? ''
      const maybeAccessToken = await checkRefreshToken({ userId: id, refreshToken })

      if (maybeAccessToken) {
        return { userId: id, accessToken: maybeAccessToken }
      }
    }
  }

  return undefined
}

async function getAllExistingSessionIds() {
  const data = await getAllSessions()

  if (data.length === 0) {
    return { ids: [], nextAvailableId: undefined }
  }

  const uniqueUserIds = Array.from(new Set(data.map((item) => Number(item.userId))))

  return { ids: uniqueUserIds, nextAvailableId: generatedUserId }
}

export async function isTokenExpired({ userId }: { userId: number }) {
  try {
    const expiresAtstr = await getSession({ userId, key: 'expiresIn' })
    const expiresAt = expiresAtstr ? parseInt(expiresAtstr, 10) : undefined
    const minutesUntilExpiration = getMinutesUntilExpiration(expiresAt ?? 0)

    if (minutesUntilExpiration < 5) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.error('Invalid token:', error)
    return true
  }
}

let isRefreshing = false
let refreshPromise: Promise<any> | undefined = undefined

export async function refreshTokenFunction({
  userId,
  refreshToken
}: {
  userId: number
  refreshToken: string
}) {
  if (isRefreshing && refreshPromise) {
    return refreshPromise // Return same in-progress promise
  }

  isRefreshing = true
  refreshPromise = (async () => {
    console.log('Refreshing accessToken...')

    try {
      const authType = await getSession({ userId, key: 'authType' })

      const clientId = getOauthClientForUserAuthType({ authType })

      const response = await fetch(`${getApiBaseURL}/auth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refreshToken: refreshToken,
          grantType: 'refresh_token', // Expects snake case
          clientId
        })
      })

      if (!response.ok) {
        if ([400, 401].includes(response.status)) {
          console.error('Invalid or expired refresh token')
          // TODO; Dont force logout if other active accounts exists, instead switch to them?
          return mainWindow?.webContents.send(appIpcKey.navigateTo, {
            url: '/login?forceLogout=true'
          })
        } else {
          throw new Error(`Server error: ${response.status}`)
        }
      }
      const data = await response.json()
      return data
    } catch (err: any) {
      console.error('Token refresh failed', err.message || err)

      if (err.message.includes('invalid') || err.message.includes('expired')) {
        return mainWindow?.webContents.send(appIpcKey.navigateTo, {
          url: '/login?forceLogout=true'
        })
      }
    } finally {
      isRefreshing = false
      refreshPromise = undefined
    }
  })()

  return refreshPromise
}

export function getMinutesUntilExpiration(expiresAt: number) {
  const diff = expiresAt - Date.now()
  return Math.floor(diff / 1000 / 60) // minutesLeft
}

async function updateTokens({
  userId,
  response
}: {
  userId: number
  response: {
    accessToken: string
    expiresIn: number
    tokenType: string
    scope: string
    refreshToken: string
  }
}) {
  const expiresAt = Date.now() + response.expiresIn * 1000
  try {
    await setSession({ userId, key: 'active', value: true })
    await setSession({ userId, key: 'expiresIn', value: expiresAt.toString() })
    await setSession({ userId, key: 'accessToken', value: response.accessToken })
    await setSession({ userId, key: 'refreshToken', value: response.refreshToken })

    return true
  } catch (err) {
    console.error('Failed to update session with new tokens.')
    return false
  }
}
