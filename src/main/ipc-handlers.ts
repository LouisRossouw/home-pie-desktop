import { ipcMain } from 'electron'
import { loadApp, resizeApp, windowControl } from './app'

export function registerIpcHandlers() {
  ipcMain.handle('resize-app', (event, { width, height }) => {
    resizeApp({ width, height })
  })

  ipcMain.handle('load-app', (event) => {
    return loadApp()
  })

  ipcMain.on('window-control', (event, { action }) => {
    windowControl({ action })
  })
}
