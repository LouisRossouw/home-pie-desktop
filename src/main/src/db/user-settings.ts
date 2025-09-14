import { SQL } from '@main/src/sql'
import { Setting } from '@shared/types'

import { db, logActivity } from '.'

async function getUserSetting({
  userId,
  key
}: {
  userId: number | string
  key: Setting
}): Promise<string | undefined> {
  logActivity(`getUserSetting user:${userId} key:${key}`)
  return db.prepare(SQL.getUserSettingSQL).get(userId.toString(), key)?.value ?? undefined
}

async function setUserSetting({
  userId,
  key,
  value
}: {
  userId: number | string
  key: string
  value?: string | number | boolean
}) {
  logActivity(`setUserSetting user:${userId} key:${key} value:${value}`)
  db.prepare(SQL.setUserSettingSQL).run(userId.toString(), key, JSON.stringify(value))
}

async function getAllUserSettings({ userId }: { userId: number | string }) {
  logActivity(`getAllUserSettings for user:${userId}`)
  return db.prepare(SQL.getAllUserSettingsSQL).all(userId.toString())
}

function deleteUserSetting({ key }: { key: string }) {
  logActivity(`deleteUserSetting ${key}`)
  db.prepare(SQL.deleteUserSettingSQL).run(key)
}

export { getUserSetting, setUserSetting, getAllUserSettings, deleteUserSetting }
