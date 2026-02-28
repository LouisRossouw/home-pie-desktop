import { ipcMain } from 'electron'

import { dbIpcKey } from '@shared/constants'

import { getAllUserSettings, getUserSetting, setUserSetting } from '@main/src/db/user-settings'
import { getAllCoreSettings, getCoreSetting, setCoreSetting } from '@main/src/db/core-settings'
import {
  getAllFinanceSettings,
  getFinanceSetting,
  setFinanceSetting,
  getAllFinanceRecords,
  getFinanceRecord,
  setFinanceRecord
} from '@main/src/db/finances'

import {
  getAllUserSessions,

  getAllSessions,
  getSession,
  setSession,
  getSessionByUserEmail,
  deleteUserSessions
} from '@main/src/db/session'
import { checkAccessToken, findNextActiveAccessToken } from '@main/src/session'

export function databaseIpcHandlers() {
  // * Settings
  ipcMain.handle(dbIpcKey.getCoreSetting, async (_event, data) => {
    return await getCoreSetting(data)
  })
  ipcMain.handle(dbIpcKey.setCoreSetting, async (_event, data) => {
    return await setCoreSetting(data)
  })
  ipcMain.handle(dbIpcKey.getAllCoreSettings, async (_event) => {
    return await getAllCoreSettings()
  })

  // ** UserSettings
  ipcMain.handle(dbIpcKey.getUserSetting, async (_event, data) => {
    return await getUserSetting(data)
  })
  ipcMain.handle(dbIpcKey.setUserSetting, async (_event, data) => {
    return await setUserSetting(data)
  })
  ipcMain.handle(dbIpcKey.getAllUserSettings, async (_event, data) => {
    return await getAllUserSettings(data)
  })

  // ** Session
  ipcMain.handle(dbIpcKey.getSession, async (_event, data) => {
    return await getSession(data)
  })
  ipcMain.handle(dbIpcKey.setSession, async (_event, data) => {
    return await setSession(data)
  })
  ipcMain.handle(dbIpcKey.getAllUserSessions, async (_event, data) => {
    return await getAllUserSessions(data)
  })
  ipcMain.handle(dbIpcKey.getAllSessions, async (_event) => {
    return await getAllSessions()
  })
  ipcMain.handle(dbIpcKey.deleteUserSessions, async (_event, data) => {
    return await deleteUserSessions(data)
  })

  ipcMain.handle(dbIpcKey.checkAccessToken, async (_event, data) => {
    return await checkAccessToken(data)
  })
  ipcMain.handle(dbIpcKey.findNextActiveAccessToken, async (_event) => {
    return await findNextActiveAccessToken()
  })

  ipcMain.handle(dbIpcKey.getSessionByUserEmail, async (_event, data) => {
    return await getSessionByUserEmail(data)
  })

  // ** Finances
  ipcMain.handle(dbIpcKey.getFinanceSetting, async (_event, key) => {
    return await getFinanceSetting(key)
  })
  ipcMain.handle(dbIpcKey.setFinanceSetting, async (_event, { key, value }) => {
    return await setFinanceSetting(key, value)
  })
  ipcMain.handle(dbIpcKey.getAllFinanceSettings, async (_event) => {
    return await getAllFinanceSettings()
  })

  // ** Records (Historical)
  ipcMain.handle(dbIpcKey.getFinanceRecord, async (_event, { month, year }) => {
    return await getFinanceRecord(month, year)
  })
  ipcMain.handle(dbIpcKey.setFinanceRecord, async (_event, { month, year, value }) => {
    return await setFinanceRecord(month, year, value)
  })
  ipcMain.handle(dbIpcKey.getAllFinanceRecords, async (_event) => {
    return await getAllFinanceRecords()
  })
}


