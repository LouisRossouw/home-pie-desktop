import path from 'path'
import { app } from 'electron'
import Database from 'better-sqlite3'

const fs = require('fs')
import { SQL } from './sql'
import { SettingSlug } from './default-app-settings'

const userPath = app.getPath('userData')

const dbName = 'homepie.db'
const dbPath = path.join(userPath, dbName)

export const dbExists = fs.existsSync(dbPath) // * Dont move this: Check if the DB file exists **before** initializing the database

const db = new Database(dbPath)

db.pragma('journal_mode = WAL') // it is generally important to set the WAL pragma for performance reasons. https://github.com/WiseLibs/better-sqlite3/blob/master/docs/performance.md

function checkIfDatabase() {
  if (fs.existsSync(dbPath)) return true
  return false
}

function initDatabase() {
  db.prepare(SQL.initDatabaseSQL).run()
}

async function getSetting(key: SettingSlug): Promise<string | undefined> {
  return db.prepare(SQL.getSettingSQL).get(key)?.value ?? undefined
}

function setSetting(key: string, value: string | number | boolean) {
  db.prepare(SQL.setSettingSQL).run(key, JSON.stringify(value))
}

function deleteSetting(key: string) {
  db.prepare(SQL.deleteSettingSQL).run(key)
}

export { db, checkIfDatabase, initDatabase, getSetting, setSetting, deleteSetting }
