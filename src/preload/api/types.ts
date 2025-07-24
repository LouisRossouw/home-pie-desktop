import { ApiProjectsList, ApiTest, Setting } from '@shared/types'
import { WindowControl, type ResizeApp } from '@main/src/app'

type Nav = {
  navigateTo: (v: any) => {}
}

type AppAPI = {
  resizeApp: (v: ResizeApp) => void
  loadApp: (v: { fastLoad: boolean }) => Promise<boolean>
  maybeQuickStart: () => Promise<boolean>
  onLoaderProgress: (v: any) => Promise<any>
  windowControl: (v: WindowControl) => Promise<string>
  updateDotSquad: (v: any) => Promise<any>
  listenerCount: (v: any) => Promise<any>
  removeAllListeners: (v: any) => Promise<any>
  removeListener: (v: any, listener: string) => Promise<any>
}

type ExternalAPI = {
  apiProjectList: () => Promise<ApiProjectsList>
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
