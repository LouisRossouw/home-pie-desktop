const table = 'coreSettings'

const initCoreSettingsDatabaseSQL = `
  CREATE TABLE IF NOT EXISTS ${table} (
    key TEXT PRIMARY KEY,
    value TEXT
  )
`

const setCoreSettingSQL = `
  INSERT INTO ${table} (key, value)
  VALUES (?, ?)
  ON CONFLICT(key) DO UPDATE SET value = excluded.value
`

const getCoreSettingSQL = `SELECT value FROM ${table} WHERE key = ?`

const getAllCoreSettingsSQL = `SELECT key, value FROM ${table}`

const deleteCoreSettingSQL = `DELETE FROM ${table} WHERE key = ?`

export {
  initCoreSettingsDatabaseSQL,
  setCoreSettingSQL,
  getCoreSettingSQL,
  getAllCoreSettingsSQL,
  deleteCoreSettingSQL
}
