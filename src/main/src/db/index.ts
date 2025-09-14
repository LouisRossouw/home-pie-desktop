import path from 'path'
import { app } from 'electron'
import Database from 'better-sqlite3'

const fs = require('fs')
import { SQL } from '../sql'

const isDev = import.meta.env.DEV

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
  initTables()
}

function initTables() {
  db.prepare(SQL.initCoreSettingsDatabaseSQL).run()
  db.prepare(SQL.initUserSettingsDatabaseSQL).run()
  db.prepare(SQL.initSessionDatabaseSQL).run()
}

function logActivity(value: any) {
  isDev ? console.log('DB -', value) : null
}

export { db, checkIfDatabase, initDatabase, logActivity }
