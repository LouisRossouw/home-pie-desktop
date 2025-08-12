import { ipcMain } from 'electron'
import { loadApp, maybeFastLoad, openDirectory, resizeApp, syncRoute, windowControl } from './app'

import { ApiTimeInProgressOverview, Setting } from '@shared/types'

import { mainWindow } from '@main/.'
import { apiTest } from '@main/src/api/api-test'
import { apiProjectList } from '@main/src/api/projects/api-projects-list'

import { apiGenGenCheckProgress } from './api/gengen/api-gengen-check-progress'
import { apiTimeInProgressOverview } from './api/projects/time-in-progress/api-overview'
import { getAllSettings, getSetting, setSetting } from './database'
import { apiGenGenStart } from './api/gengen/api-gengen-start'

function navIpcHandlers() {
  ipcMain.handle('sync-route', (_event, route) => {
    syncRoute(route)
  })
}

function appIpcHandlers() {
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

  ipcMain.on('open-directory', (_event, data) => {
    openDirectory(data)
  })
}

function projectsIpcHandlers() {
  ipcMain.handle('api-projects-list', async (_event) => {
    return await apiProjectList()
  })

  ipcMain.handle('api-timeinprogress-overview', async (_event, data: ApiTimeInProgressOverview) => {
    return await apiTimeInProgressOverview(data)
  })
}

function gengenIpcHandlers() {
  ipcMain.handle('api-gengen-start', async (_event, data) => {
    return await apiGenGenStart(data)
  })

  ipcMain.handle('api-gengen-check-progress', async (_event, data) => {
    return await apiGenGenCheckProgress(data)
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
  ;(navIpcHandlers(),
    appIpcHandlers(),
    projectsIpcHandlers(),
    testIpcHandlers(),
    databaseIpcHandlers(),
    gengenIpcHandlers())
}
