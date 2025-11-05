import { ipcMain } from 'electron'
import {
  authorizeUserInDefaultBrowser,
  loadApp,
  maybeFastLoad,
  openBrowserToUrl,
  openDirectory,
  resizeApp,
  windowControl
} from '../app'
import { appIpcKey, dbIpcKey } from '@shared/constants'

export function appIpcHandlers() {
  ipcMain.handle(appIpcKey.resizeApp, (_event, data) => {
    resizeApp(data)
  })

  ipcMain.handle(appIpcKey.maybeFastLoad, (_event) => {
    return maybeFastLoad()
  })

  ipcMain.handle(appIpcKey.loadApp, (_event, data) => {
    return loadApp(data)
  })

  ipcMain.on(appIpcKey.windowControl, (_event, data) => {
    windowControl(data)
  })

  ipcMain.handle(appIpcKey.openDirectory, (_event, data) => {
    openDirectory(data)
  })

  ipcMain.handle(appIpcKey.openBrowserToUrl, (_event, data) => {
    openBrowserToUrl(data)
  })

  // ** Auth
  ipcMain.handle(dbIpcKey.apiSignIn, async (_event, data) => {
    return await authorizeUserInDefaultBrowser(data)
  })
}
