import { ipcMain } from 'electron'
import { loadApp, maybeFastLoad, openDirectory, resizeApp, syncRoute, windowControl } from './app'

import type { Setting } from '@shared/types'

import { mainWindow } from '@main/.'
import { apiTest } from '@main/src/api/api-test'
import { apiProjectList } from '@main/src/api/projects/api-projects-list'
import { apiTimeInProgressOverview } from './api/projects/time-in-progress/api-overview'

import { apiGenGenStart } from './api/gengen/api-gengen-start'
import { apiGenGenCheckProgress } from './api/gengen/api-gengen-check-progress'

import { apiInstaInsightsAddAccount } from './api/projects/insta-insights/api-add-account'
import { apiInstaInsightsGetAccountsOverview } from './api/projects/insta-insights/api-overview'
import { apiInstaInsightsRemoveAccount } from './api/projects/insta-insights/api-remove-account'
import { apiInstaInsightsGetAllAccounts } from './api/projects/insta-insights/api-get-all-accounts'
import { apiInstaInsightsUpdateAccountStatus } from './api/projects/insta-insights/api-update-account-status'

import { getAllSettings, getSetting, setSetting } from './database'
import { apiTimeInProgressInsertHistoricalData } from './api/projects/time-in-progress/api-platform'

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

  ipcMain.handle('open-directory', (_event, data) => {
    openDirectory(data)
  })
}

function projectsIpcHandlers() {
  ipcMain.handle('api-projects-list', async (_event) => {
    return await apiProjectList()
  })

  // * TIme In Progress related API
  ipcMain.handle('api-timeinprogress-overview', async (_event, data) => {
    return await apiTimeInProgressOverview(data)
  })
  ipcMain.handle('api-timeinprogress-insert-historical-data', async (_event, data) => {
    return await apiTimeInProgressInsertHistoricalData(data)
  })

  // * Insta insights related API
  ipcMain.handle('api-insta-insights-get-all-accounts', async (_event) => {
    return await apiInstaInsightsGetAllAccounts()
  })
  ipcMain.handle('api-insta-insights-get-accounts-overview', async (_event, data) => {
    return await apiInstaInsightsGetAccountsOverview(data)
  })
  ipcMain.handle('api-insta-insights-add-account', async (_event, data) => {
    return await apiInstaInsightsAddAccount(data)
  })
  ipcMain.handle('api-insta-insights-update-account-status', async (_event, data) => {
    return await apiInstaInsightsUpdateAccountStatus(data)
  })
  ipcMain.handle('api-insta-insights-remove-account', async (_event, data) => {
    return await apiInstaInsightsRemoveAccount(data)
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
