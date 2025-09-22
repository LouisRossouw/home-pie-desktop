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
import { dbIpcKey } from '@shared/constants'

export function appIpcHandlers() {
  ipcMain.handle('resize-app', (_event, data) => {
    resizeApp(data)
  })

  ipcMain.handle('maybe-fast-load', (_event) => {
    return maybeFastLoad()
  })

  ipcMain.handle('load-app', (_event, data) => {
    return loadApp(data)
  })

  ipcMain.on('window-control', (_event, data) => {
    windowControl(data)
  })

  ipcMain.handle('open-directory', (_event, data) => {
    openDirectory(data)
  })

  ipcMain.handle('open-browser-url', (_event, data) => {
    openBrowserToUrl(data)
  })

  // ** Auth
  ipcMain.handle(dbIpcKey.apiSignIn, async (_event, data) => {
    return await authorizeUserInDefaultBrowser(data)
  })
}
