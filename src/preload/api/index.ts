import { ipcRenderer, IpcRendererEvent } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

import { Setting } from '@shared/types'
import { DotSquadAnims } from '@shared/dot-squad'
import { WindowControl, type ResizeApp } from '@main/src/app'

const IPCR = electronAPI.ipcRenderer

// prettier-ignore
const navAPI = {
  navigateTo: (callback: (event: any, data: { url: string }) => void) => ipcRenderer.on('navigate-to', callback)
}

// prettier-ignore
const appAPI = {
  resizeApp: (data: ResizeApp) => IPCR.invoke('resize-app', data),
  maybeQuickStart: async () => IPCR.invoke('maybe-quick-start'),
  loadApp: async (data: {fastLoad: boolean}) => IPCR.invoke('load-app', data),
  onLoaderProgress: (callback: (event: IpcRendererEvent, data: { msg: string }) => void) => {ipcRenderer.on('loader-progress', callback)},
  windowControl: (data: WindowControl) => {ipcRenderer.send('window-control', data)},
  updateDotSquad: (callback: (event: IpcRendererEvent, data: { activity: DotSquadAnims }) => void) => {ipcRenderer.on('dot-squad', callback)},
  listenerCount: (channel: any) => ipcRenderer.listenerCount(channel),
  removeAllListeners: (channel: any) => ipcRenderer.removeAllListeners(channel),
  removeListener: (cb: any, listener: any) => ipcRenderer.removeListener(listener, cb)
}

const externalAPI = {
  apiProjectList: async () => IPCR.invoke('api-projects-list')
}

// prettier-ignore
const databaseAppSettingsAPI = {
  test: (data: { v: boolean }) => IPCR.invoke('test', data),
  getAppSetting: async (data: { setting: Setting }) => IPCR.invoke('get-app-setting', data),
  setAppSetting: async (data: { setting: Setting; value: string | number | boolean }) => IPCR.invoke('set-app-setting', data),
  getAllAppSettings: async () => IPCR.invoke('get-all-app-settings')
}

const testAPI = {
  apiTest: async () => IPCR.invoke('api-test'),
  apiLogoutTest: () => IPCR.invoke('api-logout-test')
}

export const api = {
  ...databaseAppSettingsAPI,
  ...externalAPI,
  ...testAPI,
  ...appAPI,
  ...navAPI
}
