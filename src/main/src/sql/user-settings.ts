const table = 'userSetting'

const initUserSettingsDatabaseSQL = `
  CREATE TABLE IF NOT EXISTS ${table} (
    userId TEXT NOT NULL,
    key TEXT NOT NULL,
    value TEXT,
    PRIMARY KEY (userId, key)
  )
`

const setUserSettingSQL = `
  INSERT INTO ${table} (userId, key, value)
  VALUES (?, ?, ?)
  ON CONFLICT(userId, key) DO UPDATE SET value = excluded.value
`

const getUserSettingSQL = `
  SELECT value FROM ${table} WHERE userId = ? AND key = ?
`

const getAllUserSettingsSQL = `
SELECT userId, key, value FROM ${table} WHERE userId = ?
`

const deleteUserSettingSQL = `
  DELETE FROM ${table} WHERE userId = ? AND key = ?
`
const deleteUserSettingsSQL = `
  DELETE FROM ${table} WHERE userId = ?
`
export {
  initUserSettingsDatabaseSQL,
  setUserSettingSQL,
  getUserSettingSQL,
  getAllUserSettingsSQL,
  deleteUserSettingSQL,
  deleteUserSettingsSQL
}
