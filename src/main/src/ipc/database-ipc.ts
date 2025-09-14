import { ipcMain } from 'electron'

import { IpcKey } from '@shared/constants'
import { getAllSessions, getSession, setSession } from '@main/src/db/session'
import { getAllUserSettings, getUserSetting, setUserSetting } from '@main/src/db/user-settings'
import { getAllCoreSettings, getCoreSetting, setCoreSetting } from '@main/src/db/core-settings'

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
  ipcMain.handle(IpcKey.getAllSessions, async (_event, data) => {
    return await getAllSessions(data)
  })
}
