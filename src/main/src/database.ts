import path from 'path'
import { app } from 'electron'
import Database from 'better-sqlite3'

const fs = require('fs')
import { SQL } from './sql'

const userPath = app.getPath('userData')

const dbName = 'homepie.db'
const dbPath = path.join(userPath, dbName)

const db = new Database(dbPath)
export const dbExists = fs.existsSync(dbPath)

db.pragma('journal_mode = WAL') // it is generally important to set the WAL pragma for performance reasons. https://github.com/WiseLibs/better-sqlite3/blob/master/docs/performance.md

function checkIfDatabase() {
  if (fs.existsSync(dbPath)) return true
  return false
}

function initDatabase() {
  db.prepare(SQL.initDatabaseSQL).run()
}

function getSetting(key: string): string | undefined {
  return db.prepare(SQL.getSettingSQL).get(key)?.value ?? undefined
}

function setSetting(key: string, value: string | number | boolean) {
  db.prepare(SQL.setSettingSQL).run(key, JSON.stringify(value))
}

function deleteSetting(key: string) {
  db.prepare(SQL.deleteSettingSQL).run(key)
}

export { db, checkIfDatabase, initDatabase, getSetting, setSetting, deleteSetting }
