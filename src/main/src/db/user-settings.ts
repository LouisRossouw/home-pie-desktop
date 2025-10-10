import { SQL } from '@main/src/sql'

import type * as T from '@shared/types'

import { db, logActivity } from '.'

async function getUserSetting(v: T.GetUserSetting): T.ResGetUserSetting {
  logActivity(`getUserSetting user:${v.userId} key:${v.key}`)
  return db.prepare(SQL.getUserSettingSQL).get(v.userId.toString(), v.key)?.value ?? undefined
}

async function setUserSetting(v: T.SetUserSetting) {
  logActivity(`setUserSetting user:${v.userId} key:${v.key} value:${v.value}`)
  db.prepare(SQL.setUserSettingSQL).run(v.userId.toString(), v.key, JSON.stringify(v.value))
}

async function getAllUserSettings(v: T.GetAllUserSettings): T.ResGetAllUserSettings {
  logActivity(`getAllUserSettings for user:${v.userId}`)
  return db.prepare(SQL.getAllUserSettingsSQL).all(v.userId.toString())
}

export { getUserSetting, setUserSetting, getAllUserSettings }
