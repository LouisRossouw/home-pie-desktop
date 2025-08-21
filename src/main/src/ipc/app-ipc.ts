import { ipcMain } from 'electron'
import { loadApp, maybeFastLoad, openDirectory, resizeApp, windowControl } from '../app'

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
}
