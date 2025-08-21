import { electronAPI } from '@electron-toolkit/preload'

import type { Setting } from '@shared/types'

const IPCR = electronAPI.ipcRenderer

export type DatabaseAppSettingsAPI = {
  test: (v: { v: boolean }) => void
  getAppSetting: (data: { setting: Setting }) => Promise<any>
  setAppSetting: (data: { setting: Setting; value: string | number | boolean }) => Promise<boolean>
  getAllAppSettings: () => Promise<Record<string, string>[]> // TODO; Type
}

// prettier-ignore
export const databaseAppSettingsAPI = {
  test: (data: { v: boolean }) => IPCR.invoke('test', data),
  getAppSetting: async (data: { setting: Setting }) => IPCR.invoke('get-app-setting', data),
  setAppSetting: async (data: { setting: Setting; value: string | number | boolean }) => IPCR.invoke('set-app-setting', data),
  getAllAppSettings: async () => IPCR.invoke('get-all-app-settings')
}
