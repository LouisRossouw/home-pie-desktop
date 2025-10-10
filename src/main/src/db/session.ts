import { db, logActivity } from '.'

import type * as T from '@shared/types'

import { SQL } from '@main/src/sql'
import { decryptValue, encryptValue } from '@main/src/encrypt'

async function getSession(v: T.GetSession): T.ResGetSession {
  logActivity(`getSession user:${v.userId} key:${v.key}`)
  const value = db.prepare(SQL.getSessionSQL).get(v.userId.toString(), v.key)?.value
  return value ? JSON.parse(decryptValue(value)) : undefined
}

async function setSession(v: T.SetSession) {
  logActivity(`setSession user:${v.userId} key:${v.key} value:${v.value}`)
  db.prepare(SQL.setSessionSQL).run(
    v.userId.toString(),
    v.key,
    encryptValue(JSON.stringify(v.value))
  )
}

async function getAllUserSessions(v: T.GetAllUserSessions): T.ResGetAllUserSessions {
  logActivity(`getAllUserSessions for user:${v.userId}`)
  const rows = db.prepare(SQL.getAllUserSessionsSQL).all(v.userId.toString())
  const session: Record<string, any> = {}

  for (const row of rows) {
    session[row.key] = JSON.parse(decryptValue(row.value))
  }
  return session
}

async function getAllSessions(): T.ResgetAllSessions {
  logActivity(`getAllSessions`)
  const rows = db.prepare(SQL.getAllSessionsSQL).all()

  const sessions: T.SessionsSQL[] = []
  for (const row of rows) {
    sessions.push({ userId: row.userId, key: row.key, value: JSON.parse(decryptValue(row.value)) })
  }
  return sessions
}

async function getSessionByUserEmail(v: T.GetSessionByUserEmail): T.ResGetSessionByUserEmail {
  logActivity(`getSessionByUserEmail userEmail: ${v.userEmail}`)
  const encryptedRows = db.prepare(SQL.getSessionByUserEmailSQL).all()

  const rows: T.SessionsSQL[] = []

  for (const r of encryptedRows) {
    rows.push({ userId: r.userId, key: r.key, value: JSON.parse(decryptValue(r.value)) })
  }

  const maybeRow = rows.filter((item) => item?.value === v.userEmail)[0]

  return maybeRow
}

async function deleteUserSessions(v: T.DeleteUserSessions): T.ResDeleteUserSessions {
  logActivity(`deleteUserSessions user:${v.userId}`)
  db.prepare(SQL.deleteUserSessionsSQL).run(v.userId.toString())
  return true
}

export {
  getSession,
  setSession,
  getAllSessions,
  getAllUserSessions,
  getSessionByUserEmail,
  deleteUserSessions
}
