import {
  ApiTest,
  Setting,
  ResizeApp,
  WindowControl,
  ApiProjectsList,
  ApiTimeInProgressOverview,
  ApiTimeInProgressOverviewResponse
} from '@shared/types'

type Nav = {
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
  apiTimeInProgressOverview: (data: ApiTimeInProgressOverview) => Promise<ApiTimeInProgressOverviewResponse>
  apiGenGenCheckProgress: (data: {project: string}) => Promise<any> // TODO; type
  apiGenGenStart: (data: {project: string}) => Promise<any> // TODO; type
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

export type Api = AppAPI & ExternalAPI & DatabaseAppSettingsAPI & TestAPI & Nav
