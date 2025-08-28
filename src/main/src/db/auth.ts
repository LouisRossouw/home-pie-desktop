import { db, logActivity } from '.'
import { decryptValue, encryptValue } from '../encrypt'
import { SQL } from '../sql'

async function getAuth({ key }: { key: string }) {
  logActivity(`getAuth ${key}`)
  const v = db.prepare(SQL.getAuthSQL).get(key)?.value
  return v ? decryptValue(v) : undefined
}

async function setAuth({ key, value }: { key: string; value?: string | number | boolean }) {
  logActivity(`setAuth ${key} - ${value}`)
  db.prepare(SQL.setAuthSQL).run(key, encryptValue(JSON.stringify(value)))
}

export { db, getAuth, setAuth }
