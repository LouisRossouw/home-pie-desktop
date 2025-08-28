const table = 'auth'

const initAuthDatabaseSQL = `
  CREATE TABLE IF NOT EXISTS ${table} (
    key TEXT PRIMARY KEY,
    value TEXT
  )
`

const setAuthSQL = `
  INSERT INTO ${table} (key, value)
  VALUES (?, ?)
  ON CONFLICT(key) DO UPDATE SET value = excluded.value
`

const getAuthSQL = `SELECT value FROM ${table} WHERE key = ?`

const getAllAuthSQL = `SELECT key, value FROM ${table}`

const deleteAuthSQL = `DELETE FROM ${table} WHERE key = ?`

export { initAuthDatabaseSQL, setAuthSQL, getAuthSQL, deleteAuthSQL, getAllAuthSQL }
