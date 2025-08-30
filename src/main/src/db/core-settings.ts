import { SQL } from '@main/src/sql'
import { Setting } from '@shared/types'

import { db, logActivity } from '.'

async function getCoreSetting({ key }: { key: Setting }): Promise<string | undefined> {
  logActivity(`getCoreSetting ${key}`)
  return db.prepare(SQL.getCoreSettingSQL).get(key)?.value ?? undefined
}

async function setCoreSetting({ key, value }: { key: string; value?: string | number | boolean }) {
  logActivity(`setCoreSetting ${key} - ${value}`)
  db.prepare(SQL.setCoreSettingSQL).run(key, JSON.stringify(value))
}

async function getAllCoreSettings() {
  logActivity(`getAllCoreSettings`)
  return db.prepare(SQL.getAllCoreSettingsSQL).all()
}

function deleteCoreSetting({ key }: { key: string }) {
  logActivity(`setCoreSetting ${key}`)
  db.prepare(SQL.deleteCoreSettingSQL).run(key)
}

export { getCoreSetting, setCoreSetting, getAllCoreSettings, deleteCoreSetting }
