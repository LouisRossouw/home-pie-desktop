const table = 'settings'

const initSettingsDatabaseSQL = `
  CREATE TABLE IF NOT EXISTS ${table} (
    key TEXT PRIMARY KEY,
    value TEXT
  )
`

const setSettingSQL = `
  INSERT INTO ${table} (key, value)
  VALUES (?, ?)
  ON CONFLICT(key) DO UPDATE SET value = excluded.value
`

const getSettingSQL = `SELECT value FROM ${table} WHERE key = ?`

const getAllSettingsSQL = `SELECT key, value FROM ${table}`

const deleteSettingSQL = `DELETE FROM ${table} WHERE key = ?`

export {
  initSettingsDatabaseSQL,
  setSettingSQL,
  getSettingSQL,
  deleteSettingSQL,
  getAllSettingsSQL
}
