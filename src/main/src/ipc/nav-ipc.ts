import { ipcMain } from 'electron'
import { syncRoute } from '../app'
import { navIpcKey } from '@shared/constants'

export function navIpcHandlers() {
  ipcMain.handle(navIpcKey.syncRoute, (_event, route) => {
    syncRoute(route)
  })
}
