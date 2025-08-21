import { electronAPI } from '@electron-toolkit/preload'

import type {
  ApiProjectsList,
  ApiMrPingPingStatus,
  ApiInstaInsightsAccount,
  ApiTimeInProgressOverview,
  ApiInstaInsightsAccountsOverview,
  ApiTimeInProgressOverviewResponse,
  ApiTimeInProgressInsertHistoricalData,
  ApiInstaInsightsAccountsOverviewResponse
} from '@shared/types'

const IPCR = electronAPI.ipcRenderer

// prettier-ignore
export type ExternalAPI = {
  apiProjectList: () => Promise<ApiProjectsList>

  // Mr PingPing
  apiMrPingPingStatus: () => Promise<ApiMrPingPingStatus>
  apiMrPingPingAppConfig: (data: {appName: string}) => Promise<any>
  apiMrPingPingAppsConfig: () => Promise<any>
  apiMrPingPingAppsStatus: () => Promise<any>
  apiMrPingPingAppStatus: (data: {appName: string}) => Promise<{ok: boolean, data: unknown}>

  // GenGen
  apiGenGenCheckProgress: (data: {project: string}) => Promise<any> // TODO; type
  apiGenGenStart: (data: {project: string}) => Promise<any> // TODO; type

  // Time In Progress
  apiTimeInProgressOverview: (data: ApiTimeInProgressOverview) => Promise<ApiTimeInProgressOverviewResponse>
  apiTimeInProgressInsertHistoricalData: (data: ApiTimeInProgressInsertHistoricalData) => Promise<{ok: boolean}>

  // Insta Insights
  apiInstaInsightsGetAllAccounts: () => Promise<{ok: boolean, data: ApiInstaInsightsAccount[]}>
  apiInstaInsightsGetAccountsOverview: (data: ApiInstaInsightsAccountsOverview) => Promise<ApiInstaInsightsAccountsOverviewResponse>
  apiInstaInsightsAddAccount: (data: ApiInstaInsightsAccount) => Promise<{ok: boolean}>
  apiInstaInsightsUpdateAccountStatus: (data: ApiInstaInsightsAccount) => Promise<{ok: boolean}>
  apiInstaInsightsRemoveAccount: (data: ApiInstaInsightsAccount) => Promise<{ok: boolean}>
}
// prettier-ignore
export const externalAPI = {
  apiProjectList: async () => IPCR.invoke('api-projects-list'),

  // Mr PingPing
  apiMrPingPingStatus: async () => IPCR.invoke('api-mr-ping-ping-status'),
  apiMrPingPingAppConfig: async (data: {appName: string}) => IPCR.invoke('api-mr-ping-ping-app-config', data),
  apiMrPingPingAppsConfig: async () => IPCR.invoke('api-mr-ping-ping-apps-config'),
  apiMrPingPingAppsStatus: async () => IPCR.invoke('api-mr-ping-ping-apps-status'),
  apiMrPingPingAppStatus: async (data: {appName: string}) => IPCR.invoke('api-mr-ping-ping-app-status', data),

  // GenGen
  apiGenGenStart: async (data: {project: string}) => IPCR.invoke('api-gengen-start', data),
  apiGenGenCheckProgress: async (data: {project: string}) => IPCR.invoke('api-gengen-check-progress', data),

  // Time In Progress
  apiTimeInProgressOverview: async (data: ApiTimeInProgressOverview) => IPCR.invoke('api-timeinprogress-overview', data),
  apiTimeInProgressInsertHistoricalData: async (data: ApiTimeInProgressInsertHistoricalData) => IPCR.invoke('api-timeinprogress-insert-historical-data', data),

  // Insta Insights
  apiInstaInsightsGetAllAccounts: async () => IPCR.invoke('api-insta-insights-get-all-accounts'),
  apiInstaInsightsGetAccountsOverview: async (data: ApiInstaInsightsAccountsOverview) => IPCR.invoke('api-insta-insights-get-accounts-overview', data),
  apiInstaInsightsAddAccount: async (data: ApiInstaInsightsAccount) => IPCR.invoke('api-insta-insights-add-account', data),
  apiInstaInsightsUpdateAccountStatus: async (data: ApiInstaInsightsAccount) => IPCR.invoke('api-insta-insights-update-account-status', data),
  apiInstaInsightsRemoveAccount: async (data: ApiInstaInsightsAccount) => IPCR.invoke('api-insta-insights-remove-account', data)
}
