import { db, logActivity } from '.'
import { SQL } from '@main/src/sql'
import { decryptValue, encryptValue } from '@main/src/encrypt'

async function getSession({ userId, key }: { userId: number | string; key: string }) {
  logActivity(`getSession user:${userId} key:${key}`)
  const v = db.prepare(SQL.getSessionSQL).get(userId, key)?.value
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
  logActivity(`setSession user:${userId} key:${key}`)
  db.prepare(SQL.setSessionSQL).run(userId.toString(), key, encryptValue(JSON.stringify(value)))
}

async function getAllSessions({ userId }: { userId: number | string }) {
  logActivity(`getAllSessions for user:${userId}`)
  const rows = db.prepare(SQL.getAllSessionsSQL).all(userId.toString())
  const session: Record<string, any> = {}
  for (const row of rows) {
    session[row.key] = JSON.parse(decryptValue(row.value))
  }
  return session
}

async function deleteSession({ userId, key }: { userId: number | string; key: string }) {
  logActivity(`deleteSession user:${userId} key:${key}`)
  db.prepare(SQL.deleteSessionSQL).run(userId.toString(), key)
}

export { getSession, setSession, getAllSessions, deleteSession }
