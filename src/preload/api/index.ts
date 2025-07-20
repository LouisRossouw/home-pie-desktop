import { ipcRenderer, IpcRendererEvent } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

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
  loadApp: async () => IPCR.invoke('load-app'),
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

const preferencesAPI = {
  test: (data: { v: boolean }) => IPCR.invoke('test', data)
}

const testAPI = {
  apiTest: async () => IPCR.invoke('api-test'),
  apiLogoutTest: () => IPCR.invoke('api-logout-test')
}

export const api = {
  ...appAPI,
  ...externalAPI,
  ...preferencesAPI,
  ...testAPI,
  ...navAPI
}
