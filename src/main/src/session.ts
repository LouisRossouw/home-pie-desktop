// import axios from 'axios'
import { paths } from '@shared/lib/generated/api'

import { mainWindow } from '@main/.'
import { getSession } from './db/session'
import { generatedUserId, getApiBaseURL, oAuthClients } from '@shared/constants'
import { getCoreSetting } from './db/core-settings'

export async function requireSession(requireAuth: boolean = true) {
  const { default: createClient } = await import('openapi-fetch')

  // TODO; What can we do to call the database less ?
  // I dont want to read the database everytime we do a request

  const userId = parseInt(
    (await getCoreSetting({ key: 'activeAccountId' })) ?? generatedUserId.toString()
  )
  const accessToken = await getSession({ userId, key: 'accessToken' })

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
  const refreshToken = await getSession({ userId, key: 'refreshToken' })

  if (refreshToken) {
    const response = await refreshTokenFunction({ userId, refreshToken })
    if (response?.access_token) {
      updateTokens(response)
      return response.access_token
    }
  }

  return undefined
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

export async function refreshTokenFunction({
  userId,
  refreshToken
}: {
  userId: number
  refreshToken: string
}) {
  console.log('Refreshing accessToken using refreshToken:', refreshToken)

  const auth_type = await getSession({ userId, key: 'auth_type' })

  const clientId =
    auth_type === '' ? oAuthClients!.MANUAL_CLIENT_ID : oAuthClients!.GOOGLE_CLIENT_ID

  const response = await fetch(`${getApiBaseURL}/auth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
      client_id: clientId
    })
  })
  if (!response.ok) {
    return mainWindow?.webContents.send('navigate-to', { url: '/login?forceLogout=true' })
  } else {
    const data = await response.json()
    return data
  }
}

export function getMinutesUntilExpiration(expiresAt: number) {
  const now = Date.now()
  const diff = expiresAt - now
  const minutesLeft = Math.floor(diff / 1000 / 60)
  return minutesLeft
}

type UserSession = any // TODO

export function saveUserToStorage(data: any, userSession: UserSession) {
  // TODO: add try catch errors, return true or false
  const issuedAt = Date.now()
  const expiresAt = issuedAt + data.expires_in * 1000

  // TODO;

  return true
}

export function removeUserFromStorage() {
  // TODO

  return true
}

function updateTokens(response: any) {
  const expiresAt = Date.now() + response.expires_in * 1000

  // TODO
}
