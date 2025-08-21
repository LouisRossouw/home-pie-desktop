import { ipcRenderer, IpcRendererEvent } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

import type { OnResize, ResizeApp, WindowControl } from '@shared/types'
import { DotSquadAnims } from '@shared/dot-squad'

const IPCR = electronAPI.ipcRenderer

export type AppAPI = {
  resizeApp: (v: ResizeApp) => void
  loadApp: (v: { fastLoad: boolean }) => Promise<{ hasLoaded: boolean; isFirstLoad: boolean }>
  maybeFastLoad: () => Promise<{ skipSplash: boolean; skipLoader: boolean }>
  onLoaderProgress: (v: any) => Promise<any>
  windowControl: (v: WindowControl) => Promise<string>
  onWindowResize: (v: any) => Promise<any>
  updateDotSquad: (v: any) => Promise<any>
  listenerCount: (v: any) => Promise<any>
  removeAllListeners: (v: any) => Promise<any>
  removeListener: (v: any, listener: string) => Promise<any>
  openDirectory: (v: { path: string }) => void // TODO; Return & handle error
  emitProcessActivity: (v: any) => Promise<any>
}

// prettier-ignore
export const appAPI = {
  resizeApp: (data: ResizeApp) => IPCR.invoke('resize-app', data),
  maybeFastLoad: async () => IPCR.invoke('maybe-fast-load'),
  loadApp: async (data: {fastLoad: boolean}) => IPCR.invoke('load-app', data),
  onLoaderProgress: (callback: (event: IpcRendererEvent, data: { msg: string }) => void) => {ipcRenderer.on('loader-progress', callback)},
  windowControl: (data: WindowControl) => {ipcRenderer.send('window-control', data)},
  onWindowResize: (callback: (event: IpcRendererEvent, data: OnResize) => void) => {ipcRenderer.on('window-resized', callback)},
  updateDotSquad: (callback: (event: IpcRendererEvent, data: { activity: DotSquadAnims }) => void) => {ipcRenderer.on('dot-squad', callback)},
  listenerCount: (channel: any) => ipcRenderer.listenerCount(channel),
  removeAllListeners: (channel: any) => ipcRenderer.removeAllListeners(channel),
  removeListener: (cb: any, listener: any) => ipcRenderer.removeListener(listener, cb),
  openDirectory: async (data: {path: string}) => IPCR.invoke('open-directory', data),
  emitProcessActivity: (callback: (event: IpcRendererEvent, data: {activity: string}) => void) => {ipcRenderer.on('emit-process-activity', callback)},
}
