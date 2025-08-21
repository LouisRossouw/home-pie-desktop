import { ipcMain } from 'electron'
import { mainWindow } from '@main/index'
import { apiTest } from '../api/api-test'

export function testIpcHandlers() {
  ipcMain.handle('api-test', async (_event) => {
    return await apiTest()
  })

  ipcMain.handle('api-logout-test', async (_event) => {
    return mainWindow?.webContents.send('navigate-to', { url: '/login?forceLogout=true' })
  })
}
