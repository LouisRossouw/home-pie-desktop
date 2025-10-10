import { ipcMain } from 'electron'
import { mainWindow } from '@main/index'
import { apiTest } from '../api/api-test'
import { appIpcKey } from '@shared/constants'

export function testIpcHandlers() {
  ipcMain.handle('api-test', async (_event) => {
    return await apiTest()
  })

  ipcMain.handle('api-logout-test', async (_event) => {
    return mainWindow?.webContents.send(appIpcKey.navigateTo, { url: '/login?forceLogout=true' })
  })
}
