import { electronAPI } from '@electron-toolkit/preload'
import { IpcKey } from '@shared/constants'

import type { CoreSetting, Setting, UserSetting } from '@shared/types'

const IPCR = electronAPI.ipcRenderer

// prettier-ignore
type GetSession = {userId: number | string, key: string}
type SetSession = { userId: number | string; key: string }
type GetAllSessions = { userId: number | string }

type GetCoreSetting = { key: CoreSetting }
type SetCoreSetting = { key: Setting; value: string | number | boolean }
type GetUserSetting = { userId: number | string; key: UserSetting }
// prettier-ignore
type SetUserSetting = {userId: number | string; key: UserSetting; value: string | number | boolean}
type GetAllUserSettings = { userId: number | string }

// prettier-ignore
export type DatabaseAppSettingsAPI = {
  test: (v: { v: boolean }) => void

  // ** Core Settings
  getCoreSetting: (data: GetCoreSetting) => Promise<any>
  setCoreSetting: (data: SetCoreSetting) => Promise<boolean>
  getAllCoreSettings: () => Promise<Record<string, string>[]> // TODO; Type

  // ** User Settings
  getUserSetting: (data: GetUserSetting) => Promise<any>
  setUserSetting: (data: SetUserSetting) => Promise<boolean>
  getAllUserSettings: (data: GetAllUserSettings) => Promise<Record<string, string>[]> // TODO; Type

  // ** Session
  getSession: (data: GetSession) => Promise<any>
  setSession: (data: SetSession) => Promise<any>
  getAllSessions: (data: GetAllSessions) => Promise<Record<string, string>[]> // TODO; Type
}

// prettier-ignore
export const databaseAppSettingsAPI = {
  test: (data: { v: boolean }) => IPCR.invoke('test', data),

  // ** Core Settings
  getCoreSetting: async (data: GetCoreSetting) => IPCR.invoke(IpcKey.getCoreSetting, data),
  setCoreSetting: async (data: SetCoreSetting) => IPCR.invoke(IpcKey.setCoreSetting, data),
  getAllCoreSettings: async () => IPCR.invoke(IpcKey.getAllCoreSettings),

  // ** User Settings
  getUserSetting: async (data: GetUserSetting) => IPCR.invoke(IpcKey.getUserSetting, data),
  setUserSetting: async (data: SetUserSetting) => IPCR.invoke(IpcKey.setUserSetting, data),
  getAllUserSettings: async (data: GetAllUserSettings) => IPCR.invoke(IpcKey.getAllUserSettings, data),

  // ** Session
  getSession: async (data: GetSession) => IPCR.invoke(IpcKey.getSession, data),
  setSession: async (data: SetSession) => IPCR.invoke(IpcKey.setSession, data),
  getAllSessions:async (data: GetAllSessions) => IPCR.invoke(IpcKey.getAllSessions, data),
}
