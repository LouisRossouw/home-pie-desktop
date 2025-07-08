import { ipcMain } from 'electron'
import { resizeApp } from './app'

export function registerIpcHandlers() {
  ipcMain.handle('resize-app', (_event, { width, height }) => {
    resizeApp({ width, height })
  })
}
