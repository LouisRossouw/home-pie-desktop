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
import { externalIpcKey } from '@shared/constants'

export function externalIpcHandlers() {
  ipcMain.handle(externalIpcKey.apiProjectList, async (_event) => {
    return await apiProjectList()
  })

  // * Mr PingPing
  ipcMain.handle(externalIpcKey.apiMrPingPingStatus, async (_event) => {
    return await apiMrPingPingStatus()
  })
  ipcMain.handle(externalIpcKey.apiMrPingPingAppConfig, async (_event, data) => {
    return await apiMrPingPingAppConfig(data)
  })
  ipcMain.handle(externalIpcKey.apiMrPingPingAppsConfig, async (_event) => {
    return await apiMrPingPingAppsConfig()
  })
  ipcMain.handle(externalIpcKey.apiMrPingPingAppsStatus, async (_event) => {
    return await apiMrPingPingAppsStatus()
  })
  ipcMain.handle(externalIpcKey.apiMrPingPingAppStatus, async (_event, data) => {
    return await apiMrPingPingAppStatus(data)
  })
  ipcMain.handle(externalIpcKey.apiMrPingPingAppData, async (_event, data) => {
    return await apiMrPingPingAppsData(data)
  })

  // GenGen
  ipcMain.handle(externalIpcKey.apiGenGenStart, async (_event, data) => {
    return await apiGenGenStart(data)
  })
  ipcMain.handle(externalIpcKey.apiGenGenCheckProgress, async (_event, data) => {
    return await apiGenGenCheckProgress(data)
  })

  // Projects
  ipcMain.handle(externalIpcKey.apiGetProjectConfig, async (_event, data) => {
    return await apiGetProjectConfig(data)
  })
  ipcMain.handle(externalIpcKey.apiPutProjectConfig, async (_event, data) => {
    return await apiPutProjectConfig(data)
  })

  // * Projects; TIme In Progress related API
  ipcMain.handle(externalIpcKey.apiTimeInProgressOverview, async (_event, data) => {
    return await apiTimeInProgressOverview(data)
  })
  ipcMain.handle(externalIpcKey.apiTimeInProgressInsertHistoricalData, async (_event, data) => {
    return await apiTimeInProgressInsertHistoricalData(data)
  })

  // * Projects; Insta insights related API
  ipcMain.handle(externalIpcKey.apiInstaInsightsGetAllAccounts, async (_event) => {
    return await apiInstaInsightsGetAllAccounts()
  })
  ipcMain.handle(externalIpcKey.apiInstaInsightsGetAccountsOverview, async (_event, data) => {
    return await apiInstaInsightsGetAccountsOverview(data)
  })
  ipcMain.handle(externalIpcKey.apiInstaInsightsAddAccount, async (_event, data) => {
    return await apiInstaInsightsAddAccount(data)
  })
  ipcMain.handle(externalIpcKey.apiInstaInsightsUpdateAccountStatus, async (_event, data) => {
    return await apiInstaInsightsUpdateAccountStatus(data)
  })
  ipcMain.handle(externalIpcKey.apiInstaInsightsRemoveAccount, async (_event, data) => {
    return await apiInstaInsightsRemoveAccount(data)
  })

  // * Auth
  ipcMain.handle(externalIpcKey.apiCompleteAuthentication, (_event, data) => {
    return apiCompleteAuthentication(data)
  })
}
