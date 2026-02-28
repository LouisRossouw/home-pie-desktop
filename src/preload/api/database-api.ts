import { electronAPI } from '@electron-toolkit/preload'
import { dbIpcKey } from '@shared/constants'

import type * as T from '@shared/types'

const IPCR = electronAPI.ipcRenderer

// prettier-ignore
export type DatabaseAppSettingsAPI = {
  test: (v: { v: boolean }) => void

  // ** Core Settings
  setCoreSetting: T.SetCoreSettingFunc
  getAllCoreSettings: T.GetAllCoreSettingsFunc
  getCoreSetting: T.GetCoreSettingFunc

  // ** User Settings
  setUserSetting: T.SetUserSettingFunc
  getUserSetting: T.GetUserSettingFunc
  getAllUserSettings: T.GetAllUserSettingsFunc

  // ** Session
  setSession: T.SetSessionFunc
  getAllSessions: T.GetAllSessionsFunc
  getSession: T.GetSessionFunc
  deleteUserSessions: T.DeleteUserSessionsFunc
  getSessionByUserEmail: T.GetSessionByUserEmailFunc
  getAllUserSessions: T.GetAllUserSessionsFunc
  checkAccessToken: T.CheckAccessTokenFunc
  findNextActiveAccessToken: T.FindNextActiveAccessTokenFunc

  // ** Finances
  getFinanceSetting: T.GetFinanceSettingFunc
  setFinanceSetting: T.SetFinanceSettingFunc
  getAllFinanceSettings: T.GetAllFinanceSettingsFunc
  getFinanceRecord: (month: number, year: number) => Promise<any>
  setFinanceRecord: (month: number, year: number, value: any) => Promise<any>
  getAllFinanceRecords: () => Promise<any[]>
}



// prettier-ignore
export const databaseAppSettingsAPI = {
  test: (v: { v: boolean }) => IPCR.invoke('test', v),

  // ** Core Settings
  getCoreSetting: async (v: T.GetCoreSetting) => IPCR.invoke(dbIpcKey.getCoreSetting, v),
  setCoreSetting: async (v: T.SetCoreSetting) => IPCR.invoke(dbIpcKey.setCoreSetting, v),
  getAllCoreSettings: async () => IPCR.invoke(dbIpcKey.getAllCoreSettings),

  // ** User Settings
  getUserSetting: async (v: T.GetUserSetting) => IPCR.invoke(dbIpcKey.getUserSetting, v),
  setUserSetting: async (v: T.SetUserSetting) => IPCR.invoke(dbIpcKey.setUserSetting, v),
  getAllUserSettings: async (v: T.GetAllUserSettings) => IPCR.invoke(dbIpcKey.getAllUserSettings, v),

  // ** Session
  getSession: async (v: T.GetSession) => IPCR.invoke(dbIpcKey.getSession, v),
  setSession: async (v: T.SetSession) => IPCR.invoke(dbIpcKey.setSession, v),
  getAllSessions:async () => IPCR.invoke(dbIpcKey.getAllSessions),
  getAllUserSessions:async (v: T.GetAllUserSessions) => IPCR.invoke(dbIpcKey.getAllUserSessions, v),
  getSessionByUserEmail: async (v: T.GetSessionByUserEmail) => IPCR.invoke(dbIpcKey.getSessionByUserEmail, v),
  deleteUserSessions:async (v: T.DeleteUserSessions) => IPCR.invoke(dbIpcKey.deleteUserSessions, v),
  checkAccessToken:async (v: T.CheckAccessToken) => IPCR.invoke(dbIpcKey.checkAccessToken, v),
  findNextActiveAccessToken:async () => IPCR.invoke(dbIpcKey.findNextActiveAccessToken),

  // ** Finances
  getFinanceSetting: async (key: string) => IPCR.invoke(dbIpcKey.getFinanceSetting, key),
  setFinanceSetting: async (v: { key: string; value: any }) => IPCR.invoke(dbIpcKey.setFinanceSetting, v),
  getAllFinanceSettings: async () => IPCR.invoke(dbIpcKey.getAllFinanceSettings),
  getFinanceRecord: async (month: number, year: number) => IPCR.invoke(dbIpcKey.getFinanceRecord, { month, year }),
  setFinanceRecord: async (month: number, year: number, value: any) => IPCR.invoke(dbIpcKey.setFinanceRecord, { month, year, value }),
  getAllFinanceRecords: async () => IPCR.invoke(dbIpcKey.getAllFinanceRecords)
}
