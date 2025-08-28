import { ipcMain } from 'electron'

import { getAllSettings, getSetting, setSetting } from '@main/src/db/settings'
import { getAuth, setAuth } from '@main/src/db/auth'
import { IpcKey } from '@shared/constants'

export function databaseIpcHandlers() {
  // * Settings
  ipcMain.handle(IpcKey.getSetting, async (_event, data) => {
    return await getSetting(data)
  })

  ipcMain.handle(IpcKey.setSetting, async (_event, data) => {
    return await setSetting(data)
  })

  ipcMain.handle(IpcKey.getAllSettings, async (_event) => {
    return await getAllSettings()
  })

  // ** Auth
  ipcMain.handle(IpcKey.getAuth, async (_event, data) => {
    return await getAuth(data)
  })
  ipcMain.handle(IpcKey.setAuth, async (_event, data) => {
    return await setAuth(data)
  })
}
