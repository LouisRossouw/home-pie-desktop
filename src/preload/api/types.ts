import {
  ApiTest,
  Setting,
  ResizeApp,
  WindowControl,
  ApiProjectsList,
  ApiTimeInProgressOverview,
  ApiTimeInProgressOverviewResponse,
  Range,
  ApiInstaInsightsAccountsOverview,
  ApiInstaInsightsAccount,
  ApiInstaInsightsAccountsOverviewResponse,
  ApiTimeInProgressInsertHistoricalData
} from '@shared/types'

type NavAPI = {
  syncRoute: (v: string) => {}
  navigateTo: (v: any) => {}
}

type AppAPI = {
  resizeApp: (v: ResizeApp) => void
  loadApp: (v: { fastLoad: boolean }) => Promise<{ hasLoaded: boolean; isFirstLoad: boolean }>
  maybeFastLoad: () => Promise<{ skipSplash: boolean; skipLoader: boolean }>
  onLoaderProgress: (v: any) => Promise<any>
  windowControl: (v: WindowControl) => Promise<string>
  onWindowResize: (v: any) => Promise<any>
  updateDotSquad: (v: any) => Promise<any>
  listenerCount: (v: any) => Promise<any>
  removeAllListeners: (v: any) => Promise<any>
  removeListener: (v: any, listener: string) => Promise<any>
  openDirectory: (v: { path: string }) => void // TODO; Return & handle error
}

// prettier-ignore
type ExternalAPI = {
  apiProjectList: () => Promise<ApiProjectsList>

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

type TestAPI = {
  apiTest: () => Promise<ApiTest>
  apiLogoutTest: () => {}
}

type DatabaseAppSettingsAPI = {
  test: (v: { v: boolean }) => void
  getAppSetting: (data: { setting: Setting }) => Promise<any>
  setAppSetting: (data: { setting: Setting; value: string | number | boolean }) => Promise<boolean>
  getAllAppSettings: () => Promise<Record<string, string>[]> // TODO; Type
}

// export type Api = AppAPI & ExternalAPI & DatabaseAppSettingsAPI & TestAPI & Nav
export type Api = {
  nav: NavAPI
  app: AppAPI
  test: TestAPI
  external: ExternalAPI
  db: DatabaseAppSettingsAPI
}
