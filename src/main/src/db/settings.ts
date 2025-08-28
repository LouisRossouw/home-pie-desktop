import { SQL } from '../sql'
import { Setting } from '@shared/types'
import { getAllSettingsSQL } from '../sql/settings'
import { db, logActivity } from '.'

async function getSetting({ key }: { key: Setting }): Promise<string | undefined> {
  logActivity(`getSetting ${key}`)
  return db.prepare(SQL.getSettingSQL).get(key)?.value ?? undefined
}

async function setSetting({ key, value }: { key: string; value?: string | number | boolean }) {
  logActivity(`setSetting ${key} - ${value}`)
  db.prepare(SQL.setSettingSQL).run(key, JSON.stringify(value))
}

async function getAllSettings() {
  logActivity(`getAllSettings`)
  return db.prepare(getAllSettingsSQL).all()
}

function deleteSetting({ key }: { key: string }) {
  logActivity(`setSetting ${key}`)
  db.prepare(SQL.deleteSettingSQL).run(key)
}

export { getSetting, setSetting, deleteSetting, getAllSettings }
