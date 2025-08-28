import { electronAPI } from '@electron-toolkit/preload'
import { IpcKey } from '@shared/constants'

import type { Setting } from '@shared/types'

const IPCR = electronAPI.ipcRenderer

export type DatabaseAppSettingsAPI = {
  test: (v: { v: boolean }) => void
  getAppSetting: (data: { key: Setting }) => Promise<any>
  setAppSetting: (data: { key: Setting; value: string | number | boolean }) => Promise<boolean>
  getAllAppSettings: () => Promise<Record<string, string>[]> // TODO; Type

  getAuth: (data: { key: string }) => Promise<any>
  setAuth: (data: { key: string; value: string | number | boolean }) => Promise<any>
}

// prettier-ignore
export const databaseAppSettingsAPI = {
  test: (data: { v: boolean }) => IPCR.invoke('test', data),
  getAppSetting: async (data: { key: Setting }) => IPCR.invoke(IpcKey.getSetting, data),
  setAppSetting: async (data: { key: Setting; value: string | number | boolean }) => IPCR.invoke(IpcKey.setSetting, data),
  getAllAppSettings: async () => IPCR.invoke(IpcKey.getAllSettings),

  getAuth: async (data: {key: string}) => IPCR.invoke(IpcKey.getAuth, data),
  setAuth: async (data: {key: string, value: string | number | boolean}) => IPCR.invoke(IpcKey.setAuth, data)
}
