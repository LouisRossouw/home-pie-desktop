import { electronAPI } from '@electron-toolkit/preload'
import { WindowControl, type ResizeApp } from '@main/app'
import { ipcRenderer } from 'electron'

export type AppAPI = {
  resizeApp: (v: ResizeApp) => void
  loadApp: () => Promise<string>
  windowControl: (v: WindowControl) => Promise<string>
}

export const appAPI = {
  resizeApp: (data: ResizeApp) => electronAPI.ipcRenderer.invoke('resize-app', data),
  loadApp: async () => electronAPI.ipcRenderer.invoke('load-app'),
  windowControl: (data: WindowControl) => {
    ipcRenderer.send('window-control', data)
  }
}

export type PreferencesAPI = {
  test: (v: { v: boolean }) => void
}

export const preferencesAPI = {
  test: (data: { v: boolean }) => electronAPI.ipcRenderer.invoke('test', data)
}

export type Api = AppAPI & PreferencesAPI

export const api = {
  ...appAPI,
  ...preferencesAPI
}
