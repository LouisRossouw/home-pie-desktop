import { db } from './index'
import { SQL } from '../sql'

export async function getFinanceSetting(key: string) {
  const row = db.prepare(SQL.getFinanceSettingSQL).get(key) as { value: string } | undefined
  return row ? JSON.parse(row.value) : undefined
}

export async function setFinanceSetting(key: string, value: any) {
  const stringifiedValue = JSON.stringify(value)
  return db.prepare(SQL.setFinanceSettingSQL).run(key, stringifiedValue)
}

export async function getAllFinanceSettings() {
  const rows = db.prepare(SQL.getAllFinanceSettingsSQL).all() as { key: string; value: string }[]
  return rows.reduce(
    (acc, row) => {
      acc[row.key] = JSON.parse(row.value)
      return acc
    },
    {} as Record<string, any>
  )
}

// ** Records (Historical)
export async function getFinanceRecord(month: number, year: number) {
  const row = db.prepare(SQL.getFinanceRecordSQL).get(month, year) as { value: string } | undefined
  return row ? JSON.parse(row.value) : undefined
}

export async function setFinanceRecord(month: number, year: number, value: any) {
  const stringifiedValue = JSON.stringify(value)
  return db.prepare(SQL.setFinanceRecordSQL).run(month, year, stringifiedValue)
}

export async function getAllFinanceRecords() {
  const rows = db.prepare(SQL.getAllFinanceRecordsSQL).all() as {
    month: number
    year: number
    value: string
  }[]
  return rows.map((row) => ({
    month: row.month,
    year: row.year,
    data: JSON.parse(row.value)
  }))
}


export async function deleteFinanceSetting(key: string) {
  return db.prepare(SQL.deleteFinanceSettingSQL).run(key)
}
