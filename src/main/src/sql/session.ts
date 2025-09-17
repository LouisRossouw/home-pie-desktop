const table = 'session'

const initSessionDatabaseSQL = `
  CREATE TABLE IF NOT EXISTS ${table} (
    userId TEXT NOT NULL,
    key TEXT NOT NULL,
    value TEXT,
    PRIMARY KEY (userId, key)
  )
`

const setSessionSQL = `
  INSERT INTO ${table} (userId, key, value)
  VALUES (?, ?, ?)
  ON CONFLICT(userId, key) DO UPDATE SET value = excluded.value
`

const getSessionSQL = `
  SELECT value FROM ${table} WHERE userId = ? AND key = ?
`

// const getAllSessionsSQL = `
//   SELECT userId, key, value FROM ${table}
// `
const getAllUserSessionsSQL = `
  SELECT key, value FROM  ${table} WHERE userId = ?
`

const getAllSessionsSQL = `
SELECT userId, key, value FROM ${table}
`

const getSessionByUserEmailSQL = `
  SELECT *
  FROM ${table}
  WHERE key = 'email'
`

const deleteSessionSQL = `
  DELETE FROM ${table} WHERE userId = ? AND key = ?
`

const deleteUserSessionsSQL = `
  DELETE FROM ${table} WHERE userId = ?
`

export {
  initSessionDatabaseSQL,
  setSessionSQL,
  getSessionSQL,
  getAllUserSessionsSQL,
  getAllSessionsSQL,
  deleteSessionSQL,
  getSessionByUserEmailSQL,
  deleteUserSessionsSQL
}
