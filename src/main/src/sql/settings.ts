const initDatabaseSQL = `
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  )
`

const setSettingSQL = `
  INSERT INTO settings (key, value)
  VALUES (?, ?)
  ON CONFLICT(key) DO UPDATE SET value = excluded.value
`

const getSettingSQL = `SELECT value FROM settings WHERE key = ?`

const getAllSettingsSQL = `SELECT key, value FROM settings`

const deleteSettingSQL = `DELETE FROM settings WHERE key = ?`

export { initDatabaseSQL, setSettingSQL, getSettingSQL, deleteSettingSQL, getAllSettingsSQL }
