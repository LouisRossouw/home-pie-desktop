import { ipcMain } from 'electron'
import { loadApp, maybeQuckStart, resizeApp, windowControl } from './app'

import { Setting } from '@shared/types'

import { mainWindow } from '@main/.'
import { apiTest } from '@main/src/api/api-test'
import { apiProjectList } from '@main/src/api/projects/api-projects-list'

import { getAllSettings, getSetting, setSetting } from './database'

function appIpcHandlers() {
  ipcMain.handle('resize-app', (_event, { width, height }) => {
    resizeApp({ width, height })
  })

  ipcMain.handle('maybe-quick-start', (_event) => {
    return maybeQuckStart()
  })

  ipcMain.handle('load-app', (_event, { fastLoad }) => {
    return loadApp({ fastLoad })
  })

  ipcMain.on('window-control', (_event, { action }) => {
    windowControl({ action })
  })
}

function projectsIpcHandlers() {
  ipcMain.handle('api-projects-list', async (_event) => {
    return await apiProjectList()
  })
}

// function sessionIpcHandlers(){
//     ipcMain.handle('api-todo', async (_event) => {
//     return await apiProjectList()
//   })
// }

function databaseIpcHandlers() {
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

function testIpcHandlers() {
  ipcMain.handle('api-test', async (_event) => {
    return await apiTest()
  })

  ipcMain.handle('api-logout-test', async (_event) => {
    return mainWindow?.webContents.send('navigate-to', { url: '/login?forceLogout=true' })
  })
}

export function registerIpcHandlers() {
  ;(appIpcHandlers(), projectsIpcHandlers(), testIpcHandlers(), databaseIpcHandlers())
}
