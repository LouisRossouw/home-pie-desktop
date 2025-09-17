import { electronAPI } from '@electron-toolkit/preload'
import { IpcKey } from '@shared/constants'

import type {
  CoreSetting,
  SessionAccessKey,
  SessionsSQL,
  Setting,
  UserSessionKey,
  UserSetting
} from '@shared/types'

const IPCR = electronAPI.ipcRenderer

// prettier-ignore
type GetSession = {userId: number | string, key: UserSessionKey | SessionAccessKey}
type GetSessionByUserEmail = { userEmail: string }
type SetSession = { userId: number | string; key: string; value: string }
type DeleteUserSessions = { userId: number | string }
type GetAllUserSessions = { userId: number | string }

type GetCoreSetting = { key: CoreSetting }
type SetCoreSetting = { key: Setting; value: string | number | boolean }
type GetUserSetting = { userId: number | string; key: UserSetting }
type DeleteUserSettings = { userId: number | string }

// prettier-ignore
type SetUserSetting = {userId: number | string; key: UserSetting; value: string | number | boolean}
type GetAllUserSettings = { userId: number | string }

type CheckAccessToken = { userId: number; accessToken?: string }

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
  deleteUserSettings: (data: DeleteUserSettings) => Promise<boolean>
  getAllUserSettings: (data: GetAllUserSettings) => Promise<Record<string, string>[]> // TODO; Type

  // ** Session
  getSession: (data: GetSession) => Promise<any>
  setSession: (data: SetSession) => Promise<any>
  deleteUserSessions: (data: DeleteUserSessions) => Promise<boolean>
  getSessionByUserEmail: (data: GetSessionByUserEmail) => Promise<SessionsSQL | undefined>
  getAllSessions: () => Promise<SessionsSQL[]> // TODO; Type
  getAllUserSessions: (data: GetAllUserSessions) => Promise<Record<string, string>[]> // TODO; Type
  checkAccessToken: (data: CheckAccessToken) => Promise<any> // TODO; Type
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
  getSessionByUserEmail: async (data: GetSessionByUserEmail) => IPCR.invoke(IpcKey.getSessionByUserEmail, data),
  setSession: async (data: SetSession) => IPCR.invoke(IpcKey.setSession, data),
  deleteUserSessions:async (data: DeleteUserSessions) => IPCR.invoke(IpcKey.deleteUserSessions, data),
  getAllSessions:async () => IPCR.invoke(IpcKey.getAllSessions),
  getAllUserSessions:async (data: GetAllUserSessions) => IPCR.invoke(IpcKey.getAllUserSessions, data),
  checkAccessToken:async (data: CheckAccessToken) => IPCR.invoke(IpcKey.checkAccessToken, data),
}
