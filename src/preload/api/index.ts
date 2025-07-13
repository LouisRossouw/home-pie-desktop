import { ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

import { WindowControl, type ResizeApp } from '@main/src/app'

const navAPI = {
  navigateTo: (callback: (event: any, data: { url: string }) => void) =>
    ipcRenderer.on('navigate-to', callback)
}

const appAPI = {
  resizeApp: (data: ResizeApp) => electronAPI.ipcRenderer.invoke('resize-app', data),
  loadApp: async () => electronAPI.ipcRenderer.invoke('load-app'),
  onLoaderProgress: (callback: (event: any, data: { msg: string }) => void) => {
    ipcRenderer.on('loader-progress', callback)
  },
  windowControl: (data: WindowControl) => {
    ipcRenderer.send('window-control', data)
  }
}

const externalAPI = {
  apiProjectList: async () => electronAPI.ipcRenderer.invoke('api-projects-list')
}

const preferencesAPI = {
  test: (data: { v: boolean }) => electronAPI.ipcRenderer.invoke('test', data)
}

const testAPI = {
  apiTest: async () => electronAPI.ipcRenderer.invoke('api-test'),
  apiLogoutTest: () => electronAPI.ipcRenderer.invoke('api-logout-test')
}

export const api = {
  ...appAPI,
  ...externalAPI,
  ...preferencesAPI,
  ...testAPI,
  ...navAPI
}
