import { SQL } from '@main/src/sql'

import type * as T from '@shared/types'

import { db, logActivity } from '.'

async function getCoreSetting(v: T.GetCoreSetting): T.ResGetCoreSetting {
  logActivity(`getCoreSetting ${v.key}`)
  return db.prepare(SQL.getCoreSettingSQL).get(v.key)?.value ?? undefined
}

async function setCoreSetting(v: T.SetCoreSetting) {
  logActivity(`setCoreSetting ${v.key} - ${v.value}`)
  db.prepare(SQL.setCoreSettingSQL).run(v.key, JSON.stringify(v.value))
}

async function getAllCoreSettings(): T.ResGetAllCoreSettings {
  logActivity(`getAllCoreSettings`)
  return db.prepare(SQL.getAllCoreSettingsSQL).all()
}

export { getCoreSetting, setCoreSetting, getAllCoreSettings }
