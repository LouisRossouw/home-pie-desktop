import { useState } from 'react'
import { useNavigate } from 'react-router'
import { QueryClient } from '@tanstack/react-query'

import {
  Schemas,
  UserSetting,
  SessionAccess,
  UserSessionKey,
  SessionAccessKey
} from '@shared/types'
import { generatedUserId, SessionKey } from '@shared/constants'
import { defaultUserSettings } from '@shared/default-app-settings'

import { useApp } from '~/libs/context/app'
import { useAppSession } from '~/libs/context/session'

type Value = string | boolean | number | undefined
type AvailableAccounts = { userId: number; email: string; active: boolean }[] | undefined
type AuthResponse = Schemas['CustomTokenResponse'] & { application: string }
type UserSession = Schemas['CustomUser']

export function useAccounts() {
  const navigate = useNavigate()
  const queryClient = new QueryClient()

  const APP = useApp()
  const SSN = useAppSession()

  const [availableAccounts, setAvailableAccounts] = useState<AvailableAccounts>(undefined)

  async function switchUserAccount({ userId }) {
    const { ids } = await SSN.getAllExistingSessionIds()

    if (ids.includes(userId)) {
      // Get current active users active token and check if it's not expired.
      const maybeAccessToken = await window.api.db.getSession({
        key: SessionKey.accessToken,
        userId
      })

      if (maybeAccessToken) {
        const validToken = await window.api.db.checkAccessToken({
          accessToken: maybeAccessToken,
          userId
        })

        if (validToken) {
          const hasUpdateSession = await SSN.switchUserSession({ userId })
          const hasUpdatedSettings = await APP.updateAppSettings([
            { setting: 'activeAccountId', value: userId }
          ])

          queryClient.clear()
          navigate('/')
          return hasUpdateSession && hasUpdatedSettings
        }

        // If active users access token & refresh token is expired then find next active session.
        const maybeNexValidAccessToken = await window.api.db.findNextActiveAccessToken()

        if (maybeNexValidAccessToken) {
          const hasUpdateSession = await SSN.switchUserSession({
            userId: maybeNexValidAccessToken.userId
          })
          const hasUpdatedSettings = await APP.updateAppSettings([
            { setting: 'activeAccountId', value: maybeNexValidAccessToken.userId }
          ])

          queryClient.clear()
          navigate('/')
          return hasUpdateSession && hasUpdatedSettings
        }

        return false
      }

      console.error('Something went wrong switching accounts!')

      return false
    }
    return false
  }

  async function loadAvailableAccounts() {
    const { ids } = await SSN.getAllExistingSessionIds()

    const accounts = await Promise.all(
      ids.map(async (id) => {
        const active = await SSN.getSession({ userId: id, key: 'active' })
        const email = (await SSN.getSession({ userId: id, key: 'email' })) ?? ''

        return { userId: id, active, email }
      })
    )

    setAvailableAccounts(accounts)
    return accounts
  }

  async function handleUpdateSession({
    accessSession,
    userSession,
    userId
  }: {
    userId: number
    userSession: UserSession
    accessSession: SessionAccess
  }) {
    for (const key in userSession) {
      const k = key as UserSessionKey
      await SSN.updateUserSession([{ userId, session: k, value: userSession[key] }])
    }

    for (const key in accessSession) {
      const k = key as SessionAccessKey
      await SSN.updateAccessSession([{ userId, session: k, value: accessSession[key] }])
    }
  }

  async function loginAccount(data: AuthResponse) {
    try {
      const issuedAt = Date.now()
      const expiresAt = issuedAt + data.expiresIn * 1000

      const accessSession = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        application: data.application,
        expiresIn: expiresAt,
        expires: data.expires,
        active: true
      }

      const userSession = {
        ...data.user
      }

      APP.setIsAuth(true)
      const sessionAlreadyExists = await SSN.getSessionByUserEmail({ userEmail: userSession.email })

      if (sessionAlreadyExists) {
        const userId = parseInt(sessionAlreadyExists.userId)
        await APP.updateAppSettings([{ setting: 'activeAccountId', value: userId }])
        await handleUpdateSession({ userId, accessSession, userSession })
        return true
      }

      const { nextAvailableId } = await SSN.getAllExistingSessionIds()

      const userId = nextAvailableId ?? (APP.appSettings?.activeAccountId as number)

      await APP.updateAppSettings([{ setting: 'activeAccountId', value: userId }])
      await handleUpdateSession({ userId, accessSession, userSession })

      // Add settings for the new user account
      let newSettings: { newUserId: number; setting: UserSetting; value: Value }[] = []

      defaultUserSettings.forEach(async ({ key, value }) => {
        newSettings.push({ newUserId: userId, setting: key, value })
      })

      await APP.updateUserSettings(newSettings)

      return true
    } catch (err) {
      return false
    }
  }

  async function logoutAccount({ userId }: { userId: number }) {
    const activeAccounts = availableAccounts?.filter((item) => item.active)

    // Remove and nav to /login if there is no other active account
    if (activeAccounts && activeAccounts?.length <= 1) {
      await APP.updateAppSettings([{ setting: 'activeAccountId', value: generatedUserId }])
      await SSN.updateAccessSession([{ userId, session: 'active', value: false }])
      APP.setIsAuth(false)
      queryClient.clear()
      return navigate('/login')
    }

    const nextAccount = availableAccounts?.filter(
      (item) => item.active && item.userId !== APP.appSettings?.activeAccountId
    )

    const nextUserId = nextAccount ? nextAccount[0].userId : undefined

    // Switch to the next account if active.
    if (nextUserId !== undefined) {
      await SSN.switchUserSession({ userId: nextUserId })
      await SSN.updateAccessSession([{ userId, session: 'active', value: false }])
      await APP.updateAppSettings([{ setting: 'activeAccountId', value: nextUserId }])
      return navigate('/') // TODO; Navigate to users saved route
    }

    console.error('Something went wrong with logging out.')

    return
  }

  async function addAnotherAccount() {
    navigate('/login?intent=add-account')
  }

  return {
    account: SSN.session,
    availableAccounts,
    switchUserAccount,
    loadAvailableAccounts,
    addAnotherAccount,
    loginAccount,
    logoutAccount
  }
}
