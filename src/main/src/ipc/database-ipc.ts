import { ipcMain } from 'electron'
import type { Setting } from '@shared/types'

import { getAllSettings, getSetting, setSetting } from '../database'

export function databaseIpcHandlers() {
  ipcMain.handle('get-app-setting', async (_event, { setting }: { setting: Setting }) => {
    return await getSetting(setting)
  })

  ipcMain.handle(
    'set-app-setting',
    async (_event, { setting, value }: { setting: Setting; value: string }) => {
      return await setSetting(setting, value)
    }
  )

  ipcMain.handle('get-all-app-settings', async (_event) => {
    return await getAllSettings()
  })
}
