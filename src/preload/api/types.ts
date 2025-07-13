import { ApiProjectsList, ApiTest } from '@shared/types'
import { WindowControl, type ResizeApp } from '@main/src/app'

type Nav = {
  navigateTo: (v: any) => {}
}

type AppAPI = {
  resizeApp: (v: ResizeApp) => void
  loadApp: () => Promise<boolean>
  onLoaderProgress: (v: any) => Promise<any>
  windowControl: (v: WindowControl) => Promise<string>
}

type ExternalAPI = {
  apiProjectList: () => Promise<ApiProjectsList>
}

type TestAPI = {
  apiTest: () => Promise<ApiTest>
  apiLogoutTest: () => {}
}

type PreferencesAPI = {
  test: (v: { v: boolean }) => void
}

export type Api = AppAPI & ExternalAPI & PreferencesAPI & TestAPI & Nav
