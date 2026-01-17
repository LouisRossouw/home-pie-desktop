import { electronAPI } from '@electron-toolkit/preload'
import { externalIpcKey } from '@shared/constants'

import type {
  ApiInstaInsightsAccount,
  ApiTimeInProgressOverview,
  ApiInstaInsightsAccountsOverview,
  ApiTimeInProgressInsertHistoricalData
} from '@shared/types'
import type * as T from '@shared/types'

const IPCR = electronAPI.ipcRenderer

// prettier-ignore
export type ExternalAPI = {

  // Mr PingPing
  apiMrPingPingStatus: T.ApiMrPingPingStatusFunc
  apiMrPingPingAppConfig: T.ApiMrPingPingAppConfigFunc
  apiMrPingPingAppsConfig: T.ApiMrPingPingAppsConfigFunc
  apiMrPingPingAppsStatus: T.ApiMrPingPingAppsStatusFunc
  apiMrPingPingAppStatus: T.ApiMrPingPingAppStatusFunc
  apiMrPingPingAppData: T.ApiMrPingPingAppDataFunc

  // GenGen
  apiGenGenCheckProgress: T.ApiGenGenCheckProgressFunc
  apiGenGenStart: T.ApiGenGenStartFunc

  // Projects;
  apiProjectList: T.ApiProjectListFunc
  apiGetProjectConfig: T.ApiGetProjectConfigFunc
  apiPutProjectConfig: T.ApiPutProjectConfigFunc

  // Projects; Time In Progress
  apiTimeInProgressOverview: T.ApiTimeInProgressOverviewFunc
  apiTimeInProgressInsertHistoricalData: T.ApiTimeInProgressInsertHistoricalDataFunc

  // Projects; Insta Insights
  apiInstaInsightsGetAllAccounts: T.ApiInstaInsightsGetAllAccountsFunc
  apiInstaInsightsGetAccountsOverview: T.ApiInstaInsightsGetAccountsOverviewFunc
  apiInstaInsightsAddAccount: T.ApiInstaInsightsAddAccountFunc
  apiInstaInsightsUpdateAccountStatus: T.ApiInstaInsightsUpdateAccountStatusFunc
  apiInstaInsightsRemoveAccount: T.ApiInstaInsightsRemoveAccountFunc

  // Projects; YT Insights
  apiYTInsightsGetAllAccounts: T.ApiYTInsightsGetAllAccountsFunc
  apiYTInsightsGetAccountsOverview: T.ApiYTInsightsGetAccountsOverviewFunc
  apiYTInsightsAddAccount: T.ApiYTInsightsAddAccountFunc
  apiYTInsightsUpdateAccountStatus: T.ApiYTInsightsUpdateAccountStatusFunc
  apiYTInsightsRemoveAccount: T.ApiYTInsightsRemoveAccountFunc
}
// prettier-ignore
export const externalAPI = {

  // Mr PingPing
  apiMrPingPingStatus: async () => IPCR.invoke(externalIpcKey.apiMrPingPingStatus),
  apiMrPingPingAppConfig: async (v: T.ApiMrPingPingAppConfig) => IPCR.invoke(externalIpcKey.apiMrPingPingAppConfig, v),
  apiMrPingPingAppsConfig: async () => IPCR.invoke(externalIpcKey.apiMrPingPingAppsConfig),
  apiMrPingPingAppsStatus: async () => IPCR.invoke(externalIpcKey.apiMrPingPingAppsStatus),
  apiMrPingPingAppStatus: async (v: T.ApiMrPingPingAppStatusParams) => IPCR.invoke(externalIpcKey.apiMrPingPingAppStatus, v),
  apiMrPingPingAppData: async (v: T.ApiMrPingPingAppData) => IPCR.invoke(externalIpcKey.apiMrPingPingAppData, v),

  // GenGen
  apiGenGenStart: async (v: T.ApiGenGenStart) => IPCR.invoke(externalIpcKey.apiGenGenStart, v),
  apiGenGenCheckProgress: async (v: T.ApiGenGenCheckProgress) => IPCR.invoke(externalIpcKey.apiGenGenCheckProgress, v),

  // Projects;
  apiProjectList: async () => IPCR.invoke(externalIpcKey.apiProjectList),
  apiGetProjectConfig: async (v: T.ApiGetProjectConfig) => IPCR.invoke(externalIpcKey.apiGetProjectConfig, v),
  apiPutProjectConfig: async (v: T.ApiPutProjectConfig) => IPCR.invoke(externalIpcKey.apiPutProjectConfig, v),

  // Projects; Time In Progress
  apiTimeInProgressOverview: async (v: T.ApiTimeInProgressOverview) => IPCR.invoke(externalIpcKey.apiTimeInProgressOverview, v),
  apiTimeInProgressInsertHistoricalData: async (v: T.ApiTimeInProgressInsertHistoricalData) => IPCR.invoke(externalIpcKey.apiTimeInProgressInsertHistoricalData, v),

  // Projects; Insta Insights
  apiInstaInsightsGetAllAccounts: async () => IPCR.invoke(externalIpcKey.apiInstaInsightsGetAllAccounts),
  apiInstaInsightsGetAccountsOverview: async (v: T.ApiInstaInsightsAccountsOverview) => IPCR.invoke(externalIpcKey.apiInstaInsightsGetAccountsOverview, v),
  apiInstaInsightsAddAccount: async (v: T.ApiInstaInsightsAccount) => IPCR.invoke(externalIpcKey.apiInstaInsightsAddAccount, v),
  apiInstaInsightsUpdateAccountStatus: async (v: T.ApiInstaUpdateInsightsAccount) => IPCR.invoke(externalIpcKey.apiInstaInsightsUpdateAccountStatus, v),
  apiInstaInsightsRemoveAccount: async (v: T.ApiInstaInsightsAccount) => IPCR.invoke(externalIpcKey.apiInstaInsightsRemoveAccount, v),

  // Projects; YT Insights
  apiYTInsightsGetAllAccounts: async () => IPCR.invoke(externalIpcKey.apiYTInsightsGetAllAccounts),
  apiYTInsightsGetAccountsOverview: async (v: T.ApiYTInsightsAccountsOverview) => IPCR.invoke(externalIpcKey.apiYTInsightsGetAccountsOverview, v),
  apiYTInsightsAddAccount: async (v: T.ApiYTInsightsAccount) => IPCR.invoke(externalIpcKey.apiYTInsightsAddAccount, v),
  apiYTInsightsUpdateAccountStatus: async (v: T.ApiYTUpdateInsightsAccount) => IPCR.invoke(externalIpcKey.apiYTInsightsUpdateAccountStatus, v),
  apiYTInsightsRemoveAccount: async (v: T.ApiYTInsightsAccount) => IPCR.invoke(externalIpcKey.apiYTInsightsRemoveAccount, v)
}
