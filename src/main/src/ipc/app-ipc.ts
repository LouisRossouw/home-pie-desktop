import { ipcMain } from 'electron'
import {
  handleAuthBrowser,
  loadApp,
  maybeFastLoad,
  openDirectory,
  resizeApp,
  windowControl
} from '../app'
import { IpcKey } from '@shared/constants'

export function appIpcHandlers() {
  ipcMain.handle('resize-app', (_event, { width, height }) => {
    resizeApp({ width, height })
  })

  ipcMain.handle('maybe-fast-load', (_event) => {
    return maybeFastLoad()
  })

  ipcMain.handle('load-app', (_event, { fastLoad }) => {
    return loadApp({ fastLoad })
  })

  ipcMain.on('window-control', (_event, { action, width, height }) => {
    windowControl({ action, width, height })
  })

  ipcMain.handle('open-directory', (_event, data) => {
    openDirectory(data)
  })

  // ** Auth
  ipcMain.handle(IpcKey.signIn, async (_event) => {
    return await handleAuthBrowser()
  })
}
