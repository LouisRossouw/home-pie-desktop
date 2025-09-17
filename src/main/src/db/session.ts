import { db, logActivity } from '.'
import { SQL } from '@main/src/sql'
import { decryptValue, encryptValue } from '@main/src/encrypt'
import { SessionsSQL } from '@shared/types'

async function getSession({ userId, key }: { userId: number | string; key: string }) {
  logActivity(`getSession user:${userId} key:${key}`)
  const v = db.prepare(SQL.getSessionSQL).get(userId.toString(), key)?.value
  return v ? JSON.parse(decryptValue(v)) : undefined
}

async function setSession({
  userId,
  key,
  value
}: {
  userId: number | string
  key: string
  value?: string | number | boolean | object
}) {
  logActivity(`setSession user:${userId} key:${key} value:${value}`)
  db.prepare(SQL.setSessionSQL).run(userId.toString(), key, encryptValue(JSON.stringify(value)))
}

async function getAllUserSessions({ userId }: { userId: number | string }) {
  logActivity(`getAllUserSessions for user:${userId}`)
  const rows = db.prepare(SQL.getAllUserSessionsSQL).all(userId.toString())
  const session: Record<string, any> = {}

  for (const row of rows) {
    session[row.key] = JSON.parse(decryptValue(row.value))
  }
  return session
}

async function getAllSessions() {
  logActivity(`getAllSessions`)
  const rows = db.prepare(SQL.getAllSessionsSQL).all()

  const sessions: SessionsSQL[] = []
  for (const row of rows) {
    sessions.push({ userId: row.userId, key: row.key, value: JSON.parse(decryptValue(row.value)) })
  }
  return sessions
}

async function getSessionByUserEmail({ userEmail }: { userEmail: string }) {
  logActivity(`getSessionByUserEmail userEmail: ${userEmail}`)
  const encryptedRows = db.prepare(SQL.getSessionByUserEmailSQL).all()

  const rows: SessionsSQL[] = []

  for (const r of encryptedRows) {
    rows.push({ userId: r.userId, key: r.key, value: JSON.parse(decryptValue(r.value)) })
  }

  const maybeRow = rows.filter((item) => item?.value === userEmail)[0]

  return maybeRow
}

async function deleteSession({ userId, key }: { userId: number | string; key: string }) {
  logActivity(`deleteSession user:${userId} key:${key}`)
  db.prepare(SQL.deleteSessionSQL).run(userId.toString(), key)
}

async function deleteUserSessions({ userId }: { userId: number | string }) {
  logActivity(`deleteUserSessions user:${userId}`)
  db.prepare(SQL.deleteUserSessionsSQL).run(userId.toString())
  return true
}

export {
  getSession,
  setSession,
  getAllUserSessions,
  getAllSessions,
  deleteSession,
  getSessionByUserEmail,
  deleteUserSessions
}
