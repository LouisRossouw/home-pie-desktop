import { ipcRenderer, IpcRendererEvent } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

import type * as T from '@shared/types'

import { appIpcKey, dbIpcKey } from '@shared/constants'

const IPCR = electronAPI.ipcRenderer

export type AppAPI = {
  resizeApp: T.ResizeAppFunc
  loadApp: T.LoadAppFunc
  maybeFastLoad: T.MaybeFastLoadFunc
  onLoaderProgress: T.OnLoaderProgressFunc
  windowControl: T.WindowControlFunc
  onWindowResize: T.OnWindowResizeFunc
  updateDotSquad: T.UpdateDotSquadFunc
  listenerCount: T.ListenerCountFunc
  removeAllListeners: T.RemoveAllListenersFunc
  removeListener: T.RemoveListenerFunc
  openDirectory: T.OpenDirectoryFunc
  openBrowserToUrl: T.OpenBrowserToUrlFunc
  emitProcessActivity: T.EmitProcessActivityFunc
  apiCompleteAuthentication: T.ApiCompleteAuthenticationFunc
  onAuthCode: T.OnAuthCodeFunc
  apiSignIn: T.ApiSignInFunc
}

// prettier-ignore
export const appAPI = {
  resizeApp: (v: T.ResizeApp) => IPCR.invoke(appIpcKey.resizeApp, v),
  maybeFastLoad: async () => IPCR.invoke(appIpcKey.maybeFastLoad),
  loadApp: async (v: T.LoadApp) => IPCR.invoke(appIpcKey.loadApp, v),
  windowControl: (v: T.WindowControl) => {ipcRenderer.send(appIpcKey.windowControl, v)},
  listenerCount: (v: string) => ipcRenderer.listenerCount(v),
  removeAllListeners: (v: string) => ipcRenderer.removeAllListeners(v),
  removeListener: (cb: any, listener: any) => ipcRenderer.removeListener(listener, cb),
  openDirectory: async (v: T.OpenDirectory) => IPCR.invoke(appIpcKey.openDirectory, v),
  openBrowserToUrl: async (v: T.OpenBrowserToUrl) => IPCR.invoke(appIpcKey.openBrowserToUrl, v),

  updateDotSquad: (callback: T.UpdateDotSquadHandler) => {ipcRenderer.on(appIpcKey.dotSquad, callback)},
  onWindowResize: (callback: T.OnWindowResizeHandler) => {ipcRenderer.on(appIpcKey.windowResized, callback)},
  onLoaderProgress: (callback: T.OnLoaderProgressHandler) => {ipcRenderer.on(appIpcKey.loaderProgress, callback)},
  emitProcessActivity: (callback: (T.EmitProcessActivityHandler)) => {ipcRenderer.on(appIpcKey.emitProcessActivity, callback)},
  onAuthCode: (callback: T.OnAuthCodeHandler) => {ipcRenderer.on(appIpcKey.authCode, callback)},

  apiCompleteAuthentication: async (v: T.ApiCompleteAuth) => IPCR.invoke(appIpcKey.completeAuthApp, v),
  apiSignIn: async (v: T.ApiSignIn) => IPCR.invoke(dbIpcKey.apiSignIn, v),
}
