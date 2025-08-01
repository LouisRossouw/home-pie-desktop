import path from 'path'
import { app } from 'electron'
import Database from 'better-sqlite3'

const fs = require('fs')
import { SQL } from './sql'
import { Setting } from '@shared/types'
import { getAllSettingsSQL } from './sql/settings'

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
  db.prepare(SQL.initDatabaseSQL).run()
}

async function getSetting(key: Setting): Promise<string | undefined> {
  logActivity(`getSetting ${key}`)
  return db.prepare(SQL.getSettingSQL).get(key)?.value ?? undefined
}

async function setSetting(key: string, value?: string | number | boolean) {
  logActivity(`setSetting ${key} - ${value}`)
  db.prepare(SQL.setSettingSQL).run(key, JSON.stringify(value))
}

async function getAllSettings() {
  logActivity(`getAllSettings`)
  return db.prepare(getAllSettingsSQL).all()
}

function deleteSetting(key: string) {
  logActivity(`setSetting ${key}`)
  db.prepare(SQL.deleteSettingSQL).run(key)
}

function logActivity(value: any) {
  isDev ? console.log('DB -', value) : null
}

export { db, checkIfDatabase, initDatabase, getSetting, setSetting, deleteSetting, getAllSettings }
