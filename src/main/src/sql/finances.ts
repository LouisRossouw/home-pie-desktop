export const initFinanceDatabaseSQL = `
  CREATE TABLE IF NOT EXISTS financeSetting (
    key TEXT PRIMARY KEY,
    value TEXT
  );
  CREATE TABLE IF NOT EXISTS financeRecord (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    value TEXT NOT NULL,
    UNIQUE(month, year)
  );
`

export const setFinanceSettingSQL = `
  INSERT OR REPLACE INTO financeSetting (key, value) VALUES (?, ?);
`

export const getFinanceSettingSQL = `
  SELECT value FROM financeSetting WHERE key = ?;
`

export const getAllFinanceSettingsSQL = `
  SELECT key, value FROM financeSetting;
`

export const deleteFinanceSettingSQL = `
  DELETE FROM financeSetting WHERE key = ?;
`

// ** Finance Records (Historical)
export const setFinanceRecordSQL = `
  INSERT OR REPLACE INTO financeRecord (month, year, value) VALUES (?, ?, ?);
`

export const getFinanceRecordSQL = `
  SELECT value FROM financeRecord WHERE month = ? AND year = ?;
`

export const getAllFinanceRecordsSQL = `
  SELECT month, year, value FROM financeRecord ORDER BY year DESC, month DESC;
`

export const deleteFinanceRecordSQL = `
  DELETE FROM financeRecord WHERE month = ? AND year = ?;
`

