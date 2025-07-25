import axios from 'axios'

import { mainWindow } from '@main/.'
import { getBaseURl } from '@shared/api'
import { getOAuthClients } from '@shared/auth'

export const baseURL = getBaseURl()
const OauthClient = getOAuthClients()

export async function requireSession(requireAuth: boolean = true) {
  // const token = '1234' // TODO; get from storage.

  const validToken = 'TODO' // Temp
  // let validToken: string | undefined

  // if (requireAuth && token) {
  //   validToken = await checkAccessToken(token)
  //   if (!validToken) {
  //     throw new Error('No valid token available')
  //   }
  // }

  const apiClient = axios.create({
    baseURL,
    headers: {
      ...(validToken ? { Authorization: `Bearer ${validToken}` } : {})
    }
  })

  return apiClient
}

export async function checkAccessToken(accessToken: string): Promise<string | undefined> {
  if (accessToken && !isTokenExpired()) {
    return accessToken
  }

  // TODO
  const refreshToken = undefined
  // const refreshToken = TODO; Get from storage
  if (refreshToken) {
    const response = await refreshTokenFunction(refreshToken)
    if (response?.access_token) {
      updateTokens(response)
      return response.access_token
    }
  }

  return undefined
}

export function isTokenExpired() {
  try {
    // TODO;
    const expiresAtstr = undefined
    // const expiresAtstr = TODO; Get from storage
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

export async function refreshTokenFunction(refreshToken: string) {
  console.log('Refreshing accessToken')

  // TODO;
  const userDataStr = undefined
  // const userDataStr = TODO; Get from storage
  const userData = userDataStr ? JSON.parse(userDataStr) : undefined

  const auth_type = userData?.auth_type

  const clientId = auth_type === '' ? OauthClient!.MANUAL_CLIENT_ID : OauthClient!.GOOGLE_CLIENT_ID

  const response = await fetch(`${baseURL}/auth/token`, {
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
