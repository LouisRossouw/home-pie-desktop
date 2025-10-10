import { useState } from 'react'
import { SessionsSQL, UserSessionKey, SessionAccessKey, Schemas } from '@shared/types'
import { generatedUserId } from '@shared/constants'

type Value = string | boolean | number | undefined
type UserSession = Schemas['CustomUser']

// prettier-ignore
export type UseSession = {
  session?: UserSession
  setSession: (v: UserSession) => void
  getSession: (v: { userId: number; key: UserSessionKey | SessionAccessKey }) => Promise<any>
  getAllExistingSessionIds: () => Promise<{ ids: number[]; nextAvailableId?: number }>
  getSessionByUserEmail: (v: { userEmail: string }) => Promise<SessionsSQL | undefined>
  updateAccessSession: (v: { userId: number; session: SessionAccessKey; value: Value }[]) => Promise<boolean>
  updateUserSession: (v: { userId: number; session: UserSessionKey; value: Value }[]) => Promise<boolean>
  loadUserSession: (v: { userId: number }) => Promise<UserSession | undefined>
  switchUserSession: (v: { userId: number }) => Promise<UserSession | undefined>
  deleteUserSessions: (v: { userId: number }) => Promise<boolean>
}

export function useSession() {
  const [session, setSession] = useState<UserSession | undefined>(undefined)

  async function getSession({
    userId,
    key
  }: {
    userId: number
    key: UserSessionKey | SessionAccessKey
  }) {
    return await window.api.db.getSession({ userId, key })
  }

  // Access related session, ie; AccessToken, refreshToken etc.
  async function updateAccessSession(
    sessions: { userId: number; session: SessionAccessKey; value: any }[]
  ) {
    for (const s of sessions) {
      await window.api.db.setSession({ userId: s.userId, key: s.session, value: s.value })
    }

    return true
  }

  // User related session, ie; username, email, is_staff etc.
  async function updateUserSession(
    sessions: { userId: number; session: UserSessionKey; value: any }[]
  ) {
    setSession((prevSession) => {
      const updatedSettings = { ...prevSession } as UserSession

      for (const s of sessions) {
        updatedSettings[s.session as string] = s.value
      }

      return updatedSettings
    })

    for (const s of sessions) {
      await window.api.db.setSession({ userId: s.userId, key: s.session, value: s.value })
    }

    return true
  }

  async function getAllExistingSessionIds() {
    const data = await window.api.db.getAllSessions()

    if (data.length === 0) {
      return { ids: [], nextAvailableId: undefined }
    }

    const uniqueUserIds = Array.from(new Set(data.map((item) => Number(item.userId))))

    return { ids: uniqueUserIds, nextAvailableId: generatedUserId }
  }

  async function loadUserSession({ userId }: { userId: number }) {
    // if (session) return session`

    const sessionArray = (await window.api.db.getAllUserSessions({ userId })) as any

    const { id, email, username, first_name, last_name, auth_type, is_staff } =
      sessionArray as UserSession

    const userSessionObj = {
      id,
      email,
      username,
      first_name,
      last_name,
      auth_type,
      is_staff
    }

    setSession(userSessionObj)

    return userSessionObj
  }

  async function getSessionByUserEmail({ userEmail }: { userEmail: string }) {
    return await window.api.db.getSessionByUserEmail({ userEmail })
  }

  async function switchUserSession({ userId }: { userId: number }) {
    return await loadUserSession({ userId })
  }

  async function deleteUserSessions({ userId }: { userId: number }) {
    return await window.api.db.deleteUserSessions({ userId })
  }

  return {
    session,
    setSession,
    getSession,
    loadUserSession,
    switchUserSession,
    updateUserSession,
    deleteUserSessions,
    updateAccessSession,
    getSessionByUserEmail,
    getAllExistingSessionIds
  }
}
