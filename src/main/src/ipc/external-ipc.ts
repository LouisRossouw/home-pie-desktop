import { ipcMain } from 'electron'

import { apiProjectList } from '@main/src/api/projects/api-projects-list'
import { apiTimeInProgressOverview } from '../api/projects/time-in-progress/api-overview'

import { apiInstaInsightsAddAccount } from '../api/projects/insta-insights/api-add-account'
import { apiInstaInsightsGetAccountsOverview } from '../api/projects/insta-insights/api-overview'
import { apiInstaInsightsRemoveAccount } from '../api/projects/insta-insights/api-remove-account'
import { apiInstaInsightsGetAllAccounts } from '../api/projects/insta-insights/api-get-all-accounts'
import { apiInstaInsightsUpdateAccountStatus } from '../api/projects/insta-insights/api-update-account-status'

import { apiTimeInProgressInsertHistoricalData } from '../api/projects/time-in-progress/api-platform'
import { apiMrPingPingStatus } from '../api/mr-ping-ping/api-status'
import { apiMrPingPingAppConfig } from '../api/mr-ping-ping/api-app-config'
import { apiMrPingPingAppsConfig } from '../api/mr-ping-ping/api-apps-config'
import { apiMrPingPingAppsStatus } from '../api/mr-ping-ping/api-apps-status'
import { apiMrPingPingAppStatus } from '../api/mr-ping-ping/api-app-status'
import { apiGenGenStart } from '../api/gengen/api-gengen-start'
import { apiGenGenCheckProgress } from '../api/gengen/api-gengen-check-progress'
import { apiCompleteAuthentication } from '../api/auth/api-auth-complete'
import { apiMrPingPingAppsData } from '../api/mr-ping-ping/api-apps-data'
import { apiGetProjectConfig, apiPutProjectConfig } from '../api/projects/api-project-config'

export function externalIpcHandlers() {
  ipcMain.handle('api-projects-list', async (_event) => {
    return await apiProjectList()
  })

  // * Mr PingPing
  ipcMain.handle('api-mr-ping-ping-status', async (_event) => {
    return await apiMrPingPingStatus()
  })
  ipcMain.handle('api-mr-ping-ping-app-config', async (_event, data) => {
    return await apiMrPingPingAppConfig(data)
  })
  ipcMain.handle('api-mr-ping-ping-apps-config', async (_event) => {
    return await apiMrPingPingAppsConfig()
  })
  ipcMain.handle('api-mr-ping-ping-apps-status', async (_event) => {
    return await apiMrPingPingAppsStatus()
  })
  ipcMain.handle('api-mr-ping-ping-app-status', async (_event, data) => {
    return await apiMrPingPingAppStatus(data)
  })
  ipcMain.handle('api-mr-ping-ping-apps-data', async (_event, data) => {
    return await apiMrPingPingAppsData(data)
  })

  // GenGen
  ipcMain.handle('api-gengen-start', async (_event, data) => {
    return await apiGenGenStart(data)
  })
  ipcMain.handle('api-gengen-check-progress', async (_event, data) => {
    return await apiGenGenCheckProgress(data)
  })

  // Projects
  ipcMain.handle('api-get-project-config', async (_event, data) => {
    return await apiGetProjectConfig(data)
  })
  ipcMain.handle('api-put-project-config', async (_event, data) => {
    return await apiPutProjectConfig(data)
  })

  // * Projects; TIme In Progress related API
  ipcMain.handle('api-timeinprogress-overview', async (_event, data) => {
    return await apiTimeInProgressOverview(data)
  })
  ipcMain.handle('api-timeinprogress-insert-historical-data', async (_event, data) => {
    return await apiTimeInProgressInsertHistoricalData(data)
  })

  // * Projects; Insta insights related API
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

  // * Auth
  ipcMain.handle('api-complete-auth-app', (_event, data) => {
    return apiCompleteAuthentication(data)
  })
}
