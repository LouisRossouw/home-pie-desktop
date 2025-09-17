import { ipcMain } from 'electron'

import { IpcKey } from '@shared/constants'

import { getAllUserSettings, getUserSetting, setUserSetting } from '@main/src/db/user-settings'
import { getAllCoreSettings, getCoreSetting, setCoreSetting } from '@main/src/db/core-settings'
import {
  getAllUserSessions,
  getAllSessions,
  getSession,
  setSession,
  getSessionByUserEmail,
  deleteUserSessions
} from '@main/src/db/session'
import { checkAccessToken } from '@main/src/session'

export function databaseIpcHandlers() {
  // * Settings
  ipcMain.handle(IpcKey.getCoreSetting, async (_event, data) => {
    return await getCoreSetting(data)
  })
  ipcMain.handle(IpcKey.setCoreSetting, async (_event, data) => {
    return await setCoreSetting(data)
  })
  ipcMain.handle(IpcKey.getAllCoreSettings, async (_event) => {
    return await getAllCoreSettings()
  })

  // ** UserSettings
  ipcMain.handle(IpcKey.getUserSetting, async (_event, data) => {
    return await getUserSetting(data)
  })
  ipcMain.handle(IpcKey.setUserSetting, async (_event, data) => {
    return await setUserSetting(data)
  })
  ipcMain.handle(IpcKey.getAllUserSettings, async (_event, data) => {
    return await getAllUserSettings(data)
  })

  // ** Session
  ipcMain.handle(IpcKey.getSession, async (_event, data) => {
    return await getSession(data)
  })
  ipcMain.handle(IpcKey.setSession, async (_event, data) => {
    return await setSession(data)
  })
  ipcMain.handle(IpcKey.getAllUserSessions, async (_event, data) => {
    return await getAllUserSessions(data)
  })
  ipcMain.handle(IpcKey.getAllSessions, async (_event) => {
    return await getAllSessions()
  })
  ipcMain.handle(IpcKey.deleteUserSessions, async (_event, data) => {
    return await deleteUserSessions(data)
  })

  ipcMain.handle(IpcKey.checkAccessToken, async (_event, data) => {
    return await checkAccessToken(data)
  })

  ipcMain.handle(IpcKey.getSessionByUserEmail, async (_event, data) => {
    return await getSessionByUserEmail(data)
  })
}
