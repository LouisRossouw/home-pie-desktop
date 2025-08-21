import { ipcMain } from 'electron'
import { syncRoute } from '../app'

export function navIpcHandlers() {
  ipcMain.handle('sync-route', (_event, route) => {
    syncRoute(route)
  })
}
